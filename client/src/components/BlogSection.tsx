import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import SectionWrapper from '@/components/Shared/SectionWrapper';
import Button from '@/components/Shared/Button';
import { BlogPost } from '@shared/schema';

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);

  // Fetch featured blog posts
  const { data: blogPosts, isLoading, error } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ['/api/blog'],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (sectionRef.current && headingRef.current && postsRef.current) {
      // Animate heading
      gsap.from(headingRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });

      // Animate blog posts
      gsap.from(postsRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: postsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          scrub: 0.5
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [blogPosts]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SectionWrapper id="blog" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-outfit font-semibold mb-4">
            Latest from the <span className="text-accent">Blog</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Insights, tips, and thoughts on digital design, development, and creative strategies
          </p>
        </div>
        
        {/* Blog Posts */}
        <div ref={postsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Skeleton loaders for blog posts
            Array(3).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="rounded-xl border border-border/40 overflow-hidden bg-card/50 animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-muted-foreground py-8">
              There was an error loading the blog posts. Please try again later.
            </div>
          ) : blogPosts?.data?.length ? (
            blogPosts.data.slice(0, 3).map((post) => (
              <div key={post.id} className="blog-card rounded-xl border border-border/40 overflow-hidden bg-card/50 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                {post.featuredImage && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{formatDate(post.createdAt.toString())}</span>
                  </div>
                  <h3 className="text-xl font-outfit font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.summary}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-accent font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Read Article 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground py-8">
              No blog posts available at the moment. Check back soon!
            </div>
          )}
        </div>
        
        {/* View All Button */}
        {(blogPosts?.data?.length && blogPosts.data.length > 0) ? (
          <div className="text-center">
            <Button variant="outline" asLink href="/blog">
              View All Articles
            </Button>
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  );
}