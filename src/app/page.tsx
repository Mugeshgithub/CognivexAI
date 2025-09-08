import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Services from '@/components/sections/services';
import ContactTestimonials from '@/components/sections/contact-testimonials';

// Lazy load heavy components
const CosmicJourney = dynamic(() => import('@/components/sections/journey'), {
  loading: () => <div className="h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
});

const OurExpertise = dynamic(() => import('@/components/sections/expertise'), {
  loading: () => <div className="py-20 bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>
});

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
