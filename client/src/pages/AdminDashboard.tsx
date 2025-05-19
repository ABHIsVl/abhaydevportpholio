import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { BlogPost, BlogCategory } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Form schema for blog posts
const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be in kebab-case format (lowercase with hyphens)'),
  summary: z.string().min(1, 'Summary is required').max(250, 'Summary should be less than 250 characters'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  published: z.boolean().default(false),
});

// Form schema for categories
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be in kebab-case format (lowercase with hyphens)'),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  
  // Initialize blog post form
  const postForm = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      featuredImage: '',
      published: false,
    }
  });
  
  // Initialize category form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
    }
  });
  
  // Fetch all blog posts (including unpublished)
  const { data: blogPosts, isLoading: postsLoading, refetch: refetchPosts } = useQuery<{success: boolean, data: BlogPost[]}>({
    queryKey: ['/api/admin/blog'],
  });
  
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery<{success: boolean, data: BlogCategory[]}>({
    queryKey: ['/api/blog/categories'],
  });
  
  // Create new blog post
  const createPostMutation = useMutation({
    mutationFn: async (post: BlogPostFormValues) => {
      const res = await apiRequest('POST', '/api/admin/blog', post);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      resetPostForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create blog post',
        variant: 'destructive',
      });
    },
  });
  
  // Update blog post
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, post }: { id: number, post: BlogPostFormValues }) => {
      const res = await apiRequest('PUT', `/api/admin/blog/${id}`, post);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      resetPostForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update blog post',
        variant: 'destructive',
      });
    },
  });
  
  // Delete blog post
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/blog/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setConfirmDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete blog post',
        variant: 'destructive',
      });
    },
  });
  
  // Create new category
  const createCategoryMutation = useMutation({
    mutationFn: async (category: CategoryFormValues) => {
      const res = await apiRequest('POST', '/api/admin/category', category);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/categories'] });
      resetCategoryForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout');
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };
  
  // Reset forms
  const resetPostForm = () => {
    postForm.reset({
      title: '',
      slug: '',
      summary: '',
      content: '',
      featuredImage: '',
      published: false,
    });
    setEditingPost(null);
    setShowPostForm(false);
  };
  
  const resetCategoryForm = () => {
    categoryForm.reset({
      name: '',
      slug: '',
    });
    setShowCategoryForm(false);
  };
  
  // Edit blog post
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    postForm.reset({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      featuredImage: post.featuredImage || '',
      published: post.published,
    });
    setShowPostForm(true);
  };
  
  // Submit blog post form
  const onSubmitPost = async (values: BlogPostFormValues) => {
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, post: values });
    } else {
      createPostMutation.mutate(values);
    }
  };
  
  // Submit category form
  const onSubmitCategory = async (values: CategoryFormValues) => {
    createCategoryMutation.mutate(values);
  };
  
  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return slug;
  };
  
  // Handle title change to auto-generate slug if slug is empty
  useEffect(() => {
    const subscription = postForm.watch((value, { name }) => {
      if (name === 'title') {
        const currentSlug = postForm.getValues('slug');
        if (!currentSlug && value.title) {
          postForm.setValue('slug', generateSlug(value.title as string));
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [postForm]);
  
  // Handle category name change to auto-generate slug if slug is empty
  useEffect(() => {
    const subscription = categoryForm.watch((value, { name }) => {
      if (name === 'name') {
        const currentSlug = categoryForm.getValues('slug');
        if (!currentSlug && value.name) {
          categoryForm.setValue('slug', generateSlug(value.name as string));
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [categoryForm]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-outfit font-semibold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs defaultValue="posts">
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
          </TabsList>
          
          {/* Blog Posts Tab */}
          <TabsContent value="posts">
            <div className="bg-card/50 border border-border/40 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-outfit font-semibold">Blog Posts</h2>
                <Button onClick={() => setShowPostForm(true)}>Create New Post</Button>
              </div>
              
              {postsLoading ? (
                <div className="text-center py-12">Loading posts...</div>
              ) : !blogPosts?.data?.length ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No blog posts found. Create your first post to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.data.map((post) => (
                        <tr key={post.id} className="border-b border-border hover:bg-muted/20">
                          <td className="py-3 px-4">
                            <a 
                              href={`/blog/${post.slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium hover:text-accent"
                            >
                              {post.title}
                            </a>
                          </td>
                          <td className="py-3 px-4">{formatDate(post.createdAt.toString())}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              post.published 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-400'
                            }`}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mr-2"
                              onClick={() => handleEditPost(post)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => setConfirmDelete(post.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="bg-card/50 border border-border/40 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-outfit font-semibold">Categories</h2>
                <Button onClick={() => setShowCategoryForm(true)}>Create New Category</Button>
              </div>
              
              {categoriesLoading ? (
                <div className="text-center py-12">Loading categories...</div>
              ) : !categories?.data?.length ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No categories found. Create your first category to organize your blog posts.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Slug</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.data.map((category) => (
                        <tr key={category.id} className="border-b border-border hover:bg-muted/20">
                          <td className="py-3 px-4 font-medium">{category.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{category.slug}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Contact Submissions Tab */}
          <TabsContent value="contacts">
            <div className="bg-card/50 border border-border/40 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-outfit font-semibold mb-6">Contact Submissions</h2>
              <p className="text-muted-foreground mb-8">View all contact form submissions from website visitors.</p>
              
              <div className="text-center py-12 text-muted-foreground">
                <p>Contact submission management will be implemented in the next phase.</p>
                <Button className="mt-4" variant="outline" onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Blog Post Form Dialog */}
      <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingPost ? 'update' : 'create'} a blog post. * indicates required fields.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...postForm}>
            <form onSubmit={postForm.handleSubmit(onSubmitPost)} className="space-y-6">
              <FormField
                control={postForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter blog post title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="my-blog-post-url" />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary *</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Brief description of the blog post" rows={2} />
                    </FormControl>
                    <FormDescription>
                      A short summary that will appear in blog listings (max 250 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Full blog post content (HTML supported)" rows={10} />
                    </FormControl>
                    <FormDescription>
                      The main content of your blog post. HTML tags are supported for formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormDescription>
                      URL for the featured image that will appear at the top of the blog post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published</FormLabel>
                      <FormDescription>
                        Toggle to make this post visible to the public.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetPostForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Category Form Dialog */}
      <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your blog posts.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-6">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Web Development" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="web-development" />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the name. Use lowercase letters, numbers, and hyphens only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetCategoryForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Category
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete !== null} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => {
                if (confirmDelete !== null) {
                  deletePostMutation.mutate(confirmDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}