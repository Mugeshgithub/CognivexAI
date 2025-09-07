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
import { Send, MessageCircle, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

// This will be moved inside the component to use translations

export default function ContactTestimonials() {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Aniefiok ASUQUE",
      role: "Producer/Composer/Pianist",
      company: "Paris, France",
      content: `Advanced Portfolio with Admin Control\n\nThe website is impressive and I really love the work. The admin control system allows me to easily update and delete my live performance information and collaborations with other artists. The attention to detail and the way everything flows together is amazing. You've created something truly special that stands out from the crowd.`,
      rating: 5,
      avatar: "🎹",
      workLink: "https://aniefoik.vercel.app/"
    },
    {
      id: 2,
      name: "Narmadha",
      role: "Software Tester",
      company: "India",
      content: `Full-Stack AI Web Application\n\nCognivexAI built a great web app that changed how I create stories. It's intuitive and the AI integration works well. They handled everything from the user interface to the backend nicely. Now I can focus on my creativity instead of struggling with technical stuff.`,
      rating: 5,
      avatar: "✨",
      workLink: "https://studio--story-spark-a2jdn.us-central1.hosted.app/"
    },
    {
      id: 3,
      name: "Devika Sinha",
      role: "Fine Art Photographer",
      company: "Paris, France",
      content: `Portfolio with Shop Prints\n\nThe website looks absolutely stunning and I'm really happy with everything. My parents also saw the new version of the website yesterday and they loved it. The design perfectly captures my artistic vision and the user experience is seamless. Thank you so much for the excellent work!`,
      rating: 5,
      avatar: "🎨",
      workLink: "https://www.devikasinha.com/"
    },
    {
      id: 4,
      name: "Stefff",
      role: "Photographer/Director",
      company: "Paris, France",
      content: `Portfolio with Shop Prints\n\nI asked Mugesh to build my website and he did it perfectly. Always great response time and always willing to make things work. Great experience working with Mugesh.`,
      rating: 5,
      avatar: "📸",
      workLink: "https://www.steffff.com/"
    },
    {
      id: 5,
      name: "Dimitra Polic",
      role: "Photographer",
      company: "Paris, France",
      content: `Creative Portfolio Website\n\nThe website looks really nice. The design perfectly captures the essence of my work and the user experience is smooth and intuitive. Great job on bringing my portfolio to life!`,
      rating: 5,
      avatar: "📷",
      workLink: "https://www.dimitrapolic.com/"
    },
    {
      id: 6,
      name: "Ashwith S Pai",
      role: "Documentary Photographer",
      company: "Paris, France",
      content: `Creative Portfolio Website\n\nGood work! The website perfectly showcases my motorsport photography with excellent gallery functionality and smooth user experience. Great job on the creative portfolio!`,
      rating: 5,
      avatar: "🏁",
      workLink: "https://www.ashwithspai.com/"
    }
  ];
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("COtKbmSCzdpiCZDwB");
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
      const templateParams = {
        name: values.name,
        email: values.email,
        message: values.message || 'No message provided',
        time: new Date().toLocaleString(),
      };

      const emailResult = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_af5vxka',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_1csll1o',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'COtKbmSCzdpiCZDwB'
      );

      if (emailResult.text === 'OK') {
        toast({
          title: 'Message sent successfully!',
          description: 'Thank you for your message. We will get back to you soon.',
        });
        form.reset();
      } else {
        throw new Error(`Email sending failed: ${emailResult.text}`);
      }

    } catch (error) {
      console.error('Contact form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: `Error: ${errorMessage}. Please try again or contact us directly.`,
      });
    }
  }

  return (
    <section key="contact" id="contact" className="w-full py-16 bg-black relative overflow-hidden">
      {/* Background - Pure black */}
      <div className="absolute inset-0 bg-black"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Side by Side Layout - Perfect parallel alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 flex justify-center lg:justify-start"
          >
            <div className="glassmorphism rounded-2xl p-6 space-y-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 w-full max-w-md">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full mb-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Let's Connect</h3>
                <p className="text-zinc-400 text-xs">We'd love to hear from you</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <FormLabel className="absolute left-3 top-2 text-xs text-zinc-400 transition-all duration-200 group-focus-within:text-white">
                                Name
                              </FormLabel>
                              <Input 
                                {...field} 
                                className="bg-zinc-900/60 border-zinc-700 focus:ring-gray-500/50 focus:border-gray-500/50 text-white rounded-lg pt-6 h-12 transition-all duration-200 hover:border-zinc-600 text-sm" 
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
                              <FormLabel className="absolute left-3 top-2 text-xs text-zinc-400 transition-all duration-200 group-focus-within:text-white">
                                Email
                              </FormLabel>
                              <Input 
                                {...field} 
                                className="bg-zinc-900/60 border-zinc-700 focus:ring-gray-500/50 focus:border-gray-500/50 text-white rounded-lg pt-6 h-12 transition-all duration-200 hover:border-zinc-600 text-sm" 
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
                            <FormLabel className="absolute left-3 top-2 text-xs text-zinc-400 transition-all duration-200 group-focus-within:text-white">
                              Message
                            </FormLabel>
                            <Textarea 
                              className="min-h-[100px] bg-zinc-900/60 border-zinc-700 focus:ring-gray-500/50 focus:border-gray-500/50 text-white rounded-lg pt-8 transition-all duration-200 hover:border-zinc-600 resize-none text-sm" 
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
                    className="w-full h-12 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all duration-200 group text-sm border border-gray-600" 
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>

          {/* Right Side - Testimonials (Moved 3 steps down) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-3 lg:order-2 flex justify-center lg:justify-end lg:pt-12"
          >
            <div className="relative w-full max-w-md">
              {/* Testimonials Heading */}
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  What Our Clients Say
                </h3>
                <p className="text-sm text-gray-300">
                  Real feedback from amazing people
                </p>
              </div>
              {/* Navigation Arrows - Positioned outside the box */}
              <button
                onClick={prevSlide}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Testimonials Carousel */}
              <div className="overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative group"
                      >
                        {/* Card - Perfectly aligned with contact form */}
                        <div className="relative p-6 min-h-[280px] flex flex-col">
                          {/* Author Info - Moved to top */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full overflow-hidden">
                              {testimonial.id === 1 ? (
                                <img 
                                  src="/My Pics 6.jpeg" 
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : testimonial.id === 2 ? (
                                <img 
                                  src="/WhatsApp Image 2025-09-07 at 03.38.51.jpeg" 
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : testimonial.id === 5 ? (
                                <img 
                                  src="/Remove background project (3)-min.png" 
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : testimonial.id === 6 ? (
                                <img 
                                  src="/aswith.jpeg" 
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-2xl">{testimonial.avatar}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">
                                {testimonial.name}
                              </h4>
                              <p className="text-orange-400 font-medium text-xs">
                                {testimonial.role}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {testimonial.company}
                              </p>
                              {testimonial.workLink && (
                                <a 
                                  href={testimonial.workLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-orange-300 hover:text-orange-200 text-xs mt-1 transition-colors duration-200"
                                >
                                  View Work ↗
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Project Type */}
                          <div className="mb-4">
                            <h4 className="text-orange-400 font-semibold text-sm">
                              {testimonial.content.split('\n\n')[0]}
                            </h4>
                          </div>

                          {/* Review Content */}
                          <p className="text-gray-200 text-sm leading-relaxed mb-4 flex-grow">
                            "{testimonial.content.split('\n\n')[1]}"
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-orange-500 w-6' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

