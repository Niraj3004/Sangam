import nodemailer from 'nodemailer';
import { env } from './env.config';

// Initialize the Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT || '587', 10),
  secure: env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// Premium Light Theme HTML Template Wrapper
const applyTheme = (title: string, bodyContent: string, ctaLink?: string, ctaText?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #ffffff;
      padding: 32px 40px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }
    .header h1 {
      margin: 0;
      color: #0f172a;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px;
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
    }
    .content h2 {
      color: #1e293b;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 24px;
    }
    .cta-button {
      display: inline-block;
      background-color: #6366f1; /* Indigo vibrant primary */
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 16px;
      margin-bottom: 16px;
      text-align: center;
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background-color: #4f46e5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sangam</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${bodyContent}
      ${ctaLink && ctaText ? '<a href="' + ctaLink + '" class="cta-button">' + ctaText + '</a>' : ''}
    </div>
    <div class="footer">
      <p>You received this email because you are a registered user of Sangam.</p>
      <p>Nepali Students Network &copy; ${new Date().getFullYear()}</p>
      <p><a href="${env.CLIENT_URL}/settings/notifications">Unsubscribe</a> or manage your preferences.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendEmail = async (
  to: string, 
  subject: string, 
  title: string, 
  bodyContent: string, 
  ctaLink?: string, 
  ctaText?: string
) => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('[MAILER STUB] SMTP credentials not fully configured. Email not sent to ' + to + '.');
    return false;
  }

  const html = applyTheme(title, bodyContent, ctaLink, ctaText);

  try {
    const info = await transporter.sendMail({
      from: '"Sangam Platform" <' + env.SMTP_USER + '>',
      to,
      subject,
      html,
    });
    console.log('[Mailer] Email sent to ' + to + ' (MessageId: ' + info.messageId + ')');
    return true;
  } catch (error) {
    console.error('[Mailer] Failed to send email to ' + to + ':', error);
    return false;
  }
};
