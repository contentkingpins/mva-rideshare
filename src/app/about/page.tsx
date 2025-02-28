import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Claim Connectors',
  description: 'Learn about Claim Connectors and our mission to help rideshare accident victims.',
};

export default function AboutPage() {
  return (
    <main className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">About Claim Connectors</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Claim Connectors was founded with a simple mission: to help rideshare accident victims navigate the complex claims process and receive the compensation they deserve.
          </p>
          
          <p>
            Our team of experienced professionals understands the unique challenges that come with rideshare accident claims. We work tirelessly to connect victims with the right legal representation and ensure their rights are protected throughout the entire process.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            To provide accessible, hassle-free claim assistance to rideshare accident victims, ensuring they receive fair compensation quickly and efficiently.
          </p>
          
          <h2>Our Values</h2>
          <ul>
            <li><strong>Transparency:</strong> We believe in clear communication and setting realistic expectations.</li>
            <li><strong>Advocacy:</strong> We fight for our clients' rights and best interests at every step.</li>
            <li><strong>Efficiency:</strong> We streamline the claims process to get results as quickly as possible.</li>
            <li><strong>Compassion:</strong> We understand the physical, emotional, and financial toll accidents can take.</li>
          </ul>
          
          <h2>Why Choose Claim Connectors?</h2>
          <p>
            Unlike traditional law firms, we specialize exclusively in rideshare accident claims. This focused expertise allows us to navigate the specific challenges of Uber and Lyft accident cases with unmatched efficiency.
          </p>
          
          <p>
            Our service is risk-free: you pay nothing unless we help you recover compensation. We handle all the paperwork, negotiations, and legal complexities, allowing you to focus on your recovery.
          </p>
          
          <div className="mt-8">
            <Link href="/claim" className="btn-primary inline-block">
              Start Your Free Claim Assessment
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 