import { OwnerDashboard } from "@/components/owner-dashboard";
import { requireUser } from "@/lib/auth";
import { getOwnerDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const { supabase, user } = await requireUser("/proprietaire");
  const data = await getOwnerDashboardData(supabase, user);

  return <OwnerDashboard data={data} />;
}
