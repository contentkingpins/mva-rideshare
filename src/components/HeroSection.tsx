"use client";

import { useState } from 'react';
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
  const router = useRouter();
  
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
    <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-white">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Injured in a Rideshare Accident? Make Sure Your Rights Are Protected!
            </h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Submit your accident into our claim calculator—in just a few seconds, we can determine if you qualify for legal representation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="#contact-form"
                className="btn-primary text-lg"
              >
                Start Your Claim Now
              </Link>
              <a 
                href="tel:8885555555" 
                className="lg:hidden btn-outline border-white text-white hover:bg-white/10 text-lg"
              >
                Call Now for a Free Case Review
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>1000+ Successful Claims</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Millions Recovered</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>No Win, No Fee</span>
              </div>
            </div>

            {/* Mobile Image */}
            <div className="block md:hidden mt-8">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/shutterstock_2428486561.jpg"
                  alt="Rideshare accident scene"
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">Get the compensation you deserve</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Tablet Image - hidden on mobile and desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block lg:hidden"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/shutterstock_2428486561.jpg"
                alt="Rideshare accident scene"
                width={800}
                height={600}
                className="object-cover w-full h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-xl font-medium">Get the compensation you deserve after a rideshare accident</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form - hidden on mobile and tablet, shown on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id="contact-form"
            className="bg-white text-gray-900 rounded-lg shadow-xl p-6 md:p-8 mt-8 md:mt-0"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Start Your Claim Now</h2>
            
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
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Call Button (Fixed at Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary-800 p-4 shadow-lg z-50">
        <a 
          href="tel:8885555555" 
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now for a Free Case Review
        </a>
      </div>
    </section>
  );
} 