import { sendEmail, htmlToText } from "./mailer";

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://njkmusic.com").replace(/\/$/, "");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const money = (cents: number, currency = "eur") =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);

function shell(heading: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#0C0B0D;color:#E8E4DE;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0C0B0D"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:1px solid #2A262E;background:#141216">
<tr><td style="padding:28px 28px 0;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#C62828;font-weight:700">NJK Music</td></tr>
<tr><td style="padding:10px 28px 0"><h1 style="margin:0;font-size:26px;line-height:1.15;color:#fff">${heading}</h1></td></tr>
<tr><td style="padding:16px 28px 28px;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #2A262E;font-size:12px;line-height:1.5;color:#8C8781">NJK Music &middot; seller: Andrej Srna, Sokolská 11, 811 04 Bratislava, Slovakia &middot; support@njkmusic.com</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:#C62828;color:#fff;font-weight:700;text-decoration:none;padding:13px 22px;border-radius:999px;font-size:14px">${esc(label)}</a>`;

export type ReceiptLine = { title: string; priceCents: number; downloadUrl: string };

export async function sendOrderEmail(to: string, order: { id: string; currency: string; amountTotal: number }, lines: ReceiptLine[]) {
  const items = lines
    .map(
      (l) =>
        `<tr><td style="padding:14px 0;border-bottom:1px solid #2A262E"><strong style="color:#fff">${esc(l.title)}</strong><br><span style="color:#8C8781">WAV &middot; ${money(l.priceCents, order.currency)}</span><div style="padding-top:12px">${button(l.downloadUrl, "Download WAV")}</div></td></tr>`,
    )
    .join("");
  const html = shell(
    "Your track is ready",
    `<p style="margin:0 0 12px">Thanks for supporting NJK Music. Your payment of <strong style="color:#fff">${money(order.amountTotal, order.currency)}</strong> was received.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
<p style="margin:16px 0 0">The download link works for 90 days. Save the file somewhere safe.</p>
<p style="margin:12px 0 0">Your invoice will follow in a separate email.</p>
<p style="margin:12px 0 0;color:#8C8781;font-size:13px">Order ${esc(order.id)}. You agreed to immediate delivery of digital content and acknowledged that the right of withdrawal ends once delivery begins.</p>`,
  );
  await sendEmail({ to, subject: "Your NJK Music download", html, text: htmlToText(html) });
}

export function invoiceEmailHtml(number: string) {
  return shell(
    `Invoice ${esc(number)}`,
    `<p style="margin:0">Your invoice for your NJK Music purchase is attached as a PDF. It is already paid, no action is needed.</p>`,
  );
}
