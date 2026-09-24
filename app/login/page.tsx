"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { inp } from "@/components/ui";
const msg = (e: any) => ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(e?.code) ? "Wrong email or password." : e?.code === "auth/network-request-failed" ? "Can't reach the server. Check your connection." : e?.code === "auth/too-many-requests" ? "Too many attempts. Try again in a few minutes." : "Sign-in failed. Try again.";
export default function Login() {
  const r = useRouter(); const [email, setE] = useState(""), [pw, setP] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email) || !pw) return setErr("Enter your college email and password.");
    setBusy(true); setErr(""); try { const role = await login(email, pw); if (!role) setErr("This account has no role yet. Ask the admin to assign one."); else r.push("/app/overview"); } catch (x) { setErr(msg(x)); } finally { setBusy(false); } };
  return <main className="grid min-h-screen place-items-center bg-paper p-4"><form onSubmit={go} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8">
    <h1 className="text-2xl font-semibold text-ink">Sign in to Smart Campus 360</h1><p className="mt-1 text-sm text-slate-500">Students, staff and the principal use the same sign-in. Your dashboard depends on your role.</p>
    <input className={inp + " mt-6"} placeholder="College email" value={email} onChange={e => setE(e.target.value)} aria-label="Email" autoComplete="username" />
    <input className={inp + " mt-3"} type="password" placeholder="Password" value={pw} onChange={e => setP(e.target.value)} aria-label="Password" autoComplete="current-password" />
    {err && <p role="alert" className="mt-2 text-sm text-red-600">{err}</p>}
    <button disabled={busy} className="mt-5 w-full rounded-lg bg-brand py-2.5 font-medium text-white hover:bg-ink disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
    {process.env.NEXT_PUBLIC_USE_EMULATOR === "true" && <p className="mt-4 text-xs text-slate-400">Local demo: student@ · faculty@ · club@ · maint@ · admin@campus.edu / Campus@123</p>}</form></main>;
}
