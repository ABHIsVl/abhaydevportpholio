import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import ThemeToggle from './ThemeToggle';

type NavBarProps = {
  onContactClick: () => void;
};

export default function NavBar({ onContactClick }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <nav className={`container mx-auto px-4 py-4 flex justify-between items-center glass-card ${theme === 'dark' ? 'glass-dark' : 'glass-light'}`}>
        <a href="#" className="text-2xl font-outfit font-bold text-foreground">
          <span className="text-accent">A</span>bhay<span className="text-accent">D</span>ev
        </a>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-foreground hover:text-accent transition-colors">About</a>
            <a href="#services" className="text-foreground hover:text-accent transition-colors">Services</a>
            <a href="#projects" className="text-foreground hover:text-accent transition-colors">Projects</a>
            <a href="#testimonials" className="text-foreground hover:text-accent transition-colors">Testimonials</a>
            <button 
              onClick={onContactClick} 
              className="bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-opacity-80 transition-all"
            >
              Let's Talk
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div className={`md:hidden glass-card ${theme === 'dark' ? 'glass-dark' : 'glass-light'} py-4 px-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-4">
          <a href="#about" className="text-foreground hover:text-accent transition-colors py-2">About</a>
          <a href="#services" className="text-foreground hover:text-accent transition-colors py-2">Services</a>
          <a href="#projects" className="text-foreground hover:text-accent transition-colors py-2">Projects</a>
          <a href="#testimonials" className="text-foreground hover:text-accent transition-colors py-2">Testimonials</a>
          <button 
            onClick={onContactClick} 
            className="bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-opacity-80 transition-all w-full text-left"
          >
            Let's Talk
          </button>
        </div>
      </div>
    </header>
  );
}
