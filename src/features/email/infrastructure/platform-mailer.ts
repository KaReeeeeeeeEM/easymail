import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | undefined;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function mailTransport() {
  const gmailUser = (process.env.PLATFORM_SMTP_USER ?? process.env.GMAIL_USER)?.trim().toLowerCase();
  const gmailPass = (process.env.PLATFORM_SMTP_PASSWORD ?? process.env.GMAIL_PASS ?? process.env.GMAIL_APP_PASSWORD)?.replaceAll(" ", "");
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPassword = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? (gmailUser ? `easymail <${gmailUser}>` : undefined);
  if (!from) throw new Error("SMTP_FROM or a Gmail sender must be configured");
  if (gmailUser && gmailPass) {
    transporter ??= nodemailer.createTransport({ service: "gmail", auth: { user: gmailUser, pass: gmailPass }, connectionTimeout: 10_000, socketTimeout: 20_000 });
  } else {
    const host = process.env.SMTP_HOST;
    if (!host || !smtpUser || !smtpPassword) throw new Error("Gmail or SMTP credentials must be configured");
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter ??= nodemailer.createTransport({ host, port, secure: port === 465, auth: { user: smtpUser, pass: smtpPassword }, connectionTimeout: 10_000, socketTimeout: 20_000 });
  }
  return { from, transporter };
}

function emailTemplate({ title, greeting, message, actionLabel, actionUrl }: { title: string; greeting: string; message: string; actionLabel: string; actionUrl: string }) {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#171717"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;overflow:hidden;border:1px solid #e7e5e4;border-radius:20px;background:#fff"><tr><td style="padding:24px 32px;background:#111;color:#fff">${emailLogo()}</td></tr><tr><td style="padding:38px 32px;color:#57534e;font-size:16px;line-height:1.7"><h1 style="margin:0 0 20px;color:#171717;font-size:28px">${escapeHtml(title)}</h1><p>Hello ${escapeHtml(greeting)},</p><p>${escapeHtml(message)}</p><p style="margin:28px 0"><a href="${escapeHtml(actionUrl)}" style="display:inline-block;padding:13px 22px;border-radius:9px;background:#ff9100;color:#fff;text-decoration:none;font-weight:700">${escapeHtml(actionLabel)}</a></p><p style="font-size:13px">If you did not initiate this request, you can safely ignore this email.</p></td></tr><tr><td style="padding:20px 32px;border-top:1px solid #e7e5e4;color:#78716c;font-size:12px">This message was sent by the EasyMail account platform. Never send your password by reply.</td></tr></table></td></tr></table></body></html>`;
}

function emailLogo() {
  const origin = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "https://easymail.almareem.com").replace(/\/$/, "");
  return `<img src="${escapeHtml(origin)}/easymail-wordmark.png" width="142" height="40" alt="easymail" style="display:block;width:142px;height:auto;border:0" />`;
}

export async function verifyPlatformMailConnection() { await mailTransport().transporter.verify(); }

async function sendAccountEmail({ to, name, subject, message, actionLabel, actionUrl }: { to: string; name: string; subject: string; message: string; actionLabel: string; actionUrl: string }) {
  const { from, transporter: mailer } = mailTransport();
  await mailer.sendMail({ from, to, subject, text: `Hello ${name},\n\n${message}\n\n${actionLabel}: ${actionUrl}\n\nIf you did not initiate this request, ignore this email.`, html: emailTemplate({ title: subject, greeting: name, message, actionLabel, actionUrl }) });
}

export async function sendVerificationEmail({ email, name, url }: { email: string; name: string; url: string }) {
  await sendAccountEmail({ to: email, name, subject: "Verify your email address", message: "Confirm your email address to activate your account and continue to the dashboard.", actionLabel: "Verify email", actionUrl: url });
}

export async function sendPasswordResetEmail({ email, name, url }: { email: string; name: string; url: string }) {
  await sendAccountEmail({ to: email, name, subject: "Reset your password", message: "Use this secure, single-use link to choose a new password. It expires in 15 minutes.", actionLabel: "Reset password", actionUrl: url });
}

export async function sendApiKeyCreatedEmail({ email, name, keyName, workspaceName, senderLabel }: { email: string; name: string; keyName: string; workspaceName: string; senderLabel: string }) {
  const origin = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "https://easymail.almareem.com").replace(/\/$/, "");
  await sendAccountEmail({
    to: email,
    name,
    subject: "A new API key was created",
    message: `The API key “${keyName}” was created in workspace “${workspaceName}” and assigned to sender “${senderLabel}”. The secret is never included in email. If this was not you, revoke the key immediately.`,
    actionLabel: "Review API keys",
    actionUrl: `${origin}/dashboard/api-keys`,
  });
}

export async function sendTwoFactorCodeEmail({ email, name, otp }: { email: string; name: string; otp: string }) {
  const { from, transporter: mailer } = mailTransport();
  await mailer.sendMail({
    from,
    to: email,
    subject: `${otp} is your easymail security code`,
    text: `Hello ${name},\n\nYour easymail sign-in code is ${otp}. It expires in 5 minutes.\n\nIf you did not try to sign in, change your password immediately.`,
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#171717"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border:1px solid #e7e5e4;border-radius:20px;background:#fff;overflow:hidden"><tr><td style="padding:24px 32px;background:#111">${emailLogo()}</td></tr><tr><td style="padding:38px 32px;color:#57534e;font-size:16px;line-height:1.7"><h1 style="margin:0 0 20px;color:#171717;font-size:28px">Confirm your sign-in</h1><p>Hello ${escapeHtml(name)},</p><p>Enter this security code to finish signing in:</p><p style="margin:28px 0;font-size:36px;font-weight:800;letter-spacing:10px;color:#171717">${escapeHtml(otp)}</p><p>This code expires in 5 minutes and can only be used once.</p><p style="font-size:13px">If you did not try to sign in, change your password immediately.</p></td></tr></table></td></tr></table></body></html>`,
  });
}

export async function sendAccountVerificationCodeEmail({ email, otp }: { email: string; otp: string }) {
  const { from, transporter: mailer } = mailTransport();
  await mailer.sendMail({
    from,
    to: email,
    subject: `${otp} verifies your easymail account`,
    text: `Your easymail account verification code is ${otp}. It expires in 5 minutes. If you did not create this account, ignore this email.`,
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#171717"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border:1px solid #e7e5e4;border-radius:20px;background:#fff;overflow:hidden"><tr><td style="padding:24px 32px;background:#111">${emailLogo()}</td></tr><tr><td style="padding:38px 32px;color:#57534e;font-size:16px;line-height:1.7"><h1 style="margin:0 0 20px;color:#171717;font-size:28px">Verify your Gmail address</h1><p>Enter this code to finish creating your account:</p><p style="margin:28px 0;font-size:36px;font-weight:800;letter-spacing:10px;color:#171717">${escapeHtml(otp)}</p><p>This single-use code expires in 5 minutes.</p><p style="font-size:13px">If you did not create this account, you can safely ignore this message.</p></td></tr></table></td></tr></table></body></html>`,
  });
}
