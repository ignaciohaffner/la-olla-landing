import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MailOptions {
  subject: string;
  text: string;
}

export async function sendMail(options: MailOptions): Promise<void> {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    console.warn('[mailer] OWNER_EMAIL is not set — email not sent');
    return;
  }
  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: ownerEmail,
    subject: options.subject,
    text: options.text,
  });
}
