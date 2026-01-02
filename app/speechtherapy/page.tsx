import Navigation from '@/components/speechtherapy/Navigation';
import HeroSection from '@/components/speechtherapy/HeroSection';
import ServicesSection from '@/components/speechtherapy/ServicesSection';
import TherapistProfile from '@/components/speechtherapy/TherapistProfile';
import TestimonialSection from '@/components/speechtherapy/TestimonialSection';
import ContactSection from '@/components/speechtherapy/ContactSection';
import Footer from '@/components/speechtherapy/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bilingual & Brilliant Speech Therapy - Chicago',
  description: 'Expert speech therapy services for children and adults. Bilingual (English/Spanish) treatment with 12+ years of experience. Schedule your consultation today.',
  keywords: 'speech therapy, speech-language pathologist, Chicago, bilingual therapy, SLP',
};

export default function SpeechTherapyPage() {
  return (
    <div className="bg-white">
      <Navigation />
      
      {/* Main content with top padding for fixed nav */}
      <main className="pt-16">
        <section id="home">
          <HeroSection />
        </section>
        
        <section id="services">
          <ServicesSection />
        </section>
        
        <section id="about">
          <TherapistProfile />
        </section>
        
        <section id="testimonials">
          <TestimonialSection />
        </section>
        
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
