import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Services from '@/components/sections/services';
import CosmicJourney from '@/components/sections/journey';
import OurExpertise from '@/components/sections/expertise';
import ContactTestimonials from '@/components/sections/contact-testimonials';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <Services />
      <CosmicJourney />
      <OurExpertise />
      <ContactTestimonials />
    </div>
  );
}
