import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type TestimonialCardProps = {
  quote: string;
  avatar: string;
  name: string;
  position: string;
  theme: 'dark' | 'light';
};

export default function TestimonialCard({ quote, avatar, name, position, theme }: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Set up hover animation
      const card = cardRef.current;
      
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
    
    return () => {
      if (cardRef.current) {
        const card = cardRef.current;
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`border border-border/50 ${theme === 'dark' ? 'bg-card' : 'bg-background'} rounded-xl p-8 h-full shadow-sm transition-all`}
    >
      <div className="flex justify-center mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
      </div>
      <p className="text-center text-muted-foreground mb-6 italic">
        "{quote}"
      </p>
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-accent/20">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-outfit font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
      </div>
    </div>
  );
}
