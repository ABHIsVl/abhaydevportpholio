import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { gsap } from 'gsap';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  service: z.string().min(1, { message: "Please select a service" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactPopupProps = {
  onClose: () => void;
};

export default function ContactPopup({ onClose }: ContactPopupProps) {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      service: "",
      message: ""
    },
  });

  // Animation for popup entry
  useEffect(() => {
    if (popupRef.current && formContentRef.current) {
      gsap.set(popupRef.current, { y: 50, opacity: 0 });
      gsap.to(popupRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });
      
      // Staggered form elements animation
      gsap.from(formContentRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power2.out'
      });
    }
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeWithAnimation();
    }
  };

  // Close with animation
  const closeWithAnimation = () => {
    if (popupRef.current) {
      gsap.to(popupRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await apiRequest('POST', '/api/contact', values);
      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I'll get back to you within 24 hours.",
        });
        // Close the popup after 3 seconds
        setTimeout(() => {
          closeWithAnimation();
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div 
        ref={popupRef} 
        className={`border border-border/40 ${theme === 'dark' ? 'bg-card' : 'bg-background'} rounded-xl w-full max-w-md p-8 z-10 relative shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          onClick={closeWithAnimation}
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div ref={formContentRef}>
          <h3 className="text-2xl font-outfit font-semibold mb-2">Let's Work Together</h3>
          <p className="text-muted-foreground mb-6">Fill out the form below and I'll get back to you within 24 hours.</p>
          
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-outfit font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">Thank you for reaching out. I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          className="rounded-md bg-background/50 border border-border focus-visible:ring-accent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          type="email" 
                          {...field} 
                          className="rounded-md bg-background/50 border border-border focus-visible:ring-accent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Needed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-md bg-background/50 border border-border focus-visible:ring-accent">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="social">Social Media Management</SelectItem>
                          <SelectItem value="content">Content Creation</SelectItem>
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="strategy">Digital Strategy</SelectItem>
                          <SelectItem value="influencer">Influencer Collaboration</SelectItem>
                          <SelectItem value="startup">Startup Acceleration</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell me about your project" 
                          {...field} 
                          className="rounded-md bg-background/50 border border-border focus-visible:ring-accent"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
