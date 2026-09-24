import "./globals.css";
import { Provider } from "@/lib/store";
export const metadata = { title: "Smart Campus 360", description: "One digital platform for every campus need." };
export default function Root({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Provider>{children}</Provider></body></html>; }
