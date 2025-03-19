'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

// Metadata cannot be exported from client components
// export const metadata = {
//   title: 'Terms of Service | Claim Connectors',
//   description: 'Terms of Service for Claim Connectors - Understand our policies and your rights.',
// };

export default function TermsPage() {
  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>Welcome to Claim Connectors. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.</p>
            
            <h2>Our Services</h2>
            <p>Claim Connectors provides a platform to connect individuals involved in rideshare accidents with legal services. We are not a law firm and do not provide legal advice. Our service is designed to help you find appropriate legal representation for your specific situation.</p>
            
            <h2>Eligibility</h2>
            <p>You must be at least 18 years of age to use our services. By using our services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.</p>
            
            <h2>User Accounts</h2>
            <p>When you provide information through our forms, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of any login credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
            
            <h2>User Content</h2>
            <p>By submitting information through our website, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your content for the purpose of providing and improving our services.</p>
            
            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Claim Connectors shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.</p>
            
            <h2>Indemnification</h2>
            <p>You agree to indemnify and hold harmless Claim Connectors and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses arising from your use of our services or your violation of these Terms.</p>
            
            <h2>Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
            
            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting the new Terms on this page and updating the "Last updated" date.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              Phone: <a href="tel:+18339986906">+1 (833) 998-6906</a>
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 