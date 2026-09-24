import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
/** Signs in and returns the role from the server-issued token claim (set only by the backend). */
export const login = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return ((await user.getIdTokenResult(true)).claims.role as string) ?? null;
};
export const logout = () => signOut(auth);
export const watchAuth = (cb: (u: User | null, role: string | null) => void) =>
  onAuthStateChanged(auth, async u => cb(u, u ? (((await u.getIdTokenResult()).claims.role as string) ?? null) : null)); // persistence: Firebase local storage
