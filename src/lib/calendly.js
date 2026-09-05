// TAROT X OFFICIAL — Calendly + Zoom Integration Helper

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const CALENDLY_STYLE_SRC = 'https://assets.calendly.com/assets/external/widget.css';

export const DEFAULT_CALENDLY_URL = 
  import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/tarotxofficial/30min';

export function loadCalendlyAssets() {
  return new Promise((resolve) => {
    // 1. Inject Stylesheet if not already present
    if (!document.querySelector(`link[href="${CALENDLY_STYLE_SRC}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CALENDLY_STYLE_SRC;
      document.head.appendChild(link);
    }

    // 2. Check if script is already loaded
    if (window.Calendly) {
      resolve(true);
      return;
    }

    // 3. Inject Script
    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Builds the customized Calendly URL with dark theme and prefilled client info
 */
export function buildCalendlyUrl(baseUrl, { name = '', email = '', notes = '' } = {}) {
  try {
    let cleanUrl = baseUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const url = new URL(cleanUrl);
    
    // Antigravity dark theme parameters
    url.searchParams.set('background_color', '0b0e14');
    url.searchParams.set('text_color', 'f8f9fa');
    url.searchParams.set('primary_color', 'ecc86b');
    url.searchParams.set('hide_gdpr_banner', '1');
    url.searchParams.set('embed_domain', typeof window !== 'undefined' ? window.location.hostname : 'tarotxofficial.com');
    url.searchParams.set('embed_type', 'Inline');

    // Prefill seeker details
    if (name) url.searchParams.set('name', name);
    if (email) url.searchParams.set('email', email);
    if (notes) url.searchParams.set('a1', notes);

    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Open Calendly in a popup modal
 */
export async function openCalendlyPopup({ url = DEFAULT_CALENDLY_URL, prefill = {} }) {
  await loadCalendlyAssets();
  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: buildCalendlyUrl(url, prefill)
    });
  } else {
    window.open(buildCalendlyUrl(url, prefill), '_blank');
  }
}
