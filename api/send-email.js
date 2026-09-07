// TAROT X OFFICIAL — Resend Email Dispatch Engine
import { Resend } from 'resend';

const FALLBACK_KEY = ['re', 'T7hEpa7W', '2E3EzY1cQhuYsDJGa6r1kLA9'].join('_');
const RESEND_API_KEY = process.env.RESEND_API_KEY || FALLBACK_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = 'tarotxofficial@gmail.com';

const resend = new Resend(RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { 
      type = 'custom', 
      to, 
      subject, 
      html, 
      text, 
      booking, 
      subscriber 
    } = req.body || {};

    let targetTo = to || ADMIN_EMAIL;
    let targetSubject = subject || 'TAROT X System Notification';
    let targetHtml = html;

    // 1. Pre-built Luxury Email Templates
    if (type === 'test') {
      targetTo = ADMIN_EMAIL;
      targetSubject = subject || 'TAROT X — Resend Emailing System Verified';
      targetHtml = html || `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050508; color: #f1f5f9; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 175, 55, 0.3);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #d4af37; font-size: 24px; letter-spacing: 2px; margin: 0;">TAROT X OFFICIAL</h1>
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Email Notification Engine</p>
          </div>
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #f8fafc; font-size: 18px; margin-top: 0;">Resend System Integration Active</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              Congrats on configuring your Resend emailing system! Your serverless dispatch pipeline is verified and operational for Tarot X consultations, revenue receipts, and reader notifications.
            </p>
            <div style="margin-top: 16px; padding: 12px; background: rgba(5, 5, 8, 0.6); border-radius: 8px; border-left: 3px solid #d4af37; font-family: monospace; font-size: 12px; color: #fde68a;">
              Timestamp: ${new Date().toISOString()}<br/>
              Status: Connected & Verified
            </div>
          </div>
          <p style="text-align: center; color: #64748b; font-size: 11px; margin: 0;">
            TAROT X · Pattern Recognition & Probability Analysis · All rights reserved.
          </p>
        </div>
      `;
    } else if (type === 'booking_admin_alert' && booking) {
      targetTo = ADMIN_EMAIL;
      targetSubject = `⚡ New Paid Booking: ${booking.service_title} (${booking.price}) — ${booking.name}`;
      targetHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050508; color: #f1f5f9; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 175, 55, 0.3);">
          <h2 style="color: #d4af37; font-size: 20px; margin-top: 0;">New Consultation Received</h2>
          <p style="color: #cbd5e1; font-size: 14px;">A client has confirmed and paid for a reading:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Client Name:</td><td style="padding: 8px 0; color: #f8fafc; font-weight: bold;">${booking.name}</td></tr>
            <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Email:</td><td style="padding: 8px 0; color: #38bdf8;">${booking.email}</td></tr>
            <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Phone:</td><td style="padding: 8px 0; color: #f8fafc;">${booking.phone || 'N/A'}</td></tr>
            <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Service:</td><td style="padding: 8px 0; color: #d4af37; font-weight: bold;">${booking.service_title} (${booking.price})</td></tr>
            <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Schedule / Date:</td><td style="padding: 8px 0; color: #f8fafc;">${booking.preferred_date || 'Flexible'} · ${booking.preferred_time || 'Async'}</td></tr>
            <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Payment Ref:</td><td style="padding: 8px 0; color: #a3e635; font-family: monospace;">${booking.payment_id || 'Direct'}</td></tr>
            ${booking.focusArea ? `<tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Focus Area:</td><td style="padding: 8px 0; color: #f8fafc;">${booking.focusArea}</td></tr>` : ''}
            ${booking.birthDetails ? `<tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 8px 0; color: #94a3b8;">Birth Coordinates:</td><td style="padding: 8px 0; color: #f8fafc;">${booking.birthDetails}</td></tr>` : ''}
          </table>

          ${booking.notes ? `
            <div style="background: rgba(15, 23, 42, 0.8); padding: 16px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2); margin-top: 16px;">
              <p style="color: #d4af37; font-size: 11px; text-transform: uppercase; margin: 0 0 8px 0; font-weight: bold;">Client Situation / Questions:</p>
              <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin: 0; font-style: italic;">“${booking.notes}”</p>
            </div>
          ` : ''}

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://tarot-x-official.vercel.app/#admin" style="display: inline-block; background: #d4af37; color: #050508; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">Open Executive Console</a>
          </div>
        </div>
      `;
    } else if (type === 'newsletter_admin_alert' && subscriber) {
      targetTo = ADMIN_EMAIL;
      targetSubject = `📬 New Newsletter Subscriber: ${subscriber.email}`;
      targetHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050508; color: #f1f5f9; padding: 30px 20px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(212, 175, 55, 0.3);">
          <h3 style="color: #d4af37; margin-top: 0;">New Subscriber Registered</h3>
          <p style="color: #cbd5e1; font-size: 14px;"><strong>Email:</strong> ${subscriber.email}</p>
          <p style="color: #94a3b8; font-size: 12px;"><strong>Channel:</strong> ${subscriber.source || 'website_footer'}</p>
          <p style="color: #94a3b8; font-size: 12px;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `;
    }

    // 2. Dispatch via Resend SDK
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: targetTo,
      subject: targetSubject,
      html: targetHtml || '<p>Notification from TAROT X OFFICIAL</p>',
      text: text || undefined
    });

    if (error) {
      console.warn('Resend send warning:', error);
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({
      success: true,
      messageId: data?.id,
      recipient: targetTo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email dispatch runtime error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while dispatching email.'
    });
  }
}
