"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const initialFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' })
});

type InitialFormData = z.infer<typeof initialFormSchema>;

export default function Hero() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<InitialFormData>({
    resolver: zodResolver(initialFormSchema),
    defaultValues: {
      firstName: '',
      phone: ''
    },
  });

  const onSubmit = async (data: InitialFormData) => {
    setIsSubmitting(true);
    try {
      localStorage.setItem('contactFormData', JSON.stringify(data));
      router.push('/claim');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover mix-blend-multiply"
          src="/hero-background.jpg"
          alt="Rideshare accident support"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Rideshare Accident?<br />
              Get Help Now
            </h1>
            <p className="mt-6 max-w-xl text-xl text-gray-100">
              Were you involved in an Uber or Lyft accident? Get the compensation you deserve. Our experts are ready to help you with your claim.
            </p>
          </div>

          <div className="mt-8 md:mt-0 md:w-1/2 md:pl-8">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Submit Your Claim
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your first name"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="(555) 555-5555"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="text-center text-sm">
                  <p className="text-gray-500">
                    Free Consultation • No Obligation • 24/7 Support
                  </p>
                  <p className="mt-2 text-gray-500">
                    By submitting, you agree to our{' '}
                    <a href="/terms" className="text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </a>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
                    isSubmitting
                      ? 'bg-primary-500 cursor-wait'
                      : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 