import type { NextRequest } from 'next/server';
import { sendEmail, templates } from '@/lib/email';

export const runtime = 'nodejs';

interface ContactPayload {
  name?: string;
  phone?: string;
  service?: string;
  zip?: string;
  recaptchaToken?: string;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('[contact] RECAPTCHA_SECRET_KEY not set — skipping verification');
    return true; // dev fallback — production must set the key
  }
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json() as { success: boolean; score: number; action: string };
    // Permissive 0.3 threshold per CONTEXT.md
    return data.success && data.score >= 0.3;
  } catch (err) {
    console.error('[contact] reCAPTCHA verify failed', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // 1. Parse + validate
  let body: ContactPayload;
  try {
    body = await request.json() as ContactPayload;
  } catch {
    return Response.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { name, phone, service, zip, recaptchaToken } = body;

  const missing: string[] = [];
  if (!name?.trim()) missing.push('name');
  if (!phone?.replace(/\D/g, '').match(/^\d{10}$/)) missing.push('phone');
  if (!service?.trim()) missing.push('service');
  if (!zip?.match(/^\d{5}$/)) missing.push('zip');
  if (missing.length > 0) {
    return Response.json({ success: false, error: `Missing or invalid: ${missing.join(', ')}` }, { status: 400 });
  }

  // 2. reCAPTCHA verification (gracefully skipped if no token — LeadForm submits without one)
  if (recaptchaToken) {
    const passed = await verifyRecaptcha(recaptchaToken);
    if (!passed) {
      // Per CONTEXT.md fail-loud policy: do not disclose bot-check failure to user
      return Response.json({ success: false, error: 'Verification failed' }, { status: 200 });
    }
  } else {
    console.log('[contact] No reCAPTCHA token — likely service-page LeadForm submission');
  }

  // 3. Server config check
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (!notificationEmail) {
    console.error('[contact] NOTIFICATION_EMAIL env var not set');
    return Response.json({ success: false, error: 'Server misconfiguration' }, { status: 200 });
  }

  // 4. Send email via copied @nsi/email-sender tool
  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const html = templates.notification({
    title: 'New lead from Raptor Roofing website',
    brandName: 'Raptor Roofing',
    tagline: "Omaha's Family-Owned Roofer",
    headerBg: '#0f1e24',
    accentColor: '#c8352a',
    footerHtml: 'Raptor Roofing &bull; Omaha, NE &bull; (402) 885-1462',
    fields: {
      Name: name!,
      Phone: phone!,
      Service: service!,
      ZIP: zip!,
      Submitted: submittedAt,
    },
  });

  const result = await sendEmail({
    to: notificationEmail,
    subject: `New lead from Raptor website — ${name}`,
    html,
  });

  // 5. Return result. Always 200 unless validation failed — client just checks result.success.
  return Response.json({
    success: result.success,
    messageId: result.messageId,
    error: result.error,
  }, { status: 200 });
}
