
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Phone, MapPin, Calendar, ExternalLink, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("COtKbmSCzdpiCZDwB"); // Your EmailJS public key
    
    // Test EmailJS connection
    console.log('EmailJS initialized with public key: COtKbmSCzdpiCZDwB');
    console.log('Service ID: service_af5vxka');
    console.log('Template ID: template_1csll1o');
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      console.log('=== CONTACT FORM DEBUG ===');
      console.log('Form submitted with values:', values);

      // First, try to use the API endpoint
      try {
        console.log('🔄 Trying API endpoint first...');
        const apiResponse = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: values.name,
            userEmail: values.email,
            meetingDetails: values.message || 'No message provided',
          }),
        });

        if (apiResponse.ok) {
          console.log('✅ API endpoint successful, now trying EmailJS...');
        } else {
          console.log('⚠️ API endpoint failed, proceeding with EmailJS...');
        }
      } catch (apiError) {
        console.log('⚠️ API endpoint error, proceeding with EmailJS...', apiError);
      }

      // Send email using EmailJS as fallback
      const templateParams = {
        name: values.name,
        email: values.email,
        message: values.message || 'No message provided',
        time: new Date().toLocaleString(),
      };

      console.log('EmailJS template params:', templateParams);
      console.log('EmailJS Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_af5vxka');
      console.log('EmailJS Template ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_1csll1o');
      console.log('EmailJS Public Key:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'COtKbmSCzdpiCZDwB');

      console.log('Calling EmailJS.send()...');
      
      const emailResult = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_af5vxka', // Your EmailJS service ID
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_1csll1o', // Your EmailJS template ID
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'COtKbmSCzdpiCZDwB' // Your EmailJS public key
      );

      console.log('EmailJS result received:', emailResult);
      console.log('EmailJS result.text:', emailResult.text);
      console.log('EmailJS result.status:', emailResult.status);

      // EmailJS returns a different response structure
      if (emailResult.text === 'OK') {
        console.log('✅ Email sent successfully!');
        toast({
          title: 'Message Sent Successfully! 🚀',
          description: 'Thank you for your message! We\'ll get back to you soon.',
        });
        form.reset();
      } else {
        console.log('❌ Email sending failed:', emailResult.text);
        throw new Error(`Email sending failed: ${emailResult.text}`);
      }

    } catch (error) {
      console.error('❌ Contact form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: `Error: ${errorMessage}. Please try again later.`,
      });
    }
  }

  return (
    <section id="contact" className="w-full min-h-[80vh] py-12 md:py-16 lg:py-20 flex items-center justify-center bg-black relative overflow-hidden" style={{
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 80%)'
    }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container flex items-center justify-center px-4 md:px-6 relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* Unique Header */}
          <div className="text-center mb-12 space-y-4">
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Let's Connect
            </p>
          </div>

          {/* Contact Form Only */}
          <div className="w-full max-w-md mx-auto">
            <div className="glassmorphism rounded-2xl p-8 space-y-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get in Touch</h3>
                <p className="text-zinc-400 text-sm">We'd love to hear from you</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <FormLabel className="absolute left-4 top-3 text-xs text-zinc-400 transition-all duration-200 group-focus-within:text-white">
                                Name
                              </FormLabel>
                              <Input 
                                {...field} 
                                className="bg-zinc-900/60 border-zinc-700 focus:ring-gray-500/50 focus:border-gray-500/50 text-white rounded-xl pt-8 h-14 transition-all duration-200 hover:border-zinc-600 text-sm" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="pl-3 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <FormLabel className="absolute left-4 top-3 text-xs text-zinc-400 transition-all duration-200 group-focus-within:text-white">
                                Email
                              </FormLabel>
                              <Input 
                                {...field} 
                                className="bg-zinc-900/60 border-zinc-700 focus:ring-gray-500/50 focus:ring-gray-500/50 focus:border-gray-500/50 text-white rounded-xl pt-8 h-14 transition-all duration-200 hover:border-zinc-600 text-sm" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="pl-3 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative group">
                            <FormLabel className="absolute left-4 top-3 text-xs text-zinc-400 transition-all duration-200 group-focus-within:text-white">
                              Message
                            </FormLabel>
                            <Textarea 
                              className="min-h-[120px] bg-zinc-900/60 border-zinc-700 focus:ring-gray-500/50 focus:border-gray-500/50 text-white rounded-xl pt-8 transition-all duration-200 hover:border-zinc-600 resize-none text-sm" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="pl-3 text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-white transition-all duration-200 group text-sm border border-gray-600" 
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="text-center pt-4 border-t border-gray-700/30">
                <p className="text-xs text-zinc-400">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
