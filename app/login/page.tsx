"use client";
export const dynamic = "force-dynamic";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { inp } from "@/components/ui";
import { useState } from "react";

const DEMO_USERS = [
  { email: "student@campus.edu", role: "student", name: "Ananya Ramesh (Student)" },
  { email: "faculty@campus.edu", role: "faculty", name: "Dr. Meera Krishnan (Faculty)" },
  { email: "club@campus.edu",    role: "club",    name: "AI Club Coordinator (Club)" },
  { email: "maint@campus.edu",   role: "maintenance", name: "Maintenance Team" },
  { email: "admin@campus.edu",   role: "admin",   name: "Campus Admin" },
];

export default function Login() {
  const { login } = useApp();
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DEMO_USERS.find(u => u.email === email.trim().toLowerCase());
    if (!user) return setErr("Use one of the demo emails below.");
    if (pw !== "Campus@123") return setErr("Password: Campus@123");
    login(user.role as any);
    r.push("/app/overview");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4">
      <form onSubmit={go} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-ink">Sign in to Smart Campus 360</h1>
        <p className="mt-1 text-sm text-slate-500">Pick a demo account below and use password <b>Campus@123</b></p>
        <input className={inp + " mt-6"} placeholder="College email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
        <input className={inp + " mt-3"} type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
        {err && <p role="alert" className="mt-2 text-sm text-red-600">{err}</p>}
        <button className="mt-5 w-full rounded-lg bg-brand py-2.5 font-medium text-white hover:bg-ink">Sign in</button>
        <div className="mt-6 space-y-2 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Demo accounts</p>
          {DEMO_USERS.map(u => (
            <button key={u.role} type="button" onClick={() => { setEmail(u.email); setPw("Campus@123"); }}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-brand hover:text-brand">
              {u.name} <span className="text-xs text-slate-400">· {u.email}</span>
            </button>
          ))}
        </div>
      </form>
    </main>
  );
}
