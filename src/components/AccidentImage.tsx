"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AccidentImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-lg overflow-hidden shadow-2xl mx-auto max-w-md"
    >
      <div className="relative h-64 sm:h-72 w-full">
        <Image
          src="/images/rideshare-accident.jpg"
          alt="Car accident scene showing damaged vehicles on a city street"
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-95"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-4">
          <span className="text-white text-lg font-semibold drop-shadow-md text-center">
            Get experienced help after your rideshare accident
          </span>
        </div>
      </div>
    </motion.div>
  );
} 