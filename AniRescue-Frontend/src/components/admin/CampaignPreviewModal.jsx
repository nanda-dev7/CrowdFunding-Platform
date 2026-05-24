import Modal from "../common/Modal";
import ProgressBar from "../common/ProgressBar";
import { calculateProgress } from "../../utils/calculateProgress";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CampaignPreviewModal({ campaign, open, onClose }) {
  if (!campaign) return null;
  const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  
  const isIndividualOrMedical = ["Individual animal rescue", "Medical treatment"].includes(campaign.campaignType);

  return (
    <Modal open={open} onClose={onClose} title={campaign.title}>
      <img src={campaign.coverImage || campaign.image} alt="" className="mb-5 max-h-72 w-full rounded-3xl object-cover" />
      
      <div className="mb-5 rounded-2xl bg-cream p-4">
        <div className="grid gap-2 text-sm text-ink sm:grid-cols-2">
          <p><strong>Type:</strong> {campaign.campaignType || "N/A"}</p>
          <p><strong>Category:</strong> {campaign.category || "N/A"}</p>
          <p className="sm:col-span-2"><strong>Location:</strong> {campaign.location || "N/A"}</p>
        </div>
      </div>

      {isIndividualOrMedical ? (
        <>
          {campaign.animalDetails && (
            <div className="mb-5 rounded-2xl bg-sage/20 p-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-bark/60">Animal Details</h3>
              <div className="grid gap-2 text-sm text-ink sm:grid-cols-2">
                <p><strong>Type:</strong> {campaign.animalDetails.type}</p>
                <p><strong>Name:</strong> {campaign.animalDetails.name || "N/A"}</p>
                <p><strong>Age:</strong> {campaign.animalDetails.approxAge || "N/A"}</p>
                <p><strong>Gender:</strong> {campaign.animalDetails.gender || "Unknown"}</p>
                <p className="sm:col-span-2"><strong>Condition:</strong> {campaign.animalDetails.condition}</p>
              </div>
            </div>
          )}

          {campaign.vetDetails && (
            <div className="mb-5 rounded-2xl bg-moss/5 p-4 border border-moss/10">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-moss">Veterinary Details</h3>
              <div className="grid gap-2 text-sm text-ink sm:grid-cols-2">
                <p><strong>Clinic:</strong> {campaign.vetDetails.clinicName}</p>
                <p><strong>Contact:</strong> {campaign.vetDetails.contactNumber}</p>
                <p className="sm:col-span-2"><strong>Diagnosis:</strong> {campaign.vetDetails.diagnosis}</p>
                <p className="sm:col-span-2 font-semibold text-moss"><strong>Est. Cost:</strong> {formatCurrency(campaign.vetDetails.estimatedCost)}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {campaign.groupWelfareDetails && (
            <div className="mb-5 rounded-2xl bg-sage/20 p-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-bark/60">Group / Welfare Scope</h3>
              <div className="grid gap-2 text-sm text-ink sm:grid-cols-2">
                <p><strong>Target Group:</strong> {campaign.groupWelfareDetails.targetGroup}</p>
                <p><strong>Est. Count:</strong> {campaign.groupWelfareDetails.estimatedCount}</p>
                <p className="sm:col-span-2"><strong>Campaign Area:</strong> {campaign.groupWelfareDetails.campaignArea}</p>
                <p className="sm:col-span-2"><strong>Action Plan:</strong> {campaign.groupWelfareDetails.actionPlan}</p>
                <p className="sm:col-span-2"><strong>Required Materials:</strong> {campaign.groupWelfareDetails.requiredMaterials}</p>
              </div>
            </div>
          )}
        </>
      )}

      {campaign.verificationDetails && campaign.verificationDetails.partnerDetails && (
        <div className="mb-5 rounded-2xl bg-cream p-4">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-bark/60">Verification Details</h3>
          <p className="text-sm text-ink"><strong>Partner / Authority:</strong> {campaign.verificationDetails.partnerDetails}</p>
        </div>
      )}

      <div className="mb-5">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-bark/60">Rescue Story / Purpose</h3>
        <p className="leading-7 text-bark/80">{campaign.description}</p>
      </div>

      <div className="mt-5 border-t border-bark/10 pt-5">
        <ProgressBar value={progress} />
        <p className="mt-2 text-sm font-semibold text-bark/80">
          {formatCurrency(campaign.raisedAmount)} raised of {formatCurrency(campaign.goalAmount)}
        </p>
      </div>
    </Modal>
  );
}
