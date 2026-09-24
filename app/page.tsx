import Link from "next/link";
export const dynamic = "force-dynamic";
const f = [["💧","Water & restroom status","Know which can is empty before you walk there."],["🎯","Club hub","Every workshop, contest and meeting, with instant alerts."],["👨‍🏫","Staff locator","Find faculty from timetables and their own updates."],["📝","Helpdesk","Raise a ticket and follow it until it's fixed."]];
export default function Landing() {
  return <div className="min-h-screen bg-white"><header className="mx-auto flex max-w-6xl items-center justify-between p-5"><span className="text-lg font-semibold text-ink">Smart Campus 360</span><Link href="/login" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-ink">Sign in</Link></header>
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24"><h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">One digital platform for every campus need.</h1>
      <p className="mt-5 max-w-xl text-lg text-slate-600">Students, faculty, clubs, administration and maintenance on the same page: status, events, tickets and notices in real time.</p>
      <Link href="/login" className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-ink">Open the demo</Link></section>
    <section className="bg-paper py-14"><div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">{f.map(([i, t, d]) => <div key={t} className="rounded-xl border border-slate-200 bg-white p-5"><span className="text-2xl">{i}</span><p className="mt-3 font-semibold text-ink">{t}</p><p className="mt-1 text-sm text-slate-500">{d}</p></div>)}</div></section></div>;
}
