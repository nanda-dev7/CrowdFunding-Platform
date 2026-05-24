import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PieChart, ShieldCheck } from "lucide-react";
import { deleteSupportingDocument, getCampaignById } from "../api/campaignApi";
import CampaignDetailHeader from "../components/campaign/CampaignDetailHeader";
import CampaignerDetails from "../components/campaign/CampaignerDetails";
import DonationPanel from "../components/campaign/DonationPanel";
import MedicalDocuments from "../components/campaign/MedicalDocuments";
import Timeline from "../components/campaign/Timeline";
import PageTransition from "../components/common/PageTransition";
import Skeleton from "../components/common/Skeleton";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

export default function CampaignDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const query = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignById(id),
    select: (data) => data.campaign || data,
  });
  const campaign = query.data || {};
  const creator = campaign.creator || campaign.campaigner || {};
  const canManage = user?.role === "admin" || user?._id === creator._id || user?.id === creator.id;
  const deleteMutation = useMutation({
    mutationFn: (documentId) => deleteSupportingDocument(campaign._id || campaign.id, documentId),
    onSuccess: () => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Could not delete document"),
  });

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-[34rem]" />
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-8">
          <CampaignDetailHeader campaign={campaign} />
          <section className="rounded-[2rem] border border-bark/10 bg-white p-6 shadow-card">
            <h2 className="text-2xl font-extrabold text-ink">Story</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-bark/75">{campaign.story || campaign.description}</p>
          </section>
          <MedicalDocuments documents={campaign.supportingDocuments || campaign.medicalDocuments || []} canManage={canManage} onDelete={(documentId) => deleteMutation.mutate(documentId)} />
          <Timeline updates={campaign.updates || campaign.timeline || []} />
          <section className="rounded-[2rem] border border-bark/10 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-moss">
                <ShieldCheck />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold text-ink">Transparency</h2>
                <p className="text-sm text-bark/60">Expense estimates help donors understand how funds are used.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(campaign.expenses && campaign.expenses.length > 0) ? (
                campaign.expenses.map((expense) => (
                  <div key={expense._id || expense.label} className="rounded-3xl bg-cream p-4">
                    <PieChart className="mb-3 text-moss" />
                    <p className="font-extrabold text-ink">{expense.label}</p>
                    <p className="text-sm text-bark/60">
                      {formatCurrency((campaign.goalAmount || campaign.goal || 0) * (expense.percentage / 100))}
                      <span className="ml-1 text-xs text-bark/40">({expense.percentage}%)</span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-sm text-bark/50">
                  No expense breakdown has been added yet.
                </p>
              )}
            </div>
          </section>
          <CampaignerDetails creator={creator} />
        </div>
        <DonationPanel campaign={campaign} onDonationSuccess={() => queryClient.invalidateQueries({ queryKey: ["campaign", id] })} />
      </div>
    </PageTransition>
  );
}
