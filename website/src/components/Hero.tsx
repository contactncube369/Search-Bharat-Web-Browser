"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { BrowserMockup } from "./BrowserMockup";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-gradient">SearchBharat</span> Browser
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
          AI-Powered Privacy, Security, and Speed
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-5xl mx-auto mt-12 z-10"
      >
        <BrowserMockup />
      </motion.div>
    </section>
  );
}
