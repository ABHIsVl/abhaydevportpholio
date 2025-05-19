import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/Shared/SectionWrapper';
import TestimonialCard from '@/components/Shared/TestimonialCard';
import Button from '@/components/Shared/Button';
import { useTheme } from '@/hooks/use-theme';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

type TestimonialsSectionProps = {
  onContactClick: () => void;
};

const testimonials = [
  {
    quote: "Abhay completely transformed our social media presence. His strategic approach and creative content helped us double our engagement in just three months. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    name: "Sarah Johnson",
    position: "Marketing Director, FashionBrand"
  },
  {
    quote: "The website Abhay built for our startup not only looks fantastic but converts visitors at an impressive rate. His understanding of both design and user psychology is exceptional.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    name: "Alex Chen",
    position: "Founder, TechStartup"
  },
  {
    quote: "Abhay's content creation for our travel agency brought our destinations to life. The video series he produced generated a 40% increase in bookings for featured locations.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    name: "Mia Rodriguez",
    position: "CEO, TravelWonders"
  }
];

export default function TestimonialsSection({ onContactClick }: TestimonialsSectionProps) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && headingRef.current && carouselRef.current && ctaRef.current) {
      // Create timeline for this section
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'center 50%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });

      // Add camera/perspective movement
      timeline.to(sectionRef.current, {
        rotationX: 5,
        transformPerspective: 1000,
        ease: 'none'
      });

      // Animate heading
      gsap.from(headingRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          end: 'bottom 70%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });

      // Animate carousel items
      const carouselItems = carouselRef.current.querySelectorAll('.carousel-item');
      gsap.from(carouselItems, {
        scale: 0.9,
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top 75%',
          end: 'center 60%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });

      // Animate CTA
      gsap.from(ctaRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          end: 'top 70%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <SectionWrapper id="testimonials" className="py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-outfit font-semibold mb-4">Client Testimonials</h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            What my clients say about working together
          </p>
        </div>
        
        {/* Testimonials Carousel */}
        <div ref={carouselRef} className="overflow-hidden relative">
          <Carousel 
            opts={{
              align: "start",
              loop: true
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="carousel-item sm:basis-1/2 lg:basis-1/3 p-4">
                  <TestimonialCard
                    quote={testimonial.quote}
                    avatar={testimonial.avatar}
                    name={testimonial.name}
                    position={testimonial.position}
                    theme={theme}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="border border-border hover:bg-accent hover:text-accent-foreground" />
              <CarouselNext className="border border-border hover:bg-accent hover:text-accent-foreground" />
            </div>
          </Carousel>
        </div>
        
        {/* Testimonial CTA */}
        <div ref={ctaRef} className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-4">Ready to create your success story?</p>
          <Button variant="primary" onClick={onContactClick}>
            Let's Add Your Story Here
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
