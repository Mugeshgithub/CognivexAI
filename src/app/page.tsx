import Hero from '@/components/sections/hero';
import Products from '@/components/sections/products';
import CosmicJourney from '@/components/sections/journey';
import ContactTestimonials from '@/components/sections/contact-testimonials';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Products />
      <CosmicJourney />
      <ContactTestimonials />
    </div>
  );
}
