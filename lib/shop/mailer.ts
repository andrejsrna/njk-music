import nodemailer, { type Transporter } from "nodemailer";

export type MailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

let transporter: Transporter | null = null;

export async function sendEmail(params: MailParams) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!from || !process.env.SMTP_HOST) throw new Error("Email service is not configured.");
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({ from, ...params });
}

export const htmlToText = (html: string) =>
  html
    .replace(/<(br|\/p|\/tr|\/h1)\s*\/?>/gi, "\n")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
