"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "Claim Connectors got me my settlement faster than I expected! Highly recommend!",
    author: "John D.",
    role: "Uber Passenger",
    image: "/images/testimonial-1.jpg",
  },
  {
    id: 2,
    quote: "I was lost after my accident, but their team made everything easy.",
    author: "Sarah L.",
    role: "Lyft Passenger",
    image: "/images/testimonial-2.jpg",
  },
  {
    id: 3,
    quote: "The process was simple and they kept me updated every step of the way.",
    author: "Michael R.",
    role: "Rideshare Driver",
    image: "/images/testimonial-3.jpg",
  },
  {
    id: 4,
    quote: "After my accident, I didn't know where to turn. Claim Connectors handled everything!",
    author: "Jessica T.",
    role: "Uber Passenger",
    image: "/images/testimonial-4.jpg",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our satisfied clients who successfully received compensation for their rideshare accidents.
          </p>
        </div>
        
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Testimonial Carousel */}
          <div className="overflow-hidden relative h-80 md:h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-primary-50 rounded-xl p-8 md:p-10 h-full flex flex-col justify-center">
                  <div className="mb-6">
                    {/* Quote Icon */}
                    <svg className="w-10 h-10 text-primary-300 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-xl md:text-2xl text-gray-800 italic">
                      "{testimonials[currentIndex].quote}"
                    </p>
                  </div>
                  <div className="flex items-center mt-auto">
                    <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center mr-4">
                      <span className="text-primary-700 font-bold">
                        {testimonials[currentIndex].author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonials[currentIndex].author}</h4>
                      <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/claim" 
            className="btn-primary text-lg"
          >
            Start Your Free Claim Assessment
          </a>
        </div>
      </div>
    </section>
  );
} 