"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function RideshareImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-lg overflow-hidden shadow-2xl mx-auto max-w-md"
    >
      <div className="relative h-64 sm:h-80 w-full">
        <Image
          src="/images/shutterstock_2428486561.jpg"
          alt="Rideshare accident scene with damaged vehicles"
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-95"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-4">
          <span className="text-white text-lg font-semibold drop-shadow-md text-center">
            Get help with your rideshare accident claim
          </span>
        </div>
      </div>
    </motion.div>
  );
} 