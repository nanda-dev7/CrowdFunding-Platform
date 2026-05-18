import transporter from "./mailer.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"PawRescue 🐾" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    // Email failures are non-critical — log and continue
    console.error("Email send failed:", err.message);
  }
};

export default sendEmail;
