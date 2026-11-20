import heroVisual from '../assets/image.png';
import responsiveHeroBackground from '../assets/resposiveImage.png';

const galleryModules = import.meta.glob('../assets/GalleryImages/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}', { eager: true, import: 'default' });
const galleryFiles = Object.keys(galleryModules).sort().map((key) => galleryModules[key]);

const CAPTIONS = [
  { title: 'Doorstep delivery', text: 'Right to your door, hassle free' },
  { title: 'Groceries & daily needs', text: 'Fresh picks from your favourite store' },
  { title: 'Medicines & health', text: 'When you need it most' },
  { title: 'Gifts & surprises', text: 'Delivered with a smile' },
  { title: 'Shoes & fashion', text: 'Any store, any product' },
  { title: 'Electronics & gadgets', text: 'Handled with care' },
  { title: 'Friendly couriers', text: 'Real people, real support' },
  { title: 'On time, every time', text: "We'll keep you posted" },
];

const SPANS = [
  'col-span-2 row-span-2',
  '',
  '',
  '',
  '',
  'col-span-2',
  '',
  '',
];

const CROPS = [
  { src: heroVisual, zoom: 1, origin: '50% 50%' },
  { src: heroVisual, zoom: 2.3, origin: '28% 72%' },
  { src: heroVisual, zoom: 2.3, origin: '72% 28%' },
  { src: heroVisual, zoom: 2.3, origin: '50% 88%' },
  { src: heroVisual, zoom: 2.3, origin: '88% 72%' },
  { src: responsiveHeroBackground, zoom: 1, origin: '50% 50%' },
  { src: responsiveHeroBackground, zoom: 2, origin: '20% 40%' },
  { src: responsiveHeroBackground, zoom: 2, origin: '80% 65%' },
];

const DETAILS = [
  {
    slug: 'doorstep-delivery',
    category: 'Doorstep service',
    description: 'You share the product and store, then add the address where it should reach. Our team reviews the request, confirms the details with you and keeps the conversation personal from start to finish.',
    highlights: [
      'Request-based service — submitting does not place an automatic order',
      'Tell us the store and the exact product you need',
      'We contact you directly to confirm availability and next steps',
      'Keep the Request ID shown on your confirmation screen',
    ],
  },
  {
    slug: 'groceries-daily-needs',
    category: 'Everyday essentials',
    description: 'Whether it is a weekly shop or one missing item, tell us the store and the products you need. Add a photo if the exact brand matters, and our team will work from the details you provide.',
    highlights: [
      'Name more than one product in a single request',
      'Attach an optional JPG, PNG or WebP photo up to 5 MB',
      'Choose the store you already trust',
      'Availability, price and timing are confirmed with you first',
    ],
  },
  {
    slug: 'medicines-health',
    category: 'Health & pharmacy',
    description: 'Share the medicine, the pharmacy and your delivery details. We review the request and speak with you directly to confirm what is available before anything is arranged.',
    highlights: [
      'Mention the exact product and the store it comes from',
      'Add a photo of the pack if it helps identify the item',
      'Our team confirms availability with you first',
      'Clear communication at every step of your request',
    ],
  },
  {
    slug: 'gifts-surprises',
    category: 'Gifts',
    description: 'Pick the gift and the store, add where it should go, and let us know any delivery notes. We handle the request personally so the surprise stays on your terms.',
    highlights: [
      'Choose any store and any product',
      'Add delivery notes in the request form',
      'Receive a confirmation email with your Request ID',
      'A team member follows up with the next steps',
    ],
  },
  {
    slug: 'shoes-fashion',
    category: 'Fashion & apparel',
    description: 'Found the pair online or in a store? Share the store, size and product details. We work from your request and confirm the specifics with you before proceeding.',
    highlights: [
      'Include size, colour and store in your request',
      'An optional product photo helps us identify the item',
      'No account or app is needed to submit a request',
      'We confirm the details with you personally',
    ],
  },
  {
    slug: 'electronics-gadgets',
    category: 'Electronics',
    description: 'From accessories to a specific gadget, tell us the model and where it is available. A clear description helps us understand exactly what you are asking for.',
    highlights: [
      'Add the model and store details',
      'Attach a photo if the product has similar variants',
      'Every request is reviewed by our team',
      'We confirm availability, price and timing with you',
    ],
  },
  {
    slug: 'friendly-couriers',
    category: 'Our team',
    description: 'Every request is handled by people, not a button. You receive a confirmation, a Request ID and a direct follow-up so you always know who is working on it.',
    highlights: [
      'A unique ID is issued for every request',
      'A confirmation email is sent after submission',
      'A real team member contacts you with next steps',
      'Questions can be sent through the Contact page',
    ],
  },
  {
    slug: 'on-time-every-time',
    category: 'Communication',
    description: 'We keep the process clear: submit your request, look out for the confirmation email, and stay in touch with our team as availability, price and timing are confirmed.',
    highlights: [
      'Confirmation appears right after you submit',
      'Keep your Request ID for your records',
      'Availability, price and timing are confirmed with you',
      'Reach our team any time through the Contact page',
    ],
  },
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const sources = [
  ...galleryFiles.map((src) => ({ src, zoom: 1, origin: '50% 50%' })),
  ...CROPS.slice(0, Math.max(0, 8 - galleryFiles.length)),
];

const slugCounts = {};

export const GALLERY_ITEMS = sources.map((source, index) => {
  const caption = CAPTIONS[index % CAPTIONS.length];
  const detail = DETAILS[index % DETAILS.length];
  const base = detail.slug || slugify(caption.title);
  slugCounts[base] = (slugCounts[base] || 0) + 1;
  const slug = slugCounts[base] === 1 ? base : `${base}-${slugCounts[base]}`;

  return {
    ...source,
    ...caption,
    ...detail,
    slug,
    index: index + 1,
    span: SPANS[index % SPANS.length],
  };
});

export function getGalleryItem(slug) {
  return GALLERY_ITEMS.find((item) => item.slug === slug);
}
