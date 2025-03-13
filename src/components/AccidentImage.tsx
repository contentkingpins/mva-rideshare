"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AccidentImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-lg overflow-hidden shadow-2xl mx-auto max-w-md lg:max-w-lg"
    >
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src="/images/car-accident.jpg"
          alt="Car accident scene showing a collision between two vehicles"
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end p-4">
          <span className="text-white text-lg font-semibold drop-shadow-md text-center">
            Rideshare accidents can lead to significant injuries and lost income
          </span>
        </div>
      </div>
    </motion.div>
  );
} 