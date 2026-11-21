import { useLayoutEffect } from 'react';

export const SITE_URL = 'https://www.citydeliveryservices.com';
const SITE_NAME = 'City Delivery Services';
const DEFAULT_IMAGE = `${SITE_URL}/Logo1.png`;
const SITE_EMAIL = 'citydeliveryservicesofficial@gmail.com';
const SITE_PHONE = '+918189800888';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path = '/') {
  const clean = path === '/' ? '/' : `/${String(path).replace(/^\/+|\/+$/g, '')}`;
  return `${SITE_URL}${clean}`;
}

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  structuredData = [],
}) {
  const canonical = absoluteUrl(path);
  const structuredDataJson = JSON.stringify(
    structuredData.length ? { '@context': 'https://schema.org', '@graph': structuredData } : null
  );

  useLayoutEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setLink('canonical', canonical);

    const existing = document.head.querySelector('#site-seo-jsonld');
    if (existing) existing.remove();
    if (structuredData.length) {
      const script = document.createElement('script');
      script.id = 'site-seo-jsonld';
      script.type = 'application/ld+json';
      script.textContent = structuredDataJson;
      document.head.appendChild(script);
    }

    return () => {
      const jsonLd = document.head.querySelector('#site-seo-jsonld');
      if (jsonLd) jsonLd.remove();
    };
  }, [canonical, description, image, noindex, structuredData.length, structuredDataJson, title, type]);

  return null;
}

export function businessSchema() {
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    logo: { '@type': 'ImageObject', '@id': `${SITE_URL}/#logo`, url: DEFAULT_IMAGE },
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No. 7, Thendral Nagar, Sathuvachari',
      addressLocality: 'Vellore',
      postalCode: '632009',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Vellore',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Tamil Nadu',
        containedInPlace: { '@type': 'Country', name: 'India' },
      },
    },
  };
}

export const organizationSchema = businessSchema;
export const localBusinessSchema = businessSchema;

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'Local product request and delivery support for customers in Vellore, Tamil Nadu.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-IN',
  };
}

export function webPageSchema({ path, name, description, breadcrumb = false }) {
  const url = absoluteUrl(path);
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-IN',
    ...(breadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
}

export function breadcrumbSchema(items, path) {
  const url = absoluteUrl(path);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema() {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/#service`,
    name: 'Local product request and delivery support',
    serviceType: 'Product request and delivery support',
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'City', name: 'Vellore' },
    url: `${SITE_URL}/request`,
  };
}

export function faqSchema(items) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    isPartOf: { '@id': `${SITE_URL}/#webpage` },
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
