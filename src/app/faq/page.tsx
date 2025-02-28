"use client";

import React, { useState } from 'react';

const faqs = [
  {
    question: "How does the claim process work?",
    answer: "Our process is simple: First, submit your claim details through our online form. Next, one of our specialists will contact you for a free consultation to evaluate your case. If we determine you have a valid claim, we'll connect you with the right legal representation who will handle your case from start to finish. You pay nothing unless you receive compensation."
  },
  {
    question: "How long does it take to receive compensation?",
    answer: "The timeline varies depending on the complexity of your case, the severity of injuries, and the cooperation of insurance companies. Simple cases may settle in a few months, while more complex cases might take longer. We work to expedite the process as much as possible while still fighting for maximum compensation."
  },
  {
    question: "What types of compensation can I receive?",
    answer: "You may be eligible for various types of compensation, including medical expenses (past and future), lost wages, pain and suffering, emotional distress, and property damage. The specific amounts depend on the details of your case, including the severity of injuries and impact on your life."
  },
  {
    question: "Do I need to pay anything upfront?",
    answer: "No. We work on a contingency fee basis, which means you pay nothing unless we help you recover compensation. Our fee is a percentage of the settlement amount, so there's no financial risk to you."
  },
  {
    question: "What if I was partially at fault for the accident?",
    answer: "You may still be eligible for compensation even if you were partially at fault. Many states follow comparative negligence laws, which allow you to recover damages reduced by your percentage of fault. During your consultation, we'll evaluate the specifics of your case and advise you accordingly."
  },
  {
    question: "Do you handle cases for rideshare drivers?",
    answer: "Yes, we help both passengers and drivers involved in rideshare accidents. The claims process can be particularly complex for drivers due to insurance coverage issues, but our specialists are experienced in navigating these challenges."
  },
  {
    question: "What if the accident happened weeks/months ago?",
    answer: "You should still contact us. While it's best to start the claims process as soon as possible, you typically have 1-2 years (depending on your state) to file a personal injury claim. However, evidence becomes harder to gather as time passes, so don't delay unnecessarily."
  },
  {
    question: "What information do I need to provide?",
    answer: "Initially, we'll need basic information about the accident (date, location, rideshare company), your contact details, and a brief description of any injuries. Later in the process, medical records, the police report, and any communication with insurance companies will be helpful."
  },
  {
    question: "Will I have to go to court?",
    answer: "Most rideshare accident claims settle out of court. However, if the insurance company refuses to offer a fair settlement, we may recommend proceeding to litigation. Our partner attorneys are prepared to represent you in court if necessary."
  },
  {
    question: "How is your service different from just hiring a lawyer?",
    answer: "We specialize exclusively in rideshare accidents, giving us unique expertise in this niche area. We handle the initial evaluation and then connect you with the best legal representation for your specific situation. This specialized approach often leads to faster resolutions and better outcomes."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h1>
        
        <p className="text-xl text-gray-600 mb-12">
          Find answers to common questions about rideshare accident claims and our services.
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Don't see your question answered? Contact us directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/claim" 
              className="btn-primary"
            >
              Start Your Claim
            </a>
            <a 
              href="/contact" 
              className="btn-outline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 