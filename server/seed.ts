import { db } from './db';
import { blogCategories, blogPosts, users } from '../shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function seedAdminUser() {
  // Check if admin user already exists
  const adminUser = await db.select().from(users).where(eq(users.username, 'abhaydev@2026.com'));
  
  if (adminUser.length === 0) {
    // Create admin user with the provided credentials
    await db.insert(users).values({
      username: 'abhaydev@2026.com',
      password: await hashPassword('Abhay@0987'),
      email: 'abhaydev@2026.com',
      fullName: 'Abhay Dev',
      isAdmin: true,
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
}

async function seedBlogCategories() {
  const categories = [
    { name: 'Design', slug: 'design' },
    { name: 'Development', slug: 'development' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Web3', slug: 'web3' },
    { name: 'UX/UI', slug: 'ux-ui' }
  ];

  for (const category of categories) {
    const existingCategory = await db.select().from(blogCategories).where(eq(blogCategories.slug, category.slug));
    
    if (existingCategory.length === 0) {
      await db.insert(blogCategories).values(category);
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category ${category.name} already exists`);
    }
  }
}

async function seedSampleBlogPosts() {
  // Get admin user
  const adminUser = await db.select().from(users).where(eq(users.username, 'abhaydev@2026.com'));
  
  if (adminUser.length === 0) {
    console.log('Admin user not found, cannot create sample blog posts');
    return;
  }
  
  const adminId = adminUser[0].id;
  
  const samplePosts = [
    {
      title: 'The Future of Web Design in 2026',
      slug: 'future-web-design-2026',
      summary: 'Exploring upcoming trends in web design that will shape the digital landscape in the coming years.',
      content: `<h2>The Evolution of Web Design</h2>
<p>Web design has come a long way since the early days of the internet. From simple static pages to dynamic, interactive experiences, the journey has been remarkable.</p>

<h2>Current Trends</h2>
<p>Today, we're seeing a shift towards minimalist designs, dark mode interfaces, and immersive 3D elements. These trends are likely to continue evolving.</p>

<h2>What's Coming Next</h2>
<p>As we look ahead to 2026, we can expect to see more AI-driven design tools, virtual reality integration, and designs that adapt to user behavior in real-time.</p>

<h2>Preparing for the Future</h2>
<p>Designers should focus on learning new technologies while maintaining a strong foundation in design principles. The tools may change, but good design fundamentals remain constant.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      authorId: adminId,
      published: true
    },
    {
      title: 'Mastering React: Tips and Tricks for Modern Web Development',
      slug: 'mastering-react-tips-tricks',
      summary: 'Advanced techniques and best practices for building scalable React applications.',
      content: `<h2>Why React Continues to Dominate</h2>
<p>React has maintained its popularity because of its component-based architecture, virtual DOM, and the strong community support it enjoys.</p>

<h2>Performance Optimization</h2>
<p>Learn how to implement useMemo, useCallback, and React.memo effectively to prevent unnecessary re-renders and improve your application's performance.</p>

<h2>State Management Evolution</h2>
<p>From Redux to Context API to React Query, the ecosystem continues to evolve. We'll explore when to use each solution based on your project's needs.</p>

<h2>Testing Strategies</h2>
<p>Implementing a robust testing strategy with Jest and React Testing Library to ensure your components work as expected across different scenarios.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      authorId: adminId,
      published: true
    },
    {
      title: 'Building Effective Social Media Strategies for 2026',
      slug: 'social-media-strategies-2026',
      summary: 'How to create engaging social media campaigns that drive results in today\'s digital landscape.',
      content: `<h2>The Changing Social Media Landscape</h2>
<p>As platforms evolve and user behaviors shift, effective social media strategies need to adapt to stay relevant and impactful.</p>

<h2>Content that Resonates</h2>
<p>Creating meaningful connections through authentic storytelling and value-driven content that speaks to your audience's needs and aspirations.</p>

<h2>Platform-Specific Approaches</h2>
<p>Each social platform has its own ecosystem and content preferences. We'll explore how to tailor your approach for maximum engagement on each channel.</p>

<h2>Measuring Impact</h2>
<p>Moving beyond vanity metrics to track meaningful KPIs that align with your business objectives and demonstrate real ROI from social media efforts.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
      authorId: adminId,
      published: true
    }
  ];
  
  for (const post of samplePosts) {
    const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.slug, post.slug));
    
    if (existingPost.length === 0) {
      await db.insert(blogPosts).values(post);
      console.log(`Created blog post: ${post.title}`);
    } else {
      console.log(`Blog post ${post.title} already exists`);
    }
  }
}

export async function seed() {
  try {
    console.log('Starting database seeding...');
    await seedAdminUser();
    await seedBlogCategories();
    await seedSampleBlogPosts();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Export the seed function without auto-running it
// We'll call it from routes.ts instead