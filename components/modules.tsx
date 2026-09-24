"use client";
import { useState } from "react";
import Link from "next/link";
import * as D from "@/lib/data";
import { useApp, waterStatus } from "@/lib/store";
import { Badge, Card, Head, Btn, Bar, Stat, Empty, inp } from "./ui";

export function Overview() {
  const { water, restrooms, complaints, events, notes, role, staff, announcements, profile } = useApp();
  const empty = water.filter((w: any) => waterStatus(w) === "Empty").length;
  const rr = restrooms.filter((r: any) => r.maint !== "Normal").length;
  const open = complaints.filter((c: any) => c.status !== "Resolved").length;
  const tiles = [["💧","Drinking Water",`${empty} empty`,empty?"Empty":"Available","water"],["🚻","Restrooms",`${rr} need attention`,rr?"Issue Reported":"Available","restrooms"],
   ["👨‍🏫","Staff Available",`${staff.filter((f: any) => f.status==="Available").length} of ${staff.length}`,"Available","staff"],["📝","Complaints",`${open} open`,open?"In Progress":"Resolved","helpdesk"],
   ["🎯","Club Activities",`${events.length} upcoming`,"Available","clubs"],["💰","Fees","₹25,000 pending","Low","fees"],["📅","Timetable","Next: 11:00 Web Lab","Available","timetable"],["📢","Announcements",`${announcements.length} new`,"Available","notifications"]];
  return <><Head title="Campus overview" sub="Live status across all blocks" />
    {announcements.filter((a: any) => a.important).map((a: any) => <div key={a.id} className="mb-6 flex items-center gap-3 rounded-xl border-l-4 border-brand bg-blue-50 p-4"><span className="text-xl">📢</span><div><p className="font-medium text-ink">{a.title}</p><p className="text-xs text-slate-500">{a.cat} · {a.time}</p></div></div>)}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{tiles.map(([i,t,v,s,to]) => <Link key={t} href={`/app/${to}`}><Card className="h-full transition hover:border-brand"><div className="flex justify-between"><span className="text-2xl">{i}</span><Badge s={s} /></div><p className="mt-3 text-sm text-slate-500">{t}</p><p className="text-lg font-semibold text-ink">{v}</p><p className="mt-1 text-xs text-slate-400">Last updated {D.now()}</p></Card></Link>)}</div>
    {role === "student" && <div className="mt-8"><h2 className="mb-3 font-semibold text-ink">For you · {profile?.department}, Year {profile?.year}</h2><div className="grid gap-3 md:grid-cols-3">{events.filter((e: any) => e.dept === (profile?.department ?? "IT") || e.dept === "All").slice(0, 3).map((e: any) => <EventCard key={e.id} e={e} />)}</div></div>}</>;
}

export function EventCard({ e }: { e: any }) {
  const { regs, register } = useApp(); const [open, setOpen] = useState(false); const done = regs.includes(e.id);
  return <Card><div className="flex justify-between"><Badge s={e.seats < 10 ? "Low" : "Available"} /><span className="text-xs text-slate-500">{e.type}</span></div>
    <h3 className="mt-2 font-semibold text-ink">{e.title}</h3><p className="text-sm text-slate-500">{e.club}</p>
    <p className="mt-2 text-sm">{e.date} · {e.time} · {e.venue}</p><p className="text-xs text-slate-400">Register by {e.deadline} · {e.seats} seats left</p>
    {open && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">Organised by {e.club}. Open to {e.dept === "All" ? "all departments" : e.dept + " students"}. Registration confirmation is sent to your inbox.</p>}
    <div className="mt-3 flex gap-2"><Btn disabled={done || e.seats < 1} onClick={() => register(e.id)}>{done ? "Registered" : "Register now"}</Btn><Btn kind="ghost" onClick={() => setOpen(!open)}>{open ? "Hide" : "Details"}</Btn></div></Card>;
}

export function Water() {
  const { water, reportWater, refill, role } = useApp(); const m = role === "maintenance" || role === "admin";
  return <><Head title="Drinking water" sub="Sensor-ready: each point reads a `level` value that IoT devices can update." />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{water.map((p: any) => { const s = waterStatus(p); return <Card key={p.id}><div className="flex justify-between"><div><p className="font-medium text-ink">{p.can}</p><p className="text-sm text-slate-500">{p.block}</p></div><Badge s={s} /></div>
      <div className="mt-4"><Bar v={p.level} color={p.level > 50 ? "bg-teal" : p.level > 15 ? "bg-amber-500" : "bg-red-500"} /><p className="mt-1 text-xs text-slate-400">{p.level}% · Refilled {p.refill} · Updated {p.updated}</p></div>
      <div className="mt-3">{m ? <Btn onClick={() => refill(p.id)} disabled={s === "Available"}>Mark refilled</Btn> : <Btn kind="ghost" disabled={s === "Available" || p.requested} onClick={() => reportWater(p.id)}>{p.requested ? "Refill requested" : "Report empty"}</Btn>}</div></Card>; })}</div></>;
}

export function Restrooms() {
  const { restrooms, reportRestroom, resolveRestroom, role } = useApp(); const m = role === "maintenance" || role === "admin";
  return <><Head title="Restroom monitoring" sub="Water, cleanliness and maintenance by block and floor" />
    <div className="grid gap-4 md:grid-cols-2">{restrooms.map((r: any) => <Card key={r.id}><p className="font-medium text-ink">{r.name}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">{[["Water", r.water], ["Cleanliness", r.clean], ["Maintenance", r.maint]].map(([k, v]) => <div key={k}><dt className="mb-1 text-xs text-slate-500">{k}</dt><dd><Badge s={v} /></dd></div>)}</dl>
      <p className="mt-3 text-xs text-slate-400">Last inspection {r.inspected}</p>
      <div className="mt-3">{m ? <Btn onClick={() => resolveRestroom(r.id)} disabled={r.maint === "Normal"}>Mark resolved</Btn> : <Btn kind="ghost" onClick={() => reportRestroom(r.id)} disabled={r.maint !== "Normal"}>{r.maint !== "Normal" ? "Issue reported" : "Report issue"}</Btn>}</div></Card>)}</div></>;
}

export function Staff() {
  const { role, status, setStatus, staff } = useApp(); const [q, setQ] = useState("");
  const list = staff.filter((f: any) => [f.name, f.dept, f.id, f.subject].join(" ").toLowerCase().includes(q.toLowerCase()));
  return <><Head title="Staff locator" sub="Based on timetables and staff-updated status, not GPS tracking." />
    {role === "faculty" && <Card className="mb-6"><p className="mb-3 font-medium text-ink">Update my availability</p><div className="flex flex-wrap gap-2">
      <select className={inp + " max-w-[200px]"} value={status.state} onChange={e => setStatus({ ...status, state: e.target.value })}>{["Available", "In Class", "In Lab", "In Meeting", "On Leave"].map(s => <option key={s}>{s}</option>)}</select>
      <input className={inp + " max-w-xs"} value={status.loc} onChange={e => setStatus({ ...status, loc: e.target.value })} aria-label="Location" /><Badge s={status.state} /></div></Card>}
    <input className={inp + " mb-4 max-w-md"} placeholder="Search by name, department, ID or subject" value={q} onChange={e => setQ(e.target.value)} />
    {list.length === 0 ? <Empty text="No staff match your search. Try a department or subject." /> :
    <div className="grid gap-4 md:grid-cols-2">{list.map(f => <Card key={f.id}><div className="flex justify-between"><div><p className="font-medium text-ink">{f.name}</p><p className="text-sm text-slate-500">{f.dept} · {f.id}</p></div><Badge s={f.status} /></div>
      <p className="mt-3 text-sm">📍 {f.loc}</p><p className="text-sm text-slate-600">Next available: {f.next}</p><p className="text-xs text-slate-400">Teaches {f.subject}</p></Card>)}</div>}</>;
}

export function Helpdesk() {
  const { complaints, addComplaint, advance, role } = useApp(); const m = role === "admin" || role === "maintenance";
  const [f, setF] = useState({ cat: "Drinking Water", loc: "", desc: "" }); const [err, setErr] = useState(""); const [done, setDone] = useState("");
  const submit = async () => { if (!f.loc.trim() || f.desc.trim().length < 10) return setErr("Add a location and a description of at least 10 characters."); setErr(""); setDone(await addComplaint(f)); setF({ ...f, loc: "", desc: "" }); };
  const steps = ["Submitted", "Assigned", "In Progress", "Resolved"];
  return <><Head title="Campus helpdesk" sub="Raise an issue and track it to resolution." />
    <div className="grid gap-6 lg:grid-cols-3">
      {!m && role !== "faculty" && <Card><p className="mb-3 font-medium text-ink">New complaint</p><div className="space-y-3">
        <select className={inp} value={f.cat} onChange={e => setF({ ...f, cat: e.target.value })}>{["Drinking Water", "Restroom", "Classroom", "Laboratory", "Electricity", "Wi-Fi", "Cleaning", "Furniture", "Security", "Other"].map(c => <option key={c}>{c}</option>)}</select>
        <input className={inp} placeholder="Location (e.g. Block B – 204)" value={f.loc} onChange={e => setF({ ...f, loc: e.target.value })} />
        <textarea className={inp} rows={3} placeholder="What's wrong?" value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} />
        <input type="file" accept="image/*" className="text-xs" aria-label="Upload image" />
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}{done && <p className="text-sm text-emerald-700">Submitted as {done}</p>}<Btn onClick={submit}>Submit complaint</Btn></div></Card>}
      <div className={`space-y-3 ${!m && role !== "faculty" ? "lg:col-span-2" : "lg:col-span-3"}`}>{complaints.map((c: any) => <Card key={c.id}><div className="flex flex-wrap justify-between gap-2"><div><p className="font-medium text-ink">{c.id} · {c.cat}</p><p className="text-sm text-slate-500">{c.loc} · {c.by} · {c.date}</p></div><Badge s={c.status} /></div>
        <p className="mt-2 text-sm">{c.desc}</p><div className="mt-3 flex gap-1">{steps.map((s, i) => <div key={s} className={`h-1.5 flex-1 rounded ${i <= steps.indexOf(c.status) ? "bg-teal" : "bg-slate-200"}`} title={s} />)}</div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>Assigned to {c.assignee}</span>{m && c.status !== "Resolved" && <Btn kind="ghost" onClick={() => advance(c.id)}>Move to next stage</Btn>}</div></Card>)}</div></div></>;
}

export function Clubs() {
  const { following, follow, events, publish, role, clubs } = useApp(); const [cat, setCat] = useState("All"); const [f, setF] = useState({ title: "", date: "", venue: "" });
  const cats: string[] = ["All", ...Array.from(new Set<string>(clubs.map((c: any) => c.cat as string)))];
  return <><Head title="Club hub" sub="Every official club and activity in one place." />
    {role === "club" && <Card className="mb-6"><p className="mb-3 font-medium text-ink">Publish a new activity</p><div className="flex flex-wrap gap-2">
      <input className={inp + " max-w-xs"} placeholder="Event title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /><input className={inp + " max-w-[160px]"} placeholder="Date, e.g. 20 Oct" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} />
      <input className={inp + " max-w-[200px]"} placeholder="Venue" value={f.venue} onChange={e => setF({ ...f, venue: e.target.value })} />
      <Btn disabled={!f.title || !f.date || !f.venue} onClick={() => { publish({ ...f, type: "Workshop" }); setF({ title: "", date: "", venue: "" }); }}>Publish and notify students</Btn></div></Card>}
    <h2 className="mb-3 font-semibold text-ink">Upcoming activities</h2><div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{events.map((e: any) => <EventCard key={e.id} e={e} />)}</div>
    <div className="mb-3 flex flex-wrap gap-2">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1 text-sm ${cat === c ? "border-brand bg-brand text-white" : "border-slate-300 bg-white"}`}>{c}</button>)}</div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{clubs.filter((c: any) => cat === "All" || c.cat === cat).map(c => <Card key={c.id}><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-2xl">{c.icon}</span><div><p className="font-medium text-ink">{c.name}</p><p className="text-xs text-slate-500">{c.cat} · Coordinator {c.coord}</p></div></div>
      <p className="mt-3 text-sm text-slate-600">{c.about}</p><div className="mt-3"><Btn kind={following.includes(c.id) ? "ghost" : "primary"} onClick={() => follow(c.id)}>{following.includes(c.id) ? "Following" : "Follow"}</Btn></div></Card>)}</div></>;
}

export function Notifications() {
  const { notes, markRead } = useApp(); const [t, setT] = useState("All"); const list = notes.filter((n: any) => t === "All" || n.type === t);
  return <><Head title="Notification center" sub="Filter by type, mark as read, and review history." action={<Btn kind="ghost" onClick={() => markRead()}>Mark all as read</Btn>} />
    <div className="mb-4 flex flex-wrap gap-2">{["All", "Academic", "Clubs", "Events", "Fees", "Campus Issues", "Emergency"].map(c => <button key={c} onClick={() => setT(c)} className={`rounded-full border px-3 py-1 text-sm ${t === c ? "border-brand bg-brand text-white" : "border-slate-300 bg-white"}`}>{c}</button>)}</div>
    {list.length === 0 ? <Empty text="You're all caught up in this category." /> : <div className="space-y-2">{list.map((n: any) => <Card key={n.id} className={n.read ? "" : "border-l-4 border-l-brand"}><div className="flex items-start gap-3"><span className="text-xl">{n.icon}</span><div className="flex-1"><p className="font-medium text-ink">{n.title}</p><p className="text-sm text-slate-500">{n.body}</p><p className="mt-1 text-xs text-slate-400">{n.type} · {n.time}</p></div>{!n.read && <Btn kind="ghost" onClick={() => markRead(n.id)}>Mark read</Btn>}</div></Card>)}</div>}
    <Card className="mt-6"><p className="mb-2 font-medium text-ink">Preferences</p>{["Club events", "Fee reminders", "Complaint updates", "Academic updates"].map(p => <label key={p} className="mr-5 inline-flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />{p}</label>)}<p className="mt-2 text-xs text-slate-400">Emergency alerts are always on.</p></Card></>;
}

export function Fees() {
  const { fees } = useApp(); const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
  if (!fees) return <><Head title="Fees" /><Empty text="No fee record is linked to this account yet." /></>;
  const p = Math.round(fees.paid / fees.total * 100);
  return <><Head title="Fees" sub={fees.semester} /><div className="grid gap-4 sm:grid-cols-3"><Stat label="Total" value={inr(fees.total)} /><Stat label="Paid" value={inr(fees.paid)} /><Stat label="Pending" value={inr(fees.total - fees.paid)} hint={`Due ${fees.due}`} /></div>
    <Card className="mt-4"><div className="mb-2 flex justify-between text-sm"><span>Payment progress</span><span>{p}%</span></div><Bar v={p} /></Card>
    <Card className="mt-4"><p className="mb-3 font-medium text-ink">Payment history</p>{fees.history.map((h: string[]) => <div key={h[0]} className="flex justify-between border-t border-slate-100 py-2 text-sm"><span>{h[1]} <span className="text-xs text-slate-400">{h[0]} · {h[3]}</span></span><span>{h[2]}</span></div>)}</Card></>;
}

export function Timetable() {
  const { role, timetable } = useApp();
  return <><Head title={role === "faculty" ? "My timetable" : "Timetable"} sub="Your class schedule" />{timetable.length === 0 ? <Empty text="No timetable has been published for your class yet." /> :
    <Card><div className="divide-y divide-slate-100">{timetable.map((r: string[], i: number) => <div key={r[0]} className="grid grid-cols-[70px_1fr] gap-3 py-3 text-sm sm:grid-cols-[70px_1fr_1fr_100px]"><span className="font-medium text-brand">{r[0]}</span><span className="font-medium text-ink">{r[1]}</span><span className="text-slate-500">{r[2]}</span><span className="text-slate-500">{r[3]} · P{i + 1}</span></div>)}</div></Card>}</>;
}

export function Analytics() {
  const { complaints, events, water, restrooms, clubs } = useApp();
  const bars = [["Hackathon", 92], ["AI Workshop", 74], ["Debate", 55], ["Founders Talk", 110], ["Photo Walk", 28]]; const max = 110;
  return <><Head title="Analytics" sub="Campus-wide performance this month" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <Stat label="Total students" value="4,820" /><Stat label="Active clubs" value={clubs.length} /><Stat label="Upcoming events" value={events.length} /><Stat label="Notification reach" value="94%" />
    <Stat label="Open complaints" value={complaints.filter((c: any) => c.status !== "Resolved").length} /><Stat label="Resolved" value={complaints.filter((c: any) => c.status === "Resolved").length} />
    <Stat label="Water issues" value={water.filter((w: any) => waterStatus(w) !== "Available").length} /><Stat label="Restroom issues" value={restrooms.filter((r: any) => r.maint !== "Normal").length} /></div>
    <Card className="mt-4"><p className="mb-4 font-medium text-ink">Event registrations</p><div className="flex h-44 items-end gap-4">{bars.map(([n, v]) => <div key={n as string} className="flex flex-1 flex-col items-center gap-2"><span className="text-xs text-slate-500">{v}</span><div className="w-full rounded-t bg-brand" style={{ height: `${(v as number) / max * 100}%` }} /><span className="text-center text-xs text-slate-500">{n}</span></div>)}</div></Card></>;
}

export function Profile() {
  const { role, profile } = useApp(); if (!profile) return <Empty text="Profile unavailable. Retry from the banner above." />;
  const ini = (profile.name ?? "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2);
  return <><Head title="Profile" /><Card className="max-w-lg"><div className="flex items-center gap-4"><span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-xl text-white">{ini}</span><div><p className="text-lg font-semibold text-ink">{profile.name}</p><p className="text-sm text-slate-500 capitalize">{role}{profile.department ? ` · ${profile.department}` : ""}{profile.year ? ` · Year ${profile.year}` : ""}</p></div></div>
    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-400">ID</dt><dd>{profile.studentId ?? "—"}</dd></div><div><dt className="text-slate-400">Email</dt><dd>{profile.email}</dd></div><div><dt className="text-slate-400">Phone</dt><dd>{profile.phone ?? "—"}</dd></div><div><dt className="text-slate-400">Interests</dt><dd>{(profile.interests ?? []).join(", ") || "—"}</dd></div></dl></Card></>;
}
