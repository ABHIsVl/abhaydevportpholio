import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/Shared/SectionWrapper';
import ProjectCard from '@/components/Shared/ProjectCard';
import Button from '@/components/Shared/Button';
import { useTheme } from '@/hooks/use-theme';

gsap.registerPlugin(ScrollTrigger);

type Project = {
  image: string;
  category: 'social' | 'web' | 'content';
  title: string;
  description: string;
  tech: string;
};

const projects: Project[] = [
  {
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    category: "social",
    title: "Fashion Brand Campaign",
    description: "Complete social media strategy and content creation for a premium fashion brand.",
    tech: "Instagram + TikTok"
  },
  {
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    category: "web",
    title: "Luxury E-commerce Store",
    description: "Custom-built React storefront with seamless payment integration and user experience.",
    tech: "React + Node.js"
  },
  {
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    category: "content",
    title: "Travel Brand Video Series",
    description: "Conceptualized and produced a series of destination spotlight videos for a travel agency.",
    tech: "Video Production"
  },
  {
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    category: "social",
    title: "Tech Startup Launch",
    description: "Comprehensive social media strategy that helped a tech startup gain 10k followers in 30 days.",
    tech: "Strategy + Management"
  },
  {
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    category: "web",
    title: "Finance Dashboard App",
    description: "Interactive data visualization dashboard for a financial services company.",
    tech: "React + D3.js"
  },
  {
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    category: "content",
    title: "Retail Product Launch",
    description: "Created a multi-platform content strategy for a major product launch campaign.",
    tech: "Photography + Strategy"
  }
];

export default function ProjectsSection() {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'social' | 'web' | 'content'>('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  useEffect(() => {
    if (sectionRef.current && headingRef.current && filtersRef.current && projectsRef.current) {
      // Animate heading
      gsap.from(headingRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });

      // Animate filters
      gsap.from(filtersRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: filtersRef.current,
          start: 'top 80%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });
      
      // Add horizontal camera movement
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        xPercent: -5,
        ease: "none"
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate projects when filter changes
  useEffect(() => {
    if (projectsRef.current) {
      const projectCards = projectsRef.current.children;
      
      gsap.fromTo(
        projectCards,
        { 
          y: 30, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0,
          opacity: 1, 
          scale: 1,
          duration: 0.5, 
          stagger: 0.08,
          ease: 'power2.out'
        }
      );
    }
  }, [filteredProjects]);

  return (
    <SectionWrapper id="projects" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent opacity-5 rounded-full blur-3xl"></div>
      </div>
    
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-outfit font-semibold mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            A selection of my recent work across various digital domains
          </p>
        </div>
        
        {/* Project Filters */}
        <div ref={filtersRef} className="flex flex-wrap justify-center gap-4 mb-10">
          <button 
            className={`px-4 py-2 rounded-md transition-colors border ${activeFilter === 'all' 
              ? 'bg-accent/20 border-accent text-foreground font-medium' 
              : 'bg-card/50 border-border hover:bg-card'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Projects
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors border ${activeFilter === 'social' 
              ? 'bg-accent/20 border-accent text-foreground font-medium' 
              : 'bg-card/50 border-border hover:bg-card'}`}
            onClick={() => setActiveFilter('social')}
          >
            Social Media
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors border ${activeFilter === 'web' 
              ? 'bg-accent/20 border-accent text-foreground font-medium' 
              : 'bg-card/50 border-border hover:bg-card'}`}
            onClick={() => setActiveFilter('web')}
          >
            Web Development
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors border ${activeFilter === 'content' 
              ? 'bg-accent/20 border-accent text-foreground font-medium' 
              : 'bg-card/50 border-border hover:bg-card'}`}
            onClick={() => setActiveFilter('content')}
          >
            Content Creation
          </button>
        </div>
        
        {/* Projects Grid */}
        <div 
          ref={projectsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              image={project.image}
              category={project.category}
              title={project.title}
              description={project.description}
              tech={project.tech}
              theme={theme}
            />
          ))}
        </div>
        
        {/* More Projects CTA */}
        <div className="mt-16 text-center">
          <Button variant="outline">
            View All Projects
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
