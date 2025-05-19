import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";
import { gsap } from "gsap";

// Custom hook to check if user is authenticated
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    async function checkAuth() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.success);
          setIsAdmin(data.user?.isAdmin || false);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, isAdmin, isLoading };
}

// Protected route component
function ProtectedRoute({ 
  component: Component, 
  adminOnly = false 
}: {
  component: React.ComponentType;
  adminOnly?: boolean;
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation('/login');
      } else if (adminOnly && !isAdmin) {
        setLocation('/');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null;
  }

  return <Component />;
}

// Navigation Bar component
function Navbar() {
  const [path] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Hide navbar on certain pages
  const hiddenPages = ['/login'];
  if (hiddenPages.includes(path)) return null;
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-outfit font-bold">
          <span className="text-accent">A</span>bhay<span className="text-accent">D</span>ev
        </a>
        
        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <a href="/#about" className={`transition-colors hover:text-accent ${
                path === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                About
              </a>
            </li>
            <li>
              <a href="/#services" className={`transition-colors hover:text-accent ${
                path === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Services
              </a>
            </li>
            <li>
              <a href="/#projects" className={`transition-colors hover:text-accent ${
                path === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Projects
              </a>
            </li>
            <li>
              <a href="/#testimonials" className={`transition-colors hover:text-accent ${
                path === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Testimonials
              </a>
            </li>
            <li>
              <a href="/blog" className={`transition-colors hover:text-accent ${
                path.startsWith('/blog') ? 'text-accent' : 'text-muted-foreground'
              }`}>
                Blog
              </a>
            </li>
            {isAuthenticated && (
              <li>
                <a href="/admin" className="text-muted-foreground transition-colors hover:text-accent">
                  Admin
                </a>
              </li>
            )}
            <li>
              <a href="/#contact" className="bg-accent/10 text-accent px-4 py-2 rounded-full border border-accent hover:bg-accent hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/admin" component={() => {
          const AdminDashboard = require('./pages/AdminDashboard').default;
          return <ProtectedRoute component={AdminDashboard} adminOnly={true} />;
        }} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only initialize on larger screens
    if (window.innerWidth < 768) return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener('mousemove', updatePosition);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    // Initialize cursor with GSAP
    gsap.set(".cursor-dot", { xPercent: -50, yPercent: -50 });
    gsap.set(".cursor-outline", { xPercent: -50, yPercent: -50 });
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);
  
  useEffect(() => {
    // Animate cursor with slight delay for trailing effect
    if (!isVisible) return;
    
    gsap.to(".cursor-dot", {
      x: position.x,
      y: position.y,
      duration: 0.1,
      ease: "power2.out"
    });
    
    gsap.to(".cursor-outline", {
      x: position.x,
      y: position.y,
      duration: 0.5, 
      ease: "power2.out"
    });
  }, [position, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <>
      <div className="cursor-dot fixed w-3 h-3 bg-accent rounded-full pointer-events-none z-[9999]"></div>
      <div className="cursor-outline fixed w-8 h-8 border border-accent rounded-full pointer-events-none z-[9998] opacity-50"></div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CustomCursor />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
