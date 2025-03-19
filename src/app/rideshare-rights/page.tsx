"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { trackEvent, events } from '@/utils/metaPixel';
import { trackEventWithRedundancy } from '@/utils/metaConversionsApi';

export default function RideshareRights() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Track the download event with both Meta Pixel and Conversions API
    trackEventWithRedundancy(
      events.DOWNLOAD_GUIDE, 
      {}, // No user data for this event
      {
        content_name: 'Rideshare Accident Guide',
        content_category: 'Legal Resources',
        value: 0,
        currency: 'USD'
      }
    );
    
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      // In a real implementation, this would trigger the actual PDF download
      // For now, we'll just alert the user
      alert('Your guide has been downloaded!');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 font-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Know Your Rights After a Rideshare Accident
              </motion.h1>
              <motion.p 
                className="text-xl mb-8 text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Follow these critical steps to protect your claim & maximize your compensation.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="btn-primary flex items-center justify-center gap-2"
                  onClick={handleDownload}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Free Guide
                    </>
                  )}
                </motion.button>
                <motion.a
                  href="tel:+18339986906"
                  className="btn-secondary flex items-center justify-center gap-2 sm:hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.986.836l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now for Free Legal Help
                </motion.a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                className="relative w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/images/shutterstock_2428486561-desktop.jpg"
                  alt="Rideshare accident scene"
                  width={500}
                  height={350}
                  className="rounded-lg shadow-xl"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-gray-900">What To Do After a Rideshare Accident</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these critical steps to protect your rights and strengthen your claim after being involved in a rideshare accident.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">Call 911 if Anyone is Injured</h3>
              </div>
              <p className="text-gray-600">
                Your health and safety come first. If you or anyone else is injured, call emergency services immediately. Medical documentation is also crucial for your claim.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900">Do NOT Sign Any Paperwork</h3>
              </div>
              <p className="text-gray-600">
                Insurance companies may try to get you to sign documents that limit your rights. Never sign anything without consulting with a lawyer first.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900">Report the Accident in Your App</h3>
              </div>
              <p className="text-gray-600">
                Report the accident through your Uber or Lyft app immediately. This creates an official record of the incident within the rideshare company's system.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900">Request a Police Report</h3>
              </div>
              <p className="text-gray-600">
                A police report provides an official account of the accident and is essential for your claim. Make sure to get the report number for your records.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  5
                </div>
                <h3 className="text-xl font-bold text-gray-900">Take Photos & Gather Evidence</h3>
              </div>
              <p className="text-gray-600">
                Document everything: vehicle damage, injuries, the accident scene, road conditions, and any relevant traffic signs or signals.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  6
                </div>
                <h3 className="text-xl font-bold text-gray-900">Seek Medical Attention ASAP</h3>
              </div>
              <p className="text-gray-600">
                Even if you feel fine, some injuries may not be immediately apparent. Getting medical attention within 48 hours is crucial for your health and claim.
              </p>
            </div>

            {/* Step 7 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow col-span-1 md:col-span-2 lg:col-span-3">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  7
                </div>
                <h3 className="text-xl font-bold text-gray-900">Speak to a Lawyer Before Talking to Insurance</h3>
              </div>
              <p className="text-gray-600 max-w-3xl">
                Insurance companies aim to minimize payouts. Before giving any statements, consult with a rideshare accident attorney who can protect your interests and help you get the compensation you deserve.
              </p>
              <div className="mt-6">
                <Link href="/claim" className="btn-primary inline-flex items-center">
                  Start Your Free Claim Evaluation
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Guide Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4 font-heading text-gray-900">
                  Download Your Free Rideshare Accident Guide (PDF)
                </h2>
                <p className="text-gray-600 mb-6">
                  Our comprehensive guide provides detailed information about your rights, insurance coverage, and steps to take after a rideshare accident. Download it now and be prepared.
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete checklist of actions to take after an accident</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Understanding rideshare insurance coverage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Common mistakes to avoid when filing a claim</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>How to maximize your compensation</span>
                  </li>
                </ul>
                <button
                  className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Now
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Contact info included: RideshareRights.com & 833-998-6906
                </p>
              </div>
              <div className="md:w-1/2 bg-primary-600 p-8 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="bg-white rounded-lg shadow-lg p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-primary-600">Rideshare Accident Guide</h3>
                      <div className="bg-primary-600 text-white text-xs font-bold py-1 px-2 rounded">FREE</div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 mb-2 font-medium">Inside this guide:</p>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-600 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>7 Critical Steps After an Accident</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-600 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Insurance Coverage Explained</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-600 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Compensation Calculation Guide</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-600 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Common Mistakes to Avoid</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <button
                        className="btn-secondary w-full text-sm"
                        onClick={handleDownload}
                      >
                        Get Your Free Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to Start Your Claim?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Our team of rideshare accident specialists is ready to help you get the compensation you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/claim" className="btn-primary flex items-center justify-center gap-2">
              Start Your Free Claim Evaluation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a href="tel:+18339986906" className="btn-secondary flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.986.836l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (833) 998-6906
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 