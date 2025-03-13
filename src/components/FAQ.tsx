"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}

function FAQItem({ question, answer, isOpen, onToggle, delay }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <h3 className="text-lg md:text-xl font-medium">{question}</h3>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-gray-600">
              <p>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      id: 1,
      question: "What should I do right after a rideshare accident?",
      answer: "Immediately after a rideshare accident, ensure your safety first. Call 911 if there are injuries, take photos of the accident scene, exchange information with all parties involved, and report the accident to the rideshare company through their app. Also, get medical attention even if you don't feel injured right away, as some injuries may become apparent later."
    },
    {
      id: 2,
      question: "How long do I have to file a claim after a rideshare accident?",
      answer: "The statute of limitations varies by state, but typically you have 1-3 years from the date of the accident to file a personal injury claim. However, it's best to start the process as soon as possible while evidence is fresh and witnesses' memories are clear."
    },
    {
      id: 3,
      question: "Who is liable in a rideshare accident?",
      answer: "Liability in rideshare accidents can be complex and may include the rideshare driver, other drivers involved, the rideshare company, or even a vehicle manufacturer if a defect contributed to the accident. Our team will help determine all potentially liable parties to maximize your compensation."
    },
    {
      id: 4,
      question: "What compensation can I receive for a rideshare accident?",
      answer: "You may be eligible for compensation covering medical expenses, lost wages, pain and suffering, property damage, and in some cases, punitive damages. The specific amount depends on factors like the severity of injuries, impact on your life, and insurance coverage available."
    },
    {
      id: 5,
      question: "How does Claim Connectors' service work?",
      answer: "Our process is simple: Submit your claim details through our online form, receive a free consultation with a rideshare accident expert who will evaluate your case, and then our team handles everything from paperwork to negotiations while you focus on recovery. We only get paid when you do."
    },
    {
      id: 6,
      question: "Do I need a lawyer for a rideshare accident claim?",
      answer: "While not legally required, having a lawyer significantly increases your chances of receiving fair compensation. Rideshare companies and insurance providers have teams of lawyers working to minimize payouts. Our experts level the playing field and typically secure much higher settlements than individuals obtain on their own."
    }
  ];

  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about rideshare accident claims.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => toggleFAQ(faq.id)}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg mb-4">Still have questions?</p>
          <a href="/claim" className="btn-primary text-lg">
            Get in Touch With Our Experts
          </a>
        </motion.div>
      </div>
    </section>
  );
} 