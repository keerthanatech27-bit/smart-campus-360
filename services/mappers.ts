// Backend (Firestore) field names -> the shape the existing UI components already use.
const dt = (t: any): Date | null => (t?.toDate ? t.toDate() : null);
export const ms = (t: any) => dt(t)?.getTime() ?? 0;
export const hm = (t: any) => dt(t)?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "—";
export const dm = (t: any) => dt(t)?.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) ?? "TBD";
export const rel = (t: any) => { const m = Math.max(0, Math.round((Date.now() - ms(t)) / 6e4)); return !ms(t) || m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`; };
const NOTE_ICON: any = { Clubs: "🔔", Events: "📅", "Campus Issues": "📝", Fees: "💰", Academic: "📢", Emergency: "🚨" };
const CLUB_ICON: any = { Technical: "💻", Cultural: "🎭", Literary: "📚", Arts: "📷", Entrepreneurship: "🚀", Sports: "🏏", "Social Service": "🤝", Department: "🧩" };
export const mapWater = (x: any) => ({ ...x, refill: hm(x.lastRefill), updated: hm(x.updatedAt) });
export const mapRestroom = (x: any) => ({ id: x.id, name: x.name, water: x.water, clean: x.cleanliness, maint: x.maintenance, inspected: hm(x.lastInspection) });
export const mapComplaint = (x: any) => ({ id: x.id, cat: x.category, loc: x.location, desc: x.description, status: x.status, by: x.createdByName ?? "Student", date: dm(x.createdAt), assignee: x.assignee ?? "—", ts: ms(x.createdAt) });
export const mapEvent = (x: any) => ({ id: x.id, title: x.title, club: x.clubName, clubId: x.clubId, type: x.type, date: x.dateLabel ?? dm(x.startsAt), time: hm(x.startsAt), venue: x.venue, deadline: dm(x.deadline), seats: x.seatsLeft ?? 0, dept: x.audience?.scope === "department" ? x.audience.value : "All", ts: ms(x.startsAt) });
export const mapNote = (x: any) => ({ id: x.id, type: x.type, icon: NOTE_ICON[x.type] ?? "🔔", title: x.title, body: x.body, time: rel(x.createdAt), read: !!x.read, ref: x.ref, ts: ms(x.createdAt) });
export const mapStaff = (x: any) => ({ id: x.id, uid: x.uid, name: x.name, dept: x.department, subject: x.subject, status: x.status, loc: x.location, next: x.next });
export const mapClub = (x: any) => ({ id: x.id, name: x.name, cat: x.category, icon: CLUB_ICON[x.category] ?? "🎯", about: x.description, coord: x.coordinator });
export const mapAnnouncement = (x: any) => ({ id: x.id, cat: x.category, title: x.title, time: rel(x.createdAt), important: !!x.important });
export const mapFees = (x: any) => ({ semester: x.semester, total: x.total, paid: x.paid, due: dm(x.dueDate), history: (x.payments ?? []).map((p: any) => [p.id, p.label, "₹" + Number(p.amount).toLocaleString("en-IN"), p.date ?? "Paid"]) });
export const mapTimetable = (t: any, staff: any) => (t.slots ?? []).map(([time, subject, fid, room]: string[]) => [time, subject, staff[fid]?.name ?? fid, room]);
