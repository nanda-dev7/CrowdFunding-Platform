import toast from "react-hot-toast";
import { createDonationOrder, confirmDonation } from "../api/donationApi";

export function useRazorpay() {
  const donate = async ({ campaign, amount, message, anonymous, onSuccess }) => {
    if (!window.Razorpay) {
      toast.error("Razorpay checkout is not available");
      return;
    }
    const order = await createDonationOrder({
      campaignId: campaign._id || campaign.id,
      amount,
      message,
      anonymous,
    });
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "AniRescue",
      description: `Donation for ${campaign.title}`,
      order_id: order.id || order.orderId,
      theme: { color: "#49705b" },
      handler: async (response) => {
        await confirmDonation({
          campaignId: campaign._id || campaign.id,
          orderId: order.id || order.orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          amount,
          message,
          anonymous,
        });
        toast.success("Donation successful. Thank you for helping this rescue.");
        onSuccess?.();
      },
      modal: {
        ondismiss: () => toast("Donation checkout closed"),
      },
    };
    new window.Razorpay(options).open();
  };
  return { donate };
}
