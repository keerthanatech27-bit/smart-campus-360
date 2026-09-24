import { ReactNode } from "react";
const tones: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200", amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200", blue: "bg-blue-50 text-blue-700 ring-blue-200", gray: "bg-slate-100 text-slate-600 ring-slate-200" };
const map: Record<string, string> = { Available: "green", Resolved: "green", Good: "green", Normal: "green", Available_: "green",
  Low: "amber", "Available Soon": "amber", "In Progress": "amber", Assigned: "blue", Fair: "amber", "Refill Requested": "blue", "In Class": "blue", "In Lab": "blue", "In Meeting": "blue",
  Empty: "red", Unavailable: "red", "Under Maintenance": "red", "Issue Reported": "red", "Needs Cleaning": "red", "On Leave": "gray", Submitted: "gray" };
export const Badge = ({ s }: { s: string }) => <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[map[s] ?? "gray"]}`}><i className="h-1.5 w-1.5 rounded-full bg-current" />{s}</span>;
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>{children}</div>;
export const Head = ({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) => <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold text-ink">{title}</h1>{sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}</div>{action}</div>;
export const Btn = ({ children, onClick, kind = "primary", disabled }: any) => <button disabled={disabled} onClick={onClick} className={`rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${kind === "primary" ? "bg-brand text-white hover:bg-ink" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{children}</button>;
export const Bar = ({ v, color = "bg-teal" }: { v: number; color?: string }) => <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={v}><div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${v}%` }} /></div>;
export const Stat = ({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) => <Card><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-semibold text-ink">{value}</p>{hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}</Card>;
export const Empty = ({ text }: { text: string }) => <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">{text}</div>;
export const inp = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none";
export const Skeleton = () => <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />)}</div>;
