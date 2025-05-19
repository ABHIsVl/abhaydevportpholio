import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/Shared/SectionWrapper';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && textRef.current && imageRef.current) {
      // Main timeline for scroll-based animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'center 40%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });
      
      // Add parallax effect to the section
      tl.fromTo(imageRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      );
      
      // Staggered text animation
      gsap.from(textRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
          scrub: 0.3
        }
      });
      
      // Timeline entries animation
      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
        gsap.from(timelineItems, {
          x: -50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.5,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            end: 'bottom 70%',
            toggleActions: 'play none none reverse',
            scrub: 0.3
          }
        });
      }
      
      // Subtle 3D perspective effect
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        rotationX: 5,
        transformPerspective: 1000,
        ease: 'none'
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <SectionWrapper id="about" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-60 h-60 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div ref={sectionRef} className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Animated Character Side */}
          <div ref={imageRef} className="w-full lg:w-2/5 relative order-2 lg:order-1">
            <div className="border border-border/20 p-6 rounded-xl shadow-lg bg-background/50 backdrop-blur-sm">
              {/* Animated Character SVG */}
              <div className="rounded-lg w-full aspect-square overflow-hidden z-10 relative animated-character-container">
                <svg 
                  viewBox="0 0 400 400" 
                  className="animated-character w-full h-full" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Base circle for face */}
                  <circle cx="200" cy="180" r="120" className="face fill-accent/10 stroke-accent/40" strokeWidth="2" />
                  
                  {/* Eyes */}
                  <ellipse cx="150" cy="160" rx="20" ry="25" className="eyes fill-foreground dark:fill-white" />
                  <ellipse cx="250" cy="160" rx="20" ry="25" className="eyes fill-foreground dark:fill-white" />
                  
                  {/* Smaller circles inside eyes that move */}
                  <circle cx="155" cy="160" r="8" className="pupils fill-accent" />
                  <circle cx="255" cy="160" r="8" className="pupils fill-accent" />
                  
                  {/* Smile */}
                  <path 
                    d="M 140 220 Q 200 280 260 220" 
                    className="smile stroke-foreground dark:stroke-white" 
                    fill="transparent" 
                    strokeWidth="5" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Glasses */}
                  <rect x="125" y="145" width="50" height="35" rx="10" className="glasses fill-transparent stroke-accent" strokeWidth="3" />
                  <rect x="225" y="145" width="50" height="35" rx="10" className="glasses fill-transparent stroke-accent" strokeWidth="3" />
                  <line x1="175" y1="160" x2="225" y2="160" className="glasses-bridge stroke-accent" strokeWidth="3" />
                  
                  {/* Hair */}
                  <path
                    d="M 100 120 C 100 80 200 30 300 120"
                    className="hair stroke-foreground dark:stroke-white" 
                    strokeWidth="8"
                    fill="transparent"
                  />
                  
                  {/* Digital elements */}
                  <circle cx="100" cy="250" r="15" className="digital-element fill-accent/30 animate-pulse" />
                  <circle cx="300" cy="250" r="15" className="digital-element fill-accent/30 animate-pulse" />
                  <rect x="120" y="270" width="160" height="10" rx="5" className="digital-bar fill-accent/20" />
                  <rect x="140" y="290" width="120" height="10" rx="5" className="digital-bar fill-accent/20" />
                  <rect x="160" y="310" width="80" height="10" rx="5" className="digital-bar fill-accent/20" />
                </svg>
              </div>
              
              {/* Interactive timeline - side of image */}
              <div ref={timelineRef} className="mt-6 space-y-3">
                <h3 className="text-lg font-outfit font-medium mb-3 text-accent">Career Timeline</h3>
                <div className="timeline-item flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-outfit font-medium">2023 - Present</h4>
                    <p className="text-sm text-muted-foreground">Creative Director, DigitalCraft Studio</p>
                  </div>
                </div>
                <div className="timeline-item flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-outfit font-medium">2020 - 2023</h4>
                    <p className="text-sm text-muted-foreground">Lead Developer, TechVision</p>
                  </div>
                </div>
                <div className="timeline-item flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-outfit font-medium">2018 - 2020</h4>
                    <p className="text-sm text-muted-foreground">Social Media Manager, CreativeWorks</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
          </div>
          
          {/* Text Content Side */}
          <div ref={textRef} className="w-full lg:w-3/5 space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-outfit font-semibold">
              About Me
            </h2>
            <div className="w-20 h-1 bg-accent"></div>
            <p className="text-lg">
              I'm Abhay Dev, a versatile digital creator who bridges the gap between creative design and technical implementation. With a background spanning both development and design, I craft digital experiences that don't just look good—they perform exceptionally.
            </p>
            <p className="text-lg">
              My approach combines strategic thinking with creative execution, delivering solutions that help brands connect with their audience in meaningful ways. Every project I undertake is driven by a user-centered philosophy that prioritizes both aesthetics and functionality.
            </p>
            
            {/* Skills/Expertise - Grid layout */}
            <div className="pt-6">
              <h3 className="text-xl font-outfit font-medium mb-4">Areas of Expertise</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <div className="skill-item">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <h4 className="font-outfit font-medium">Web Development</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <h4 className="font-outfit font-medium">UI/UX Design</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <h4 className="font-outfit font-medium">Content Creation</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <h4 className="font-outfit font-medium">Social Media</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <h4 className="font-outfit font-medium">Brand Strategy</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <h4 className="font-outfit font-medium">3D Modeling</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
