import Modal from "../common/Modal";
import ProgressBar from "../common/ProgressBar";
import { calculateProgress } from "../../utils/calculateProgress";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CampaignPreviewModal({ campaign, open, onClose }) {
  if (!campaign) return null;
  const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  return (
    <Modal open={open} onClose={onClose} title={campaign.title}>
      <img src={campaign.coverImage || campaign.image} alt="" className="mb-5 max-h-72 w-full rounded-3xl object-cover" />
      <p className="leading-7 text-bark/75">{campaign.description}</p>
      <div className="mt-5">
        <ProgressBar value={progress} />
        <p className="mt-2 text-sm text-bark/65">
          {formatCurrency(campaign.raisedAmount)} raised of {formatCurrency(campaign.goalAmount)}
        </p>
      </div>
    </Modal>
  );
}
