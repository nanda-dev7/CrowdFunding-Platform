import CreateCampaignForm from "../components/forms/CreateCampaignForm";
import DashboardShell from "../components/dashboard/DashboardShell";

export default function CreateCampaign() {
  return (
    <DashboardShell title="Create rescue campaign" subtitle="Submit a verified emergency fundraiser for admin approval.">
      <CreateCampaignForm />
    </DashboardShell>
  );
}
