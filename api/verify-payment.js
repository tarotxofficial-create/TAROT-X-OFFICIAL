// TAROT X OFFICIAL — Serverless Payment Verification Engine

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
    const { paymentId, expectedAmountINR } = req.body || {};

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId in request body.' });
    }

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_live_TYDiVdkOMTeB1v';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'iGWfwRbHDnnTeXwGqe6YTcew';

    // Verify directly with Razorpay API
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpResponse = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: authHeader
      }
    });

    if (!rzpResponse.ok) {
      const errData = await rzpResponse.json().catch(() => ({}));
      console.warn('Razorpay verification API response not OK:', errData);
      // If Razorpay API rejects, return unverified
      return res.status(400).json({
        verified: false,
        error: errData.error?.description || 'Could not verify payment with gateway.'
      });
    }

    const payment = await rzpResponse.json();

    // Check payment status
    const isCapturedOrAuthorized = payment.status === 'captured' || payment.status === 'authorized';
    
    // Check expected amount if provided (paise comparison)
    let amountMatches = true;
    if (expectedAmountINR) {
      const expectedPaise = Math.round(Number(expectedAmountINR) * 100);
      amountMatches = Math.abs(payment.amount - expectedPaise) === 0;
    }

    if (isCapturedOrAuthorized && amountMatches) {
      return res.status(200).json({
        verified: true,
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at
      });
    } else {
      return res.status(400).json({
        verified: false,
        status: payment.status,
        error: `Payment status is ${payment.status} or amount mismatch.`
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      verified: false,
      error: error.message || 'Internal server error during payment verification.'
    });
  }
}
