import { useRef } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { smoothScrollTo } from '@/lib/utils';

export default function Home() {
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    if (contactSectionRef.current) {
      smoothScrollTo('contact');
    }
  };

  return (
    <div className="min-h-screen relative">
      <NavBar onContactClick={scrollToContact} />
      
      <main>
        <HeroSection onContactClick={scrollToContact} />
        <AboutSection />
        <ServicesSection onContactClick={scrollToContact} />
        <ProjectsSection />
        <TestimonialsSection onContactClick={scrollToContact} />
        <BlogSection />
        <div ref={contactSectionRef}>
          <ContactSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
