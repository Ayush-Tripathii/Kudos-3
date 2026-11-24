/* ==========================================================================
   CLIENT CONSTANTS — every value marked TODO is awaiting client input.
   Nothing here is guessed. Anything still "TODO…" is hidden or degrades
   gracefully on the page (see isSet()).
   ========================================================================== */

export const isSet = (v: unknown): boolean =>
  v !== null && v !== undefined && v !== '' && !String(v).startsWith('TODO');

/** Production origin, no trailing slash. Used for canonical, OG, sitemap. */
export const SITE_URL = 'https://ayush-tripathii.github.io/Kudos-3';

export const BRAND = {
  name: 'Kudos Restro Lounge',
  short: 'Kudos',
  tagline: 'Simple Food. Good Food. Great Evenings.',
  founder: 'Vathsaal Jogani',
};

/** E.164 without "+" for WhatsApp, e.g. 9198XXXXXXXX */
export const WHATSAPP_NUMBER = 'TODO_WHATSAPP_NUMBER';
/** Display + tel: form, e.g. +91 98XXX XXXXX */
export const PHONE_DISPLAY = 'TODO_PHONE_DISPLAY';
export const PHONE_TEL = 'TODO_PHONE_TEL';
export const EMAIL = 'TODO_EMAIL';

export const ADDRESS = {
  street: 'TODO_STREET_ADDRESS',
  locality: 'Udaipur',
  region: 'Rajasthan',
  postalCode: 'TODO_PIN',
  country: 'IN',
};

/** Decimal degrees. Leave null until confirmed. */
export const GEO: { lat: number | null; lng: number | null } = { lat: null, lng: null };

/** Google Maps place URL. Until set, directions fall back to a Maps search. */
export const MAPS_URL = 'TODO_GOOGLE_MAPS_PLACE_URL';

/**
 * Opening hours, 24h "HH:MM". Use closes < opens for past-midnight service.
 * Rows with TODO values render as "To be confirmed" and are left out of JSON-LD.
 */
export const HOURS: { days: string[]; label: string; opens: string; closes: string }[] = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], label: 'Mon – Thu', opens: 'TODO', closes: 'TODO' },
  { days: ['Friday', 'Saturday'], label: 'Fri – Sat', opens: 'TODO', closes: 'TODO' },
  { days: ['Sunday'], label: 'Sunday', opens: 'TODO', closes: 'TODO' },
];

export const PRICE_RANGE = 'TODO_PRICE_RANGE'; // e.g. "₹₹" — JSON-LD only
export const MENU_URL = 'TODO_MENU_PDF_URL';   // until set, "Get the menu" asks on WhatsApp

export const SOCIALS: { label: string; url: string }[] = [
  { label: 'Instagram', url: 'TODO_INSTAGRAM_URL' },
  { label: 'Facebook', url: 'TODO_FACEBOOK_URL' },
  { label: 'Zomato', url: 'TODO_ZOMATO_URL' },
  { label: 'Google', url: 'TODO_GOOGLE_BUSINESS_URL' },
];

/** Enquiry form endpoint (Formspree, Basin, own API…). Set PUBLIC_FORM_ENDPOINT in .env.
 *  If empty, the form composes the enquiry into a WhatsApp message instead. */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

/* ---- derived helpers ---------------------------------------------------- */

export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const WA_BOOKING = waLink(
  "Hi Kudos! I'd like to hold a table.\nDate: \nTime: \nGuests: \nName: "
);
export const WA_MENU = waLink("Hi Kudos! Could you send me the menu?");
export const WA_EVENTS = waLink("Hi Kudos! I'd like to ask about a private booking / celebration.");

export const TEL_LINK = `tel:${PHONE_TEL}`;

export const DIRECTIONS_URL = isSet(MAPS_URL)
  ? MAPS_URL
  : GEO.lat !== null && GEO.lng !== null
    ? `https://www.google.com/maps/dir/?api=1&destination=${GEO.lat},${GEO.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kudos Restro Lounge Udaipur')}`;

export const MENU_LINK = isSet(MENU_URL) ? MENU_URL : WA_MENU;
