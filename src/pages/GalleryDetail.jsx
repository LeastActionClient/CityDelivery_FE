import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx';
import SEO, { absoluteUrl, breadcrumbSchema, businessSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';
import { GALLERY_ITEMS, getGalleryItem } from '../utils/gallery.js';

const BRAND = 'City Delivery Services';

export default function GalleryDetail() {
  const { slug } = useParams();
  const item = getGalleryItem(slug);
  const path = `/gallery/${slug}`;

  if (!item) {
    return (
      <>
        <SEO
          title="Gallery image not found | City Delivery Services"
          description="The gallery image you requested could not be found."
          path={path}
          noindex
        />
        <PageHero eyebrow="Gallery" title="Image not found." description="That gallery image is not available. You can return to the homepage and browse the gallery from there." />
        <section className="pb-24 text-center">
          <Button to="/">Back to home</Button>
        </section>
      </>
    );
  }

  const related = [1, 2, 3].map((offset) => GALLERY_ITEMS[(item.index - 1 + offset) % GALLERY_ITEMS.length]);
  const title = `${item.title} | ${BRAND}`;
  const fullDescription = `${item.text}. ${item.description}`;
  const description = fullDescription.length > 158 ? `${fullDescription.slice(0, 155).trimEnd()}…` : fullDescription;
  const image = absoluteUrl(item.src);

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={path}
        image={image}
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({ path, name: item.title, description, breadcrumb: true }),
          breadcrumbSchema(
            [
              { name: 'Home', path: '/' },
              { name: 'Gallery', path: '/#gallery' },
              { name: item.title, path },
            ],
            path
          ),
        ]}
      />
      <PageHero eyebrow={item.category} title={item.title} description={item.text} />

      <section className="pb-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-yellow to-brand-yellow-soft p-3 shadow-lift">
              <img src={item.src} alt={`${item.title} — ${BRAND}`} className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" loading="eager" decoding="async" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">{item.category}</span>
              <h2 className="mt-5 text-3xl font-extrabold text-brand-dark sm:text-4xl">About this service</h2>
              <p className="mt-5 text-lg leading-relaxed text-brand-muted">{item.description}</p>
            </Reveal>
            <Stagger className="mt-8 space-y-3">
              {item.highlights.map((highlight) => (
                <StaggerItem key={highlight}>
                  <div className="flex gap-3 rounded-2xl border border-brand-green/15 bg-white/70 p-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-green text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-brand-dark">{highlight}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button to="/request">Request a Service <ArrowRight className="h-4 w-4" /></Button>
                <Button to="/how-it-works" variant="outline">How it works</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <SectionHeading eyebrow="Keep exploring" title="More from the gallery" description="See more of the products and moments we help bring to your door." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedItem) => (
              <Reveal key={relatedItem.slug}>
                <Link to={`/gallery/${relatedItem.slug}`} className="group block overflow-hidden rounded-3xl border border-brand-yellow/40 bg-white shadow-lift transition-transform hover:-translate-y-1">
                  <img src={relatedItem.src} alt={`${relatedItem.title} — ${BRAND}`} loading="lazy" decoding="async" className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="p-5">
                    <span className="eyebrow">{relatedItem.category}</span>
                    <h3 className="mt-2 text-lg font-extrabold text-brand-dark">{relatedItem.title}</h3>
                    <p className="mt-1 text-sm text-brand-muted">{relatedItem.text}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-10 text-center">
              <Button href="/#gallery" variant="outline"><ArrowLeft className="h-4 w-4" /> Back to gallery</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
