// TAROT X OFFICIAL — Client Email Integration Service

/**
 * Dispatch an email via the serverless Resend dispatch API (/api/send-email)
 */
export async function sendEmail(payload) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    return {
      ok: response.ok && result.success,
      status: response.status,
      ...result
    };
  } catch (error) {
    console.warn('Email dispatch network error (proceeding gracefully):', error);
    return {
      ok: false,
      error: error.message || 'Network request failed'
    };
  }
}

/**
 * Send an onboarding/test verification email to tarotxofficial@gmail.com
 */
export async function sendResendTestEmail() {
  return await sendEmail({
    type: 'test',
    to: 'tarotxofficial@gmail.com',
    subject: 'Hello World — TAROT X Emailing System Configured',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050508; color: #f1f5f9; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 175, 55, 0.3);">
        <h1 style="color: #d4af37; font-size: 22px; letter-spacing: 2px;">TAROT X OFFICIAL</h1>
        <p style="color: #cbd5e1; font-size: 14px;">Congrats on sending your <strong>first email</strong> via Resend!</p>
        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
          The Resend integration is now operational for your consultations, booking receipts, and client communication pipeline.
        </p>
        <div style="margin-top: 16px; padding: 12px; background: rgba(15, 23, 42, 0.8); border-radius: 8px; border-left: 3px solid #d4af37; font-family: monospace; font-size: 12px; color: #fde68a;">
          API Key: re_T7hEpa...<br/>
          From: onboarding@resend.dev<br/>
          To: tarotxofficial@gmail.com
        </div>
      </div>
    `
  });
}

/**
 * Send an admin notification alert when a client books a consultation
 */
export async function sendBookingAlert(booking) {
  return await sendEmail({
    type: 'booking_admin_alert',
    booking
  });
}

/**
 * Send an admin alert when a new newsletter subscriber joins
 */
export async function sendNewsletterAlert(subscriber) {
  return await sendEmail({
    type: 'newsletter_admin_alert',
    subscriber
  });
}
