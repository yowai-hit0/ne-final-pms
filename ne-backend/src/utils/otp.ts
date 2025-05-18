import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  throw new Error("Missing SMTP configuration in environment");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT ? Number(SMTP_PORT) : 587,
  secure: SMTP_SECURE === "true", // true for port 465, false for others
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

type OtpPurpose = "activation" | "reset";

/**
 * Sends an OTP email for account activation or password reset.
 *
 * @param to     Recipient email address
 * @param code   The one-time passcode
 * @param type   "activation" | "reset"
 */
export async function sendOtpEmail(
  to: string,
  code: string,
  type: OtpPurpose = "reset"
): Promise<void> {
  const subjects = {
    activation: "Activate Your Account",
    reset: "Your Password Reset Code",
  };

  const texts = {
    activation: `Welcome! Your activation code is: ${code}`,
    reset: `You requested a password reset. Your code is: ${code}`,
  };

  const htmls = {
    activation: `<p>Welcome!<br>Your account activation code is: <strong>${code}</strong></p>`,
    reset: `<p>Password Reset Request:<br>Your code is: <strong>${code}</strong></p>`,
  };

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: subjects[type],
    text: texts[type],
    html: htmls[type],
  });
}
