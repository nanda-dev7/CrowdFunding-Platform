import crypto from "crypto";

const verifyRazorpaySignature = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const isValid = expectedSignature === razorpaySignature;
  
  return isValid;
};

export default verifyRazorpaySignature;
