"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Skeleton } from "@/components/ui";
export const NAV: Record<string, [string, string, string][]> = {
  student: [["overview","Overview","🏠"],["clubs","Club hub","🎯"],["staff","Staff locator","👨‍🏫"],["water","Drinking water","💧"],["restrooms","Restrooms","🚻"],["helpdesk","Helpdesk","📝"],["timetable","Timetable","📅"],["fees","Fees","💰"],["notifications","Notifications","🔔"],["profile","Profile","👤"]],
  faculty: [["overview","Overview","🏠"],["staff","Availability","👨‍🏫"],["timetable","Timetable","📅"],["notifications","Announcements","🔔"],["profile","Profile","👤"]],
  club: [["overview","Overview","🏠"],["clubs","Events & registrations","🎯"],["analytics","Event analytics","📊"],["notifications","Notifications","🔔"]],
  maintenance: [["overview","Overview","🏠"],["water","Water points","💧"],["restrooms","Restrooms","🚻"],["helpdesk","Assigned tickets","📝"],["notifications","Notifications","🔔"]],
  admin: [["overview","Overview","🏠"],["analytics","Analytics","📊"],["helpdesk","Complaints","📝"],["water","Water status","💧"],["restrooms","Restrooms","🚻"],["staff","Staff","👨‍🏫"],["clubs","Clubs & events","🎯"],["fees","Fees","💰"],["notifications","Notifications","🔔"]],
};
export default function Shell({ module, children }: { module: string; children: (allowed: boolean) => ReactNode }) {
  const { role, ready, logout, notes, error, retry, loading, toast } = useApp(); const r = useRouter(); const [open, setOpen] = useState(false);
  useEffect(() => { if (ready && !role) r.replace("/login"); }, [ready, role, r]);
  if (!role) return <div className="grid h-screen place-items-center text-slate-400">Loading…</div>;
  const nav = NAV[role]; const unread = notes.filter((n: any) => !n.read).length;
  return <div className="min-h-screen lg:flex">
    <aside className={`fixed inset-y-0 z-30 w-64 bg-ink p-4 text-slate-200 transition lg:static lg:translate-x-0 ${open ? "" : "-translate-x-full"}`}>
      <p className="mb-6 px-2 text-lg font-semibold text-white">Smart Campus 360</p>
      <nav className="space-y-1">{nav.map(([k, l, i]) => <Link key={k} href={`/app/${k}`} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${k === module ? "bg-white/15 text-white" : "hover:bg-white/10"}`}><span>{i}</span>{l}</Link>)}</nav></aside>
    <div className="flex-1">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        <p className="flex items-center gap-2 text-sm text-slate-500"><i className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />Live · <span className="capitalize">{role}</span></p>
        <div className="flex items-center gap-4"><Link href="/app/notifications" className="relative" aria-label="Notifications">🔔{unread > 0 && <b className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-[10px] text-white">{unread}</b>}</Link>
          <button className="text-sm text-slate-500 hover:text-ink" onClick={() => { logout(); r.push("/login"); }}>Sign out</button></div></header>
      <main className="mx-auto max-w-6xl p-4 sm:p-8">{error && <div role="alert" className="mb-4 flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}<button className="font-medium underline" onClick={retry}>Retry</button></div>}{loading ? <Skeleton /> : children(nav.some(n => n[0] === module))}</main>{toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}</div></div>;
}
