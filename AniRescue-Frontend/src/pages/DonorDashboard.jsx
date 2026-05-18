import { useQuery } from "@tanstack/react-query";
import { Heart, IndianRupee, PawPrint, ShieldCheck } from "lucide-react";
import { getDonorDashboard } from "../api/dashboardApi";
import { getMyDonations } from "../api/donationApi";
import DashboardShell from "../components/dashboard/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import DonationHistory from "../components/dashboard/DonationHistory";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";
import { formatCurrency } from "../utils/formatCurrency";

export default function DonorDashboard() {
  const dashboard = useQuery({ queryKey: ["donor-dashboard"], queryFn: getDonorDashboard, retry: false });
  const donations = useQuery({ queryKey: ["my-donations"], queryFn: getMyDonations, retry: false, select: (data) => data.donations || data || [] });
  const { notifications, markRead } = useNotifications();
  const stats = dashboard.data?.stats || dashboard.data || {};
  return (
    <DashboardShell title="Your giving impact" subtitle="Track donations, supported campaigns, and rescue alerts in one place.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Heart} label="Total Donations" value={stats.totalDonations || donations.data?.length || 0} />
        <StatCard icon={IndianRupee} label="Amount Donated" value={formatCurrency(stats.amountDonated)} tone="teal" />
        <StatCard icon={ShieldCheck} label="Campaigns Supported" value={stats.campaignsSupported || 0} />
        <StatCard icon={PawPrint} label="Animals Helped" value={stats.animalsHelped || 0} tone="coral" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <DonationHistory donations={donations.data || []} />
        <NotificationPanel notifications={notifications} onRead={markRead} />
      </div>
    </DashboardShell>
  );
}
