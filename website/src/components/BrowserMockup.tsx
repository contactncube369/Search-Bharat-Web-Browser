"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function BrowserMockup() {
  return (
    <div className="relative glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-500/10">
      {/* Browser Chrome (Header) */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="mx-auto flex-1 max-w-2xl">
          <div className="bg-black/40 rounded-full px-4 py-1.5 flex items-center gap-2 text-sm text-gray-400 border border-white/5">
            <Search className="w-4 h-4" />
            <span>searchbharat.com</span>
          </div>
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="aspect-[16/9] bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-radial from-brand-500/10 to-transparent" />
        <div className="relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-24 mx-auto mb-6 bg-brand-500 rounded-3xl flex items-center justify-center shadow-lg shadow-brand-500/20"
          >
            <Search className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Experience the New Web</h2>
          <p className="text-gray-400 max-w-md mx-auto">Fast, secure, and built for the modern internet. Designed with powerful AI capabilities.</p>
        </div>
      </div>
    </div>
  );
}
