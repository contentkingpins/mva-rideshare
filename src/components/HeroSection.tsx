"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define the form schema using Zod
const contactSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function HeroSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  
  // Check viewport size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Store form data in localStorage to use in the claim form
    localStorage.setItem('contactFormData', JSON.stringify(data));
    
    // Redirect to claim page
    router.push('/claim');
  };

  return (
    <section className="relative overflow-hidden">
      {/* Hero Container */}
      <div className="relative min-h-[90vh] md:min-h-[600px] lg:min-h-[650px] w-full">
        {/* Background image - optimized for all devices */}
        <div className="absolute inset-0 z-0">
          <picture>
            {/* Mobile-optimized vertical crop image - smaller file */}
            <source 
              media="(max-width: 767px)" 
              srcSet="/images/shutterstock_2428486561-mobile.webp"
              type="image/webp"
            />
            {/* Tablet-optimized image - medium size */}
            <source 
              media="(max-width: 1023px)" 
              srcSet="/images/shutterstock_2428486561-tablet.webp"
              type="image/webp"
            />
            {/* Desktop WebP version - modern browsers */}
            <source
              media="(min-width: 1024px)"
              srcSet="/images/shutterstock_2428486561-desktop.webp"
              type="image/webp"
            />
            {/* Fallback image for all devices */}
            <Image
              src="/images/shutterstock_2428486561-desktop.jpg"
              alt="Rideshare accident scene"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              style={{ 
                objectFit: 'cover', 
                objectPosition: isMobile ? '50% 40%' : 'center top',
                maxHeight: '100vh',
                minHeight: '100%',
                transform: 'none'
              }}
              className="brightness-100 contrast-105"
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAGAAgDAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAME/8QAFAEBAAAAAAAAAAAAAAAAAAAABP/aAAwDAQACEAMQAAABxdFP/8QAFhABAQEAAAAAAAAAAAAAAAAAAQAC/9oACAEBAAEFArOv/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFhAAAwAAAAAAAAAAAAAAAAAAACEx/9oACAEBAAE/IVDP/9oADAMBAAIAAwAAABCj/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPxB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFhABAQEAAAAAAAAAAAAAAAAAAREA/9oACAEBAAE/EEiCm//Z"
            />
          </picture>
          
          {/* Gradient overlay - subtle professional gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 via-primary-800/45 to-primary-700/40 md:from-primary-900/30 md:via-primary-800/25 md:to-primary-700/20"></div>
        </div>

        {/* Content Container */}
        <div className="container relative z-10 h-full px-5 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center h-full pt-16 md:pt-16 pb-36 md:pb-24 lg:py-16 gap-6 md:gap-8 lg:gap-12">
            {/* Text Content - Adaptive for different screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 text-white lg:pr-6 pt-0 md:pt-8"
            >
              <div className="max-w-lg mx-auto md:mx-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 md:mb-5 drop-shadow-sm">
                  Injured in a Rideshare Accident? Make Sure Your Rights Are Protected!
                </h1>
                <p className="text-lg md:text-lg lg:text-xl text-white text-opacity-95 leading-relaxed drop-shadow-sm mb-8">
                  Submit your accident into our claim calculator—in just a few seconds, we can determine if you qualify for legal representation.
                </p>
                
                {/* Professional feature list */}
                <div className="hidden md:grid md:grid-cols-3 gap-4 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-500/50 p-2 rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="font-medium">1000+ Claims</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-500/50 p-2 rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Millions Recovered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-500/50 p-2 rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="font-medium">No Win, No Fee</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Hide contact form on mobile - we'll show it on click with the link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              id="contact-form"
              className="hidden lg:block lg:w-1/2 lg:mt-0 px-2 md:px-0"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 md:p-6 lg:p-8 border border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Start Your Claim Now</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="label">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="John"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="label">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Doe"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="label">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(555) 555-5555"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="label">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full text-lg py-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Submit Your Claim'
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting, you agree to our{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </Link>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile Features List */}
      <div className="lg:hidden w-full fixed bottom-24 z-40 bg-white/90 backdrop-blur-md pt-3 pb-4 px-4 border-t border-gray-200">
        <div className="grid grid-cols-3 text-center w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-primary-500 p-2 rounded-full mb-1">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-900">1000+ Claims</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary-500 p-2 rounded-full mb-1">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-900">Millions Recovered</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary-500 p-2 rounded-full mb-1">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-900">No Win, No Fee</span>
          </div>
        </div>
      </div>
      
      {/* Full width CTA for mobile */}
      <div className="lg:hidden fixed w-full bottom-16 z-50 px-4">
        <Link 
          href="/claim"
          className="btn-primary w-full block text-xl py-4 text-center font-semibold shadow-xl rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            router.push('/claim');
          }}
        >
          Start Your Claim Now
        </Link>
      </div>
      
      {/* Mobile Call Button (Fixed at Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary-800 p-3 shadow-lg z-50">
        <a 
          href="tel:+18339986906" 
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.986.836l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call for Free Case Review
        </a>
      </div>
    </section>
  );
} 