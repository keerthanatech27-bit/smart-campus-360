"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import * as D from "@/lib/data";

export type Role = "student" | "faculty" | "club" | "maintenance" | "admin";
export const waterStatus = (p: any) => p.requested ? "Refill Requested" : p.level > 50 ? "Available" : p.level > 15 ? "Low" : "Empty";

const ROLES: Role[] = ["student", "faculty", "club", "maintenance", "admin"];

const Ctx = createContext<any>(null);
export const useApp = () => useContext(Ctx);

export function Provider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student");
  const [water, setWater] = useState(D.water);
  const [restrooms, setRestrooms] = useState(D.restrooms);
  const [complaints, setComplaints] = useState(D.complaints);
  const [events, setEvents] = useState(D.events);
  const [notes, setNotes] = useState(D.notifications);
  const [regs, setRegs] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(["c1", "c2"]);
  const [status, setStatus] = useState({ state: "Available", loc: "Staff Room 1" });
  const [toast, setToast] = useState("");
  const [ticketN, setTicketN] = useState(2044);

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3200); };

  const profile = {
    name: role === "student" ? "Ananya Ramesh" : role === "faculty" ? "Dr. Meera Krishnan" : role === "club" ? "AI Club Coordinator" : role === "maintenance" ? "Maintenance Team" : "Campus Admin",
    email: `${role}@campus.edu`,
    department: "IT",
    year: 3,
    studentId: "21IT045",
    phone: "9876543210",
    interests: ["AI", "Web"],
    clubId: "c1",
    registeredEvents: regs,
    following,
  };

  const value = {
    role, ready: true, error: "", toast, loading: false,
    profile, user: { uid: role },
    water, restrooms, clubs: D.clubs, staff: D.faculty,
    announcements: D.announcements, fees: D.fees,
    complaints: [...complaints].sort((a: any, b: any) => b.id > a.id ? 1 : -1),
    events: [...events].sort((a, b) => a.date > b.date ? 1 : -1),
    notes: [...notes].sort((a: any, b: any) => a.read ? 1 : -1),
    timetable: D.timetable, regs, following, status,
    setStatus: (s: any) => { setStatus(s); say("Availability updated"); },
    logout: () => {},
    retry: () => {},

    // Switch role (login simulation)
    login: (r: Role) => { setRole(r); },

    markRead: (id?: string | number) => {
      setNotes(n => id ? n.map((x: any) => x.id === id ? { ...x, read: true } : x) : n.map((x: any) => ({ ...x, read: true })));
    },
    reportWater: (id: string) => {
      setWater(w => w.map(p => p.id === id ? { ...p, requested: true } : p));
      say("Refill requested. Maintenance has been alerted.");
    },
    refill: (id: string) => {
      setWater(w => w.map(p => p.id === id ? { ...p, level: 100, requested: false } : p));
      say("Marked as refilled.");
    },
    reportRestroom: (id: string) => {
      setRestrooms(r => r.map(p => p.id === id ? { ...p, maint: "Issue Reported" } : p));
      say("Issue reported.");
    },
    resolveRestroom: (id: string) => {
      setRestrooms(r => r.map(p => p.id === id ? { ...p, maint: "Normal" } : p));
      say("Marked as resolved.");
    },
    addComplaint: async (f: any) => {
      const id = `SC-${ticketN}`; setTicketN(n => n + 1);
      setComplaints(c => [{ id, cat: f.cat, loc: f.loc, desc: f.desc, status: "Submitted", by: "You", date: "Today", assignee: "—" }, ...c]);
      say(`Complaint ${id} submitted.`);
      return id;
    },
    advance: (id: string) => {
      const flow = ["Submitted", "Assigned", "In Progress", "Resolved"];
      setComplaints(c => c.map((x: any) => x.id === id ? { ...x, status: flow[Math.min(flow.indexOf(x.status) + 1, 3)] } : x));
      say(`${id} moved to next stage.`);
    },
    register: (id: string) => {
      setRegs(r => [...r, id]);
      setEvents(e => e.map(x => x.id === id ? { ...x, seats: Math.max(0, x.seats - 1) } : x));
      say("Registered. Check your notifications.");
    },
    follow: (id: string) => {
      setFollowing(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    },
    publish: (e: any) => {
      const newEvent = { id: `e${Date.now()}`, title: e.title, club: profile.name, clubId: profile.clubId ?? "c1", type: e.type, date: e.date, time: "10:00 AM", venue: e.venue, deadline: "TBD", seats: 50, dept: "All" };
      setEvents(ev => [...ev, newEvent]);
      say("Published. Students are being notified.");
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
