import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { BlogPost, BlogCategory } from '@shared/schema';
import Button from '@/components/Shared/Button';

export default function BlogPostPage() {
  // Get slug from URL
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  
  // Fetch blog post data
  const { data: blogPost, isLoading, error } = useQuery<{ success: boolean; data: BlogPost }>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Skeleton loaders */}
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/4 mx-auto mb-16 animate-pulse"></div>
            
            <div className="h-72 bg-muted rounded-xl w-full mb-8 animate-pulse"></div>
            
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-4/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !blogPost?.data) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-3xl font-outfit font-semibold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or may have been removed.
            </p>
            <Button variant="primary" asLink href="/blog">
              Return to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const post = blogPost.data;
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back to blogs link */}
          <div className="mb-8">
            <Link href="/blog" className="text-accent flex items-center gap-1 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all articles
            </Link>
          </div>
          
          {/* Article Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-semibold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>{formatDate(post.createdAt.toString())}</span>
            </div>
          </header>
          
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="rounded-xl overflow-hidden mb-12 max-h-[500px]">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert prose-headings:font-outfit prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Divider */}
          <div className="border-t border-border my-12"></div>
          
          {/* Back to Blog button */}
          <div className="text-center">
            <Button variant="outline" asLink href="/blog">
              Back to all articles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}