import { ClientDashboard } from "@/components/client-dashboard";
import { requireUser } from "@/lib/auth";
import { getClientDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser("/dashboard");
  const data = await getClientDashboardData(supabase, user);

  return <ClientDashboard data={data} />;
}
