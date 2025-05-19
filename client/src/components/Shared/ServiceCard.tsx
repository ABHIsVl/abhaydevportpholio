import { ReactNode, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  theme: 'dark' | 'light';
};

export default function ServiceCard({ icon, title, description, features, theme }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Set up hover animation
      cardRef.current.addEventListener('mouseenter', () => {
        gsap.to(cardRef.current, {
          y: -10,
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        });
      });

      cardRef.current.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
        });
      });
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`glass-card ${theme === 'dark' ? 'glass-dark' : 'glass-light'} rounded-xl p-6 transition-all duration-300 border border-border/50`}
    >
      <div className="w-14 h-14 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-outfit font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <ul className="space-y-2 text-foreground/80">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
