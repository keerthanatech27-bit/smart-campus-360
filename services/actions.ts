// All writes go through here. Sensitive ones are backend callables (validated + role-checked server-side).
import { httpsCallable } from "firebase/functions";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { db, fns } from "@/lib/firebase";
const call = (n: string) => (d?: any) => httpsCallable(fns, n)(d).then(r => r.data as any);
export const createComplaint = call("createComplaint"), updateComplaint = call("updateComplaint");
export const reportWater = call("reportWater"), refillWater = call("refillWater");
export const reportRestroom = call("reportRestroom"), resolveRestroom = call("resolveRestroom");
export const registerEvent = call("registerEvent");
export const follow = (uid: string, clubId: string, on: boolean) => updateDoc(doc(db, "users", uid), { following: on ? arrayUnion(clubId) : arrayRemove(clubId) });
export const publishEvent = (e: any) => addDoc(collection(db, "events"), e);
export const saveStaffStatus = (id: string, status: string, location: string) => updateDoc(doc(db, "staff", id), { status, location, updatedAt: serverTimestamp() });
export const markOne = (uid: string, id: string) => updateDoc(doc(db, `users/${uid}/inbox/${id}`), { read: true });
export const markAll = async (uid: string) => { const s = await getDocs(query(collection(db, `users/${uid}/inbox`), where("read", "==", false))); const b = writeBatch(db); s.docs.forEach(d => b.update(d.ref, { read: true })); await b.commit(); };
