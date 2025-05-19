import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBlogPostSchema, insertBlogCategorySchema } from "@shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";
import { seed } from "./seed";

// Type for request with authenticated user
type AuthRequest = Request & { isAuthenticated(): boolean; user?: any };

// Authentication middleware for admin access
const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  if (!req.user?.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Seed the database with admin user and initial blog data (if not already seeded)
  await seed();
  
  // ----------------------------------------
  // Public API routes
  // ----------------------------------------
  
  // API endpoint to handle contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertContactSchema.parse(req.body);
      
      // Store the contact submission
      const submission = await storage.createContactSubmission(validatedData);
      
      // Return success response
      res.status(201).json({ 
        success: true, 
        message: 'Contact form submitted successfully', 
        data: submission 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        res.status(400).json({ 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        });
      } else {
        // Handle other errors
        console.error('Error submitting contact form:', error);
        res.status(500).json({ 
          success: false, 
          message: 'An error occurred while processing your request' 
        });
      }
    }
  });

  // ----------------------------------------
  // Blog API Routes - Public
  // ----------------------------------------
  
  // Get all published blog posts
  app.get('/api/blog', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const posts = await storage.getBlogPosts(limit, offset, true);
      
      res.status(200).json({ 
        success: true, 
        data: posts 
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching blog posts' 
      });
    }
  });
  
  // Get a specific blog post by slug
  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: 'Blog post not found' 
        });
      }
      
      // Only return published posts to the public (unless admin)
      if (!post.published && !(req.isAuthenticated && (req as AuthRequest).isAuthenticated() && (req as AuthRequest).user?.isAdmin)) {
        return res.status(404).json({ 
          success: false, 
          message: 'Blog post not found' 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        data: post 
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching the blog post' 
      });
    }
  });
  
  // Get all blog categories
  app.get('/api/blog/categories', async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.status(200).json({ 
        success: true, 
        data: categories 
      });
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching blog categories' 
      });
    }
  });
  
  // Get posts by category
  app.get('/api/blog/category/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getBlogCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getBlogPostsByCategory(category.id, limit, offset);
      res.status(200).json({ 
        success: true, 
        data: posts 
      });
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching posts by category' 
      });
    }
  });
  
  // ----------------------------------------
  // Admin API Routes - Protected
  // ----------------------------------------
  
  // Get all contact submissions (admin dashboard)
  app.get('/api/contact', isAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.status(200).json({ 
        success: true, 
        data: submissions 
      });
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching contact submissions' 
      });
    }
  });
  
  // Get all blog posts (including unpublished) - Admin only
  app.get('/api/admin/blog', isAdmin, async (req: AuthRequest, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const posts = await storage.getBlogPosts(limit, offset, false);
      res.status(200).json({ 
        success: true, 
        data: posts 
      });
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while fetching blog posts' 
      });
    }
  });
  
  // Create a new blog post - Admin only
  app.post('/api/admin/blog', isAdmin, async (req: AuthRequest, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost({
        ...postData,
        authorId: req.user.id
      });
      res.status(201).json({ 
        success: true, 
        message: 'Blog post created successfully',
        data: post 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        });
      } else {
        console.error('Error creating blog post:', error);
        res.status(500).json({ 
          success: false, 
          message: 'An error occurred while creating the blog post' 
        });
      }
    }
  });
  
  // Update a blog post - Admin only
  app.put('/api/admin/blog/:id', isAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const blogId = parseInt(id);
      
      // Get current post to check if it exists
      const existingPost = await storage.getBlogPostById(blogId);
      if (!existingPost) {
        return res.status(404).json({ 
          success: false, 
          message: 'Blog post not found' 
        });
      }
      
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(blogId, postData);
      
      res.status(200).json({ 
        success: true, 
        message: 'Blog post updated successfully',
        data: updatedPost 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        });
      } else {
        console.error('Error updating blog post:', error);
        res.status(500).json({ 
          success: false, 
          message: 'An error occurred while updating the blog post' 
        });
      }
    }
  });
  
  // Delete a blog post - Admin only
  app.delete('/api/admin/blog/:id', isAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const blogId = parseInt(id);
      
      const success = await storage.deleteBlogPost(blogId);
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Blog post not found' 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Blog post deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while deleting the blog post' 
      });
    }
  });
  
  // Manage blog categories - Admin only
  app.post('/api/admin/category', isAdmin, async (req: AuthRequest, res) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(categoryData);
      res.status(201).json({ 
        success: true, 
        message: 'Category created successfully',
        data: category 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        });
      } else {
        console.error('Error creating category:', error);
        res.status(500).json({ 
          success: false, 
          message: 'An error occurred while creating the category' 
        });
      }
    }
  });
  
  // Add category to post - Admin only
  app.post('/api/admin/blog/:blogId/category/:categoryId', isAdmin, async (req: AuthRequest, res) => {
    try {
      const { blogId, categoryId } = req.params;
      
      // Check if blog post exists
      const post = await storage.getBlogPostById(parseInt(blogId));
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: 'Blog post not found' 
        });
      }
      
      // Check if category exists
      const category = await storage.getBlogCategoryById(parseInt(categoryId));
      if (!category) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
      }
      
      await storage.addCategoryToBlogPost(parseInt(blogId), parseInt(categoryId));
      
      res.status(200).json({ 
        success: true, 
        message: 'Category added to blog post successfully' 
      });
    } catch (error) {
      console.error('Error adding category to blog post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while adding the category to the blog post' 
      });
    }
  });
  
  // Remove category from post - Admin only
  app.delete('/api/admin/blog/:blogId/category/:categoryId', isAdmin, async (req: AuthRequest, res) => {
    try {
      const { blogId, categoryId } = req.params;
      
      await storage.removeCategoryFromBlogPost(parseInt(blogId), parseInt(categoryId));
      
      res.status(200).json({ 
        success: true, 
        message: 'Category removed from blog post successfully' 
      });
    } catch (error) {
      console.error('Error removing category from blog post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while removing the category from the blog post' 
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
