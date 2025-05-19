import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type ProjectCardProps = {
  image: string;
  category: 'social' | 'web' | 'content';
  title: string;
  description: string;
  tech: string;
  theme: 'dark' | 'light';
};

export default function ProjectCard({ image, category, title, description, tech, theme }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const categoryLabel = {
    social: "Social Media",
    web: "Web Development",
    content: "Content Creation"
  };

  useEffect(() => {
    if (cardRef.current) {
      // Set 3D perspective on card for better visual depth
      gsap.set(cardRef.current, {
        transformPerspective: 1000
      });
      
      // Add mouse move for 3D tilt effect
      const handleMouseMove = (e: MouseEvent) => {
        if (!isHovered || !cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element
        const y = e.clientY - rect.top;  // y position within element
        
        // Calculate rotation based on mouse position (max ±5 degrees)
        const rotateY = ((x / rect.width) - 0.5) * 5;
        const rotateX = ((y / rect.height) - 0.5) * -5;
        
        // Apply smooth rotation
        gsap.to(cardRef.current, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.2,
          ease: 'power2.out'
        });
      };
      
      const card = cardRef.current;
      card.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (cardRef.current) {
      // Enhanced card elevation with subtle shadow
      gsap.to(cardRef.current, {
        y: -10,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
    
    if (imageRef.current) {
      // Smooth image scale up
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.5,
        ease: 'power1.out'
      });
    }
    
    if (contentRef.current) {
      // Subtle content lift for 3D effect
      gsap.to(contentRef.current, {
        y: -5,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (cardRef.current) {
      // Reset position and rotation
      gsap.to(cardRef.current, {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
    
    if (imageRef.current) {
      // Reset image scale
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'power1.out'
      });
    }
    
    if (contentRef.current) {
      // Reset content position
      gsap.to(contentRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`project-card border border-border/40 ${theme === 'dark' ? 'bg-card/70' : 'bg-background/80'} rounded-xl overflow-hidden shadow-sm transition-all`}
      data-category={category}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="overflow-hidden h-56 relative">
        <img 
          ref={imageRef}
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Enhanced gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-50'}`}></div>
        
        {/* Category badge with enhanced styling */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium backdrop-blur-sm border border-accent/30 bg-accent/10 text-foreground px-3 py-1 rounded-full inline-block shadow-sm">
            {categoryLabel[category]}
          </span>
        </div>
      </div>
      
      <div ref={contentRef} className="p-6" style={{ transform: 'translateZ(5px)' }}>
        <h3 className="text-xl font-outfit font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tech.split(',').map((item, index) => (
            <span 
              key={index}
              className="text-xs py-1 px-2 rounded-full bg-accent/10 border border-accent/20 text-accent"
            >
              {item.trim()}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button 
            className={`text-sm font-medium flex items-center gap-1 transition-all ${isHovered ? 'text-accent translate-x-1' : 'text-foreground'}`}
            aria-label="View case study"
          >
            <span>View Case Study</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
