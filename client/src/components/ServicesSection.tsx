import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/Shared/SectionWrapper';
import ServiceCard from '@/components/Shared/ServiceCard';
import Button from '@/components/Shared/Button';
import { useTheme } from '@/hooks/use-theme';

gsap.registerPlugin(ScrollTrigger);

type ServicesSectionProps = {
  onContactClick: () => void;
};

// Service card data with enhanced descriptions
const services = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Digital Experience Design",
    description: "Creating seamless, intuitive digital interfaces that engage users and drive conversions.",
    features: [
      "User experience research",
      "Interactive prototyping",
      "Conversion optimization"
    ]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Visual Storytelling",
    description: "Crafting compelling visual narratives that communicate your brand's unique story.",
    features: [
      "Brand identity development",
      "Visual content creation",
      "Immersive storytelling"
    ]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Interactive Development",
    description: "Building responsive, performant web applications with modern frameworks and technologies.",
    features: [
      "Frontend development",
      "3D web experiences",
      "Performance optimization"
    ]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    title: "Digital Strategy",
    description: "Strategic planning that aligns digital initiatives with your business objectives.",
    features: [
      "Digital transformation",
      "Growth planning",
      "Market positioning"
    ]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Content Ecosystem",
    description: "Developing integrated content strategies that connect with your target audience.",
    features: [
      "Content strategy",
      "Social media management",
      "Audience engagement"
    ]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Brand Evolution",
    description: "Guiding brands through transformational growth and identity refinement.",
    features: [
      "Brand positioning",
      "Visual identity systems",
      "Brand experience design"
    ]
  }
];

export default function ServicesSection({ onContactClick }: ServicesSectionProps) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (sectionRef.current && headingRef.current && cardsRef.current) {
      // Section entry animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 0.5
        }
      });
      
      // Heading animation
      tl.from(headingRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      });
      
      // Cards staggered animation
      gsap.from('.service-card', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "center 60%",
          scrub: 0.5
        }
      });
      
      // Horizontal parallax effect
      gsap.to('.service-card', {
        x: (i) => (i % 2 === 0 ? -20 : 20),
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
      
      // Subtle rotate effect on scroll
      gsap.to(sectionRef.current, {
        rotationY: 2,
        transformPerspective: 1000,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle card tabs
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    
    if (cardsRef.current) {
      // Animate to show the active tab
      gsap.to(cardsRef.current.children, {
        opacity: (i) => i === index ? 1 : 0.5,
        scale: (i) => i === index ? 1.03 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <SectionWrapper id="services" className="py-24 relative overflow-hidden">
      {/* Background elements for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        {/* Section Header with modern styling */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-outfit font-semibold mb-4">
            My <span className="text-accent">Services</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            I craft comprehensive digital solutions that transform ideas into impactful experiences
          </p>
        </div>
        
        {/* Service category tabs */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {services.slice(0, 3).map((service, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
                activeTab === index 
                  ? 'bg-accent/20 border border-accent text-foreground' 
                  : 'bg-card/50 border border-border hover:border-accent/50'
              }`}
              onClick={() => handleTabChange(index)}
            >
              {service.title}
            </button>
          ))}
        </div>
        
        {/* Services Grid with enhanced styling */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`service-card transition-all duration-500 ${activeTab === index ? 'ring-1 ring-accent ring-opacity-50' : ''}`}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                theme={theme}
              />
            </div>
          ))}
        </div>
        
        {/* Call to action with enhanced styling */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
            Ready to transform your digital presence with cutting-edge solutions?
          </p>
          <Button variant="primary" onClick={onContactClick}>
            Let's Discuss Your Project
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
