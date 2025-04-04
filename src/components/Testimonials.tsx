"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "After my Uber accident, I needed money for medical bills. Claim Connectors got me a settlement in just 3 weeks! The process was incredibly fast.",
    name: "Alex G.",
    role: "Uber Passenger",
    location: "Dallas, TX",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    quote: "I was worried about legal fees, but with their No Win, No Fee guarantee, I didn't pay a penny until my case settled. I got $25,000 more than I expected!",
    name: "Jessica M.",
    role: "Lyft Passenger",
    location: "Houston, TX",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    quote: "As a driver, I thought insurance would handle everything. I was wrong. Claim Connectors found additional coverage that tripled my settlement.",
    name: "Michael T.",
    role: "Rideshare Driver",
    location: "Austin, TX",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real people who got the compensation they deserved.
          </p>
        </motion.div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <Image 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name} 
                        className="object-cover"
                        width={96}
                        height={96}
                        unoptimized={true}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-primary-600 mb-2">
                      <svg className="w-8 h-8 inline-block" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-xl md:text-2xl font-heading mb-6">
                      {testimonials[currentIndex].quote}
                    </p>
                    <div className="font-medium text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-gray-600">{testimonials[currentIndex].role} • {testimonials[currentIndex].location}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons - optimize by using transform */}
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:translate-x-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-600 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-600 focus:outline-none"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots - Replace color transitions with transform and opacity for better performance */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="relative p-2 focus:outline-none"
                style={{ width: '36px', height: '36px' }}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span 
                  className={`absolute inset-0 m-auto w-3 h-3 rounded-full bg-gray-300`}
                  style={{ transform: 'scale(1.0)' }}
                ></span>
                {index === currentIndex && (
                  <motion.span
                    className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-primary-600"
                    initial={{ transform: 'scale(0)' }}
                    animate={{ transform: 'scale(1)' }}
                    transition={{ duration: 0.2 }}
                  ></motion.span>
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-primary-50 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg mb-4 font-medium">Join thousands of satisfied clients who received compensation</p>
            <p className="text-sm mb-6 text-gray-600">Free evaluation in 24 hours or less • 100% Confidential • No upfront costs</p>
            <Link href="/claim" className="btn-primary inline-block text-lg px-8 py-3 font-semibold">
              Check My Eligibility Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 