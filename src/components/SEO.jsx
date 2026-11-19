import { useEffect } from 'react';

export const SITE_URL = 'https://www.citydeliveryservices.com';
const DEFAULT_IMAGE = `${SITE_URL}/Logo1.png`;

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
  const structuredDataJson = JSON.stringify(structuredData);

  useEffect(() => {
    const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setLink('canonical', canonical);

    const existing = document.head.querySelector('#site-seo-jsonld');
    if (existing) existing.remove();
    if (structuredDataJson !== '[]') {
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
  }, [description, image, noindex, path, structuredDataJson, title, type]);

  return null;
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'City Delivery Services',
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    email: 'citydeliveryservicesofficial@gmail.com',
    telephone: '+918189800888',
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'City Delivery Services',
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    logo: DEFAULT_IMAGE,
    email: 'citydeliveryservicesofficial@gmail.com',
    telephone: '+918189800888',
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
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'City Delivery Services',
    url: SITE_URL,
    description: 'Local product request and delivery support for customers in Vellore.',
  };
}

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Local product request and delivery support',
    serviceType: 'Product request and delivery support',
    provider: { '@type': 'LocalBusiness', name: 'City Delivery Services', url: SITE_URL },
    areaServed: { '@type': 'City', name: 'Vellore' },
    serviceUrl: `${SITE_URL}/request`,
  };
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
