"use client";
// Same context API the UI already uses, now backed by Firebase (live Firestore listeners + backend callables).
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { collection, doc, onSnapshot, query, Query, Timestamp, where } from "firebase/firestore";
import { db } from "./firebase";
import { logout, watchAuth } from "@/services/auth";
import * as A from "@/services/actions";
import * as M from "@/services/mappers";
export type Role = "student" | "faculty" | "club" | "maintenance" | "admin";
export const waterStatus = (p: any) => p.requested ? "Refill Requested" : p.level > 50 ? "Available" : p.level > 15 ? "Low" : "Empty";
const FLOW = ["Submitted", "Assigned", "In Progress", "Resolved"], CORE = ["water", "restrooms", "events", "clubs", "staff", "announcements"];
const friendly = (e: any) => /permission-denied/.test(e?.code) ? "You don't have access to this data." : /unavailable|network/.test(e?.code) ? "Can't reach the server. Check your connection and retry." : /unauthenticated/.test(e?.code) ? "Your session expired. Sign in again." : e?.message ?? "Something went wrong.";
const Ctx = createContext<any>(null);
export const useApp = () => useContext(Ctx);
export function Provider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null), [role, setRole] = useState<Role | null>(null), [ready, setReady] = useState(false);
  const [d, setD] = useState<any>({}), [error, setError] = useState(""), [nonce, setNonce] = useState(0), [toast, setToast] = useState(""), [local, setLocal] = useState<any>(null);
  const timer = useRef<any>();
  useEffect(() => watchAuth((u, r) => { setUser(u); setRole(r as Role | null); setReady(true); }), []);
  useEffect(() => {
    if (!user || !role) { setD({}); return; }
    setError(""); const un: (() => void)[] = []; const set = (k: string, v: any) => setD((p: any) => ({ ...p, [k]: v })); const c = (p: string) => collection(db, p);
    const sub = (k: string, q: Query, map: (x: any) => any) => un.push(onSnapshot(q, s => set(k, s.docs.map(x => map({ id: x.id, ...x.data() }))), e => setError(friendly(e))));
    sub("water", c("waterPoints"), M.mapWater); sub("restrooms", c("restrooms"), M.mapRestroom); sub("events", c("events"), M.mapEvent); sub("clubs", c("clubs"), M.mapClub);
    sub("staff", c("staff"), M.mapStaff); sub("announcements", c("announcements"), M.mapAnnouncement); sub("timetableRaw", c("timetable"), x => x);
    sub("notes", c(`users/${user.uid}/inbox`), M.mapNote);
    if (role !== "club") sub("complaints", role === "admin" || role === "maintenance" ? c("complaints") : query(c("complaints"), where("createdBy", "==", user.uid)), M.mapComplaint);
    un.push(onSnapshot(doc(db, "users", user.uid), s => set("profile", { id: s.id, ...s.data() }), e => setError(friendly(e))));
    if (role === "student") un.push(onSnapshot(doc(db, "fees", user.uid), s => set("fees", s.exists() ? M.mapFees(s.data()) : null), e => setError(friendly(e))));
    return () => un.forEach(f => f());
  }, [user, role, nonce]);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3200); };
  const act = async (fn: () => Promise<any>, ok?: string) => { try { const r = await fn(); if (ok) say(ok); return r; } catch (e) { say(friendly(e)); } };
  const p = d.profile ?? {}, staff = d.staff ?? [], me = staff.find((s: any) => s.uid === user?.uid);
  const complaints = (d.complaints ?? []).slice().sort((a: any, b: any) => b.ts - a.ts);
  const staffById = Object.fromEntries(staff.map((s: any) => [s.id, s])), raw = d.timetableRaw ?? [];
  const tt = raw.find((x: any) => x.dept === p.department && x.year === p.year) ?? raw[0];
  const value = { user, role, ready, error, toast, retry: () => setNonce(n => n + 1), logout, profile: d.profile,
    loading: !!user && !error && CORE.some(k => d[k] === undefined),
    water: d.water ?? [], restrooms: d.restrooms ?? [], clubs: d.clubs ?? [], staff, announcements: d.announcements ?? [], fees: d.fees ?? null, complaints,
    events: (d.events ?? []).slice().sort((a: any, b: any) => a.ts - b.ts), notes: (d.notes ?? []).slice().sort((a: any, b: any) => b.ts - a.ts),
    timetable: tt ? M.mapTimetable(tt, staffById) : [], regs: p.registeredEvents ?? [], following: p.following ?? [],
    status: local ?? { state: me?.status ?? "Available", loc: me?.loc ?? "" },
    setStatus: (s: any) => { setLocal(s); clearTimeout(timer.current); if (me) timer.current = setTimeout(() => act(() => A.saveStaffStatus(me.id, s.state, s.loc), "Availability updated"), 700); },
    markRead: (id?: string) => act(() => id ? A.markOne(user.uid, id) : A.markAll(user.uid)),
    reportWater: (id: string) => act(() => A.reportWater({ id }), "Refill requested. Maintenance has been alerted."),
    refill: (id: string) => act(() => A.refillWater({ id }), "Marked as refilled."),
    reportRestroom: (id: string) => act(() => A.reportRestroom({ id, issue: "Reported from the app" }), "Issue reported."),
    resolveRestroom: (id: string) => act(() => A.resolveRestroom({ id }), "Marked as resolved."),
    addComplaint: async (f: any) => (await act(() => A.createComplaint({ category: f.cat, location: f.loc, description: f.desc })))?.ticketId ?? "",
    advance: (id: string) => { const cur = complaints.find((x: any) => x.id === id), n = FLOW[FLOW.indexOf(cur?.status) + 1]; if (n) act(() => A.updateComplaint({ id, status: n }), `${id} moved to ${n}`); },
    register: (id: string) => act(() => A.registerEvent({ eventId: id, name: p.name, studentId: p.studentId, department: p.department, year: p.year, email: p.email, phone: p.phone }), "Registered. Check your notifications."),
    follow: (id: string) => act(() => A.follow(user.uid, id, !(p.following ?? []).includes(id))),
    publish: (e: any) => { const start = new Date(Date.parse(e.date + " 2026") || Date.now() + 6048e5);
      return act(() => A.publishEvent({ title: e.title, venue: e.venue, type: e.type, dateLabel: e.date, clubId: p.clubId, clubName: d.clubs?.find((x: any) => x.id === p.clubId)?.name ?? "Club", startsAt: Timestamp.fromDate(start), deadline: Timestamp.fromDate(new Date(start.getTime() - 864e5)), seatsLeft: 50, capacity: 50, registered: 0, audience: { scope: "all" }, status: "published" }), "Published. Students are being notified."); } };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
