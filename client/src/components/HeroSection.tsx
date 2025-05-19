import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MorphingScene from '@/lib/3d/Globe';
import Button from '@/components/Shared/Button';

gsap.registerPlugin(ScrollTrigger);

type HeroSectionProps = {
  onContactClick: () => void;
};

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (textRef.current && sectionRef.current && !hasAnimated) {
      // Staggered entrance animation
      const tl = gsap.timeline({
        onComplete: () => setHasAnimated(true)
      });
      
      tl.from('.hero-title', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero-description', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero-buttons', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6');

      // Scroll-based animations
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
      
      // Text fades out and moves as user scrolls
      scrollTimeline.to('.hero-content', {
        y: -100,
        opacity: 0,
        ease: 'power2.in',
      });
      
      // Animate the scroll indicator
      gsap.from('.scroll-indicator', {
        opacity: 0,
        y: -20,
        duration: 1,
        delay: 2,
        ease: 'power2.out'
      });
    }

    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [hasAnimated]);

  return (
    <section 
      id="hero" 
      ref={sectionRef} 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* 3D Morphing Scene */}
      <MorphingScene />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="hero-content flex flex-col items-center text-center md:text-left md:items-start gap-8">
          <div className="w-full md:w-3/5 space-y-6" ref={textRef}>
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-outfit font-bold leading-tight">
              I Craft <span className="text-accent">Digital Experiences</span>
            </h1>
            <h2 className="hero-subtitle text-xl md:text-2xl text-muted-foreground font-medium">
              Creative Developer & Designer | Abhay Dev
            </h2>
            <p className="hero-description text-lg max-w-xl">
              I transform ideas into impactful digital solutions that connect brands with their audience through strategic design and development.
            </p>
            <div className="hero-buttons flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <Button variant="primary" onClick={onContactClick}>
                Let's Work Together
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
        <div className="w-6 h-12 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-accent rounded-full mt-2 animate-bounce-slow"></div>
        </div>
      </div>
      
      {/* Custom cursor effect - subtle glow follows mouse */}
      <div className="custom-cursor fixed w-6 h-6 rounded-full bg-accent/30 pointer-events-none hidden md:block blur-xl" style={{ 
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'lighten'
      }}></div>
    </section>
  );
}
