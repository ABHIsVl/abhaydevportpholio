import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { BlogPost, BlogCategory } from '@shared/schema';
import Button from '@/components/Shared/Button';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Fetch all blog posts
  const { data: blogPosts, isLoading: postsLoading } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ['/api/blog', { limit: 100 }], // Fetching max 100 posts
  });
  
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<{ success: boolean; data: BlogCategory[] }>({
    queryKey: ['/api/blog/categories'],
  });
  
  // Filter posts by category
  const filteredPosts = selectedCategory 
    ? blogPosts?.data.filter(post => {
        // In a real app, you'd have to check post categories
        // This is a simplified version
        return true;
      }) 
    : blogPosts?.data;
  
  // Paginate posts
  const totalPages = filteredPosts 
    ? Math.ceil(filteredPosts.length / postsPerPage) 
    : 0;
  
  const paginatedPosts = filteredPosts
    ? filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
    : [];
  
  // Reset to page 1 when changing categories
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-outfit font-semibold mb-4">The Blog</h1>
          <div className="w-20 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and thoughts on digital design, development, and creative strategies
          </p>
        </div>
        
        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-accent/20 border border-accent text-foreground'
                : 'bg-card/50 border border-border hover:border-accent/50'
            }`}
          >
            All Posts
          </button>
          
          {categoriesLoading ? (
            // Category skeletons
            Array(4).fill(0).map((_, i) => (
              <div key={`cat-skeleton-${i}`} className="w-24 h-10 bg-muted rounded-full animate-pulse"></div>
            ))
          ) : (
            categories?.data.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-accent/20 border border-accent text-foreground'
                    : 'bg-card/50 border border-border hover:border-accent/50'
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
        
        {/* Blog Posts Grid */}
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={`post-skeleton-${i}`} className="rounded-xl border border-border/40 overflow-hidden bg-card/50 animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedPosts?.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedPosts.map(post => (
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
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-outfit font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-6">There are currently no articles in this category.</p>
            {selectedCategory && (
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                View All Posts
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}