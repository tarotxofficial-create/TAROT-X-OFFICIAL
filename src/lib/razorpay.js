// TAROT X OFFICIAL — Razorpay Checkout Engine

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayCheckout({
  serviceTitle,
  amountInINR,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
  onDismiss
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onFailure) onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TYDiVdkOMTeB1v';

  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(Number(amountInINR) * 100);

  const options = {
    key: keyId,
    amount: amountInPaise,
    currency: 'INR',
    name: 'Tarot X Official',
    description: `Reading Session: ${serviceTitle}`,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=128&q=80',
    prefill: {
      name: customerName || '',
      email: customerEmail || '',
      contact: customerPhone || ''
    },
    notes: {
      service: serviceTitle,
      platform: 'Tarot X Official Web'
    },
    theme: {
      color: '#d4af37',
      backdrop_color: 'rgba(6, 7, 10, 0.85)'
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      }
    },
    handler: function (response) {
      if (response && response.razorpay_payment_id) {
        if (onSuccess) {
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || null,
            signature: response.razorpay_signature || null
          });
        }
      } else {
        if (onFailure) onFailure(new Error('Payment could not be completed.'));
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.warn('Razorpay payment failed:', response.error);
      if (onFailure) {
        onFailure(new Error(response.error?.description || 'Payment transaction failed.'));
      }
    });
    rzp.open();
  } catch (err) {
    console.error('Error opening Razorpay checkout:', err);
    if (onFailure) onFailure(err);
  }
}
