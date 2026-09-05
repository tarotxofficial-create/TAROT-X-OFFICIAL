// TAROT X OFFICIAL — Serverless Calendly Booking Cancellation / Auto-Delete Engine

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
    const { eventUri, eventUuid, reason } = req.body || {};

    let uuid = eventUuid;
    if (!uuid && eventUri) {
      // e.g. https://api.calendly.com/scheduled_events/XXXX-XXXX-XXXX
      const parts = eventUri.trim().replace(/\/$/, '').split('/');
      uuid = parts[parts.length - 1];
    }

    if (!uuid) {
      return res.status(400).json({ error: 'Missing eventUri or eventUuid in request.' });
    }

    const calendlyToken = 
      process.env.CALENDLY_API_TOKEN || 
      process.env.VITE_CALENDLY_API_TOKEN || 
      '';

    const cancelReason = reason || 'Payment not completed by seeker on Tarot X Official';

    // If token is configured, call Calendly API v2
    if (calendlyToken) {
      const calendlyRes = await fetch(`https://api.calendly.com/scheduled_events/${uuid}/cancellation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${calendlyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: cancelReason
        })
      });

      if (calendlyRes.ok) {
        const data = await calendlyRes.json();
        console.log('Calendly event cancelled successfully:', uuid);
        return res.status(200).json({
          success: true,
          deleted: true,
          eventUuid: uuid,
          resource: data.resource
        });
      } else {
        const errorData = await calendlyRes.json().catch(() => ({}));
        console.warn('Calendly cancellation error from API:', errorData);
        return res.status(calendlyRes.status).json({
          success: false,
          error: errorData.message || 'Calendly cancellation failed',
          details: errorData
        });
      }
    } else {
      // Fallback if CALENDLY_API_TOKEN is not yet set in environment variables
      console.warn('CALENDLY_API_TOKEN not set in environment. Simulated cancellation recorded for event:', uuid);
      return res.status(200).json({
        success: true,
        deleted: true,
        simulated: true,
        eventUuid: uuid,
        note: 'Calendly booking marked cancelled. Set CALENDLY_API_TOKEN in Vercel to trigger Calendly REST API cancellation.'
      });
    }
  } catch (error) {
    console.error('Error in auto-delete Calendly handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error during Calendly auto-cancellation'
    });
  }
}
