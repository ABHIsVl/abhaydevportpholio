import { 
  users, contactSubmissions, blogPosts, blogCategories, blogPostCategories,
  type User, type InsertUser, 
  type InsertContact, type ContactSubmission,
  type BlogPost, type InsertBlogPost,
  type BlogCategory, type InsertBlogCategory
} from "@shared/schema";
import { db } from './db';
import { eq, desc, and, inArray, sql } from 'drizzle-orm';

// Update the storage interface with CRUD methods for contact submissions and blog
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact submission methods
  createContactSubmission(submission: InsertContact): Promise<ContactSubmission>;
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;

  // Blog methods
  getBlogPosts(limit?: number, offset?: number, publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Blog category methods
  getBlogCategories(): Promise<BlogCategory[]>;
  getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined>;
  getBlogCategoryById(id: number): Promise<BlogCategory | undefined>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  updateBlogCategory(id: number, category: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined>;
  deleteBlogCategory(id: number): Promise<boolean>;
  
  // Blog post category methods
  addCategoryToBlogPost(postId: number, categoryId: number): Promise<void>;
  removeCategoryFromBlogPost(postId: number, categoryId: number): Promise<void>;
  getBlogPostCategories(postId: number): Promise<BlogCategory[]>;
  getBlogPostsByCategory(categoryId: number, limit?: number, offset?: number): Promise<BlogPost[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact submission methods
  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(insertContact).returning();
    return submission;
  }

  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  // Blog post methods
  async getBlogPosts(limit: number = 10, offset: number = 0, publishedOnly: boolean = true): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (publishedOnly) {
      query = query.where(eq(blogPosts.published, true));
    }
    
    return query
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    // First delete any categories associations
    await db.delete(blogPostCategories).where(eq(blogPostCategories.postId, id));
    
    // Then delete the post
    const [deletedPost] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return !!deletedPost;
  }
  
  // Blog category methods
  async getBlogCategories(): Promise<BlogCategory[]> {
    return db.select().from(blogCategories).orderBy(blogCategories.name);
  }
  
  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.slug, slug));
    return category;
  }
  
  async getBlogCategoryById(id: number): Promise<BlogCategory | undefined> {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.id, id));
    return category;
  }
  
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [newCategory] = await db.insert(blogCategories).values(category).returning();
    return newCategory;
  }
  
  async updateBlogCategory(id: number, category: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined> {
    const [updatedCategory] = await db
      .update(blogCategories)
      .set(category)
      .where(eq(blogCategories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteBlogCategory(id: number): Promise<boolean> {
    // First delete any post associations
    await db.delete(blogPostCategories).where(eq(blogPostCategories.categoryId, id));
    
    // Then delete the category
    const [deletedCategory] = await db.delete(blogCategories).where(eq(blogCategories.id, id)).returning();
    return !!deletedCategory;
  }
  
  // Blog post category methods
  async addCategoryToBlogPost(postId: number, categoryId: number): Promise<void> {
    // Check if association already exists
    const existing = await db
      .select()
      .from(blogPostCategories)
      .where(and(
        eq(blogPostCategories.postId, postId),
        eq(blogPostCategories.categoryId, categoryId)
      ));
    
    if (existing.length === 0) {
      await db.insert(blogPostCategories).values({ postId, categoryId });
    }
  }
  
  async removeCategoryFromBlogPost(postId: number, categoryId: number): Promise<void> {
    await db
      .delete(blogPostCategories)
      .where(and(
        eq(blogPostCategories.postId, postId),
        eq(blogPostCategories.categoryId, categoryId)
      ));
  }
  
  async getBlogPostCategories(postId: number): Promise<BlogCategory[]> {
    const result = await db
      .select({
        category: blogCategories
      })
      .from(blogPostCategories)
      .innerJoin(blogCategories, eq(blogPostCategories.categoryId, blogCategories.id))
      .where(eq(blogPostCategories.postId, postId));
    
    return result.map(r => r.category);
  }
  
  async getBlogPostsByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<BlogPost[]> {
    const postIds = await db
      .select({ postId: blogPostCategories.postId })
      .from(blogPostCategories)
      .where(eq(blogPostCategories.categoryId, categoryId));
    
    if (postIds.length === 0) {
      return [];
    }
    
    return db
      .select()
      .from(blogPosts)
      .where(and(
        inArray(blogPosts.id, postIds.map(p => p.postId)),
        eq(blogPosts.published, true)
      ))
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }
}

export const storage = new DatabaseStorage();
