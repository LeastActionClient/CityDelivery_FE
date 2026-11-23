const env = import.meta.env;

/** Public, configurable business details. Empty values are hidden in the UI — nothing is invented. */
export const SITE = {
  name: 'City Delivery Services',
  apiUrl: (env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, ''),
  email: env.VITE_CONTACT_EMAIL || 'citydeliveryservicesofficial@gmail.com',
  phone: env.VITE_CONTACT_PHONE || '8189800888',
  address: env.VITE_BUSINESS_ADDRESS || 'Head office: No. 7, Thendral Nagar, Sathuvachari, Vellore, 632009 — Above Citywash Building',
  serviceCity: env.VITE_SERVICE_CITY || 'Vellore',
  social: {
    Instagram: env.VITE_SOCIAL_INSTAGRAM || '',
    Facebook: env.VITE_SOCIAL_FACEBOOK || '',
    X: env.VITE_SOCIAL_X || '',
    WhatsApp: env.VITE_SOCIAL_WHATSAPP || '',
  },
};

export const CATEGORIES = [
  'Groceries',
  'Fashion & Apparel',
  'Electronics',
  'Home & Kitchen',
  'Health & Beauty',
  'Books & Stationery',
  'Gifts',
  'Other',
];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PROHIBITED_ITEMS_POLICY_VERSION = '2026-11-20';

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];
