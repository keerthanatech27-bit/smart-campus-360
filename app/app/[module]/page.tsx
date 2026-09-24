"use client";
export const dynamic = "force-dynamic";
import { useParams } from "next/navigation";
import Shell from "@/components/Shell";
import * as M from "@/components/modules";
import { Empty } from "@/components/ui";
const views: Record<string, () => JSX.Element> = { overview: M.Overview, water: M.Water, restrooms: M.Restrooms, staff: M.Staff, helpdesk: M.Helpdesk, clubs: M.Clubs, notifications: M.Notifications, fees: M.Fees, timetable: M.Timetable, analytics: M.Analytics, profile: M.Profile };
export default function Page() {
  const { module } = useParams<{ module: string }>(); const V = views[module];
  return <Shell module={module}>{allowed => !V ? <Empty text="This page doesn't exist." /> : allowed ? <V /> : <Empty text="Your role doesn't have access to this page." />}</Shell>;
}
