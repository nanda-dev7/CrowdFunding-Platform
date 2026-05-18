import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, FileText, Heart, Plus, Users } from "lucide-react";
import { getCampaignerDashboard } from "../api/campaignerApi";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DashboardShell from "../components/dashboard/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import MedicalDocumentUploadForm from "../components/forms/MedicalDocumentUploadForm";
import TimelineUpdateForm from "../components/forms/TimelineUpdateForm";
import { formatCurrency } from "../utils/formatCurrency";
import { mockCampaigns } from "../utils/mockData";

export default function CampaignerDashboard() {
  const query = useQuery({ queryKey: ["campaigner-dashboard"], queryFn: getCampaignerDashboard, retry: false });
  const data = query.data || {};
  const campaigns = data.campaigns || mockCampaigns;
  const firstCampaign = campaigns[0];
  return (
    <DashboardShell
      title="Campaign operations"
      subtitle="Manage rescue campaigns, post updates, upload medical documents, and understand donor momentum."
      actions={<Button as={Link} to="/campaigner/create"><Plus size={18} /> Create campaign</Button>}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Heart} label="Funds raised" value={formatCurrency(data.fundsRaised || 181000)} />
        <StatCard icon={Users} label="Total donors" value={data.totalDonors || 341} tone="teal" />
        <StatCard icon={FileText} label="Campaigns created" value={campaigns.length} />
        <StatCard icon={BarChart3} label="Approved" value={campaigns.filter((item) => item.status !== "rejected").length} tone="coral" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <AnalyticsChart title="Donation momentum" data={data.trends || []} />
          <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-lg font-extrabold text-ink">Campaign management</h3>
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign._id || campaign.id} className="flex flex-col justify-between gap-4 rounded-3xl bg-cream p-4 md:flex-row md:items-center">
                  <div>
                    <h4 className="font-extrabold text-ink">{campaign.title}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="teal">{campaign.status || "approved"}</Badge>
                      {campaign.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" as={Link} to={`/campaigns/${campaign._id || campaign.id}`}>Analytics</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">Upload documents</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <MedicalDocumentUploadForm campaigns={campaigns} />
          {firstCampaign && (
            <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
              <h3 className="mb-4 text-lg font-extrabold text-ink">Timeline update</h3>
              <TimelineUpdateForm campaignId={firstCampaign._id || firstCampaign.id} />
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
