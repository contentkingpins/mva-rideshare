import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Claim Connectors',
  description: 'Read the latest articles about rideshare accidents, claims, and legal advice.',
};

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Rideshare Insurance Coverage',
    excerpt: 'Learn about the complex insurance policies that apply during different phases of a rideshare trip and how they affect your claim.',
    date: 'February 15, 2024',
    author: 'Sarah Johnson',
    category: 'Insurance',
    imageUrl: '/images/blog/insurance-coverage.jpg',
    slug: 'understanding-rideshare-insurance-coverage',
  },
  {
    id: 2,
    title: '5 Steps to Take Immediately After a Rideshare Accident',
    excerpt: 'Quick action after an accident can significantly impact your claim. Follow these essential steps to protect your rights and strengthen your case.',
    date: 'January 28, 2024',
    author: 'Michael Rodriguez',
    category: 'Safety',
    imageUrl: '/images/blog/accident-steps.jpg',
    slug: '5-steps-after-rideshare-accident',
  },
  {
    id: 3,
    title: 'Common Injuries in Rideshare Accidents and Their Long-Term Impact',
    excerpt: 'From whiplash to traumatic brain injuries, understand the common injuries in rideshare accidents and how they might affect you long-term.',
    date: 'January 10, 2024',
    author: 'Dr. Emily Chen',
    category: 'Medical',
    imageUrl: '/images/blog/injuries.jpg',
    slug: 'common-rideshare-accident-injuries',
  },
  {
    id: 4,
    title: 'How Rideshare Companies Try to Avoid Liability',
    excerpt: 'Uber and Lyft use various strategies to minimize their liability in accident cases. Here\'s what you need to know to counter these tactics.',
    date: 'December 12, 2023',
    author: 'James Wilson',
    category: 'Legal',
    imageUrl: '/images/blog/liability.jpg',
    slug: 'rideshare-liability-tactics',
  },
  {
    id: 5,
    title: 'Calculating Fair Compensation for Your Rideshare Accident',
    excerpt: 'Beyond medical bills: Learn how to properly value your claim including pain and suffering, lost wages, and future expenses.',
    date: 'November 30, 2023',
    author: 'Lisa Thompson',
    category: 'Compensation',
    imageUrl: '/images/blog/compensation.jpg',
    slug: 'calculating-rideshare-accident-compensation',
  },
  {
    id: 6,
    title: 'Recent Legal Changes Affecting Rideshare Accident Claims',
    excerpt: 'Stay updated on the latest regulations and court decisions that could impact how rideshare accident claims are handled in different states.',
    date: 'November 15, 2023',
    author: 'Robert Garcia',
    category: 'Legal',
    imageUrl: '/images/blog/legal-changes.jpg',
    slug: 'legal-changes-rideshare-claims',
  },
];

export default function BlogPage() {
  return (
    <main className="container py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Blog</h1>
        
        <p className="text-xl text-gray-600 mb-12">
          Stay informed with the latest articles about rideshare accidents, claims, and legal advice.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="card overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span className="text-primary-600">{post.category}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold text-sm">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {post.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Have questions about your rideshare accident claim?
          </p>
          <Link 
            href="/claim" 
            className="btn-primary"
          >
            Start Your Free Claim Assessment
          </Link>
        </div>
      </div>
    </main>
  );
} 