"use client";

import { Monitor, Apple, Download } from "lucide-react";
import { downloadConfig } from "../../config/downloads";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function ManualDownloads() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto" id="download">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Download for your Platform</h2>
        <p className="text-gray-400">Choose the right installer for your operating system.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* Windows Card */}
        <motion.div variants={item} className="glass-card p-8 rounded-3xl flex flex-col items-center text-center group hover:border-brand-500/50 transition-colors">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
            <Monitor className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Windows</h3>
          <p className="text-gray-400 mb-6">Windows 10 and above</p>
          
          <div className="mt-auto w-full">
            <a 
              href={downloadConfig.windowsUrl}
              download
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium hover:text-brand-400 group/btn"
            >
              <Download className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" />
              Download .exe
            </a>
          </div>
        </motion.div>

        {/* macOS Card */}
        <motion.div variants={item} className="glass-card p-8 rounded-3xl flex flex-col items-center text-center group hover:border-brand-500/50 transition-colors">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
            <Apple className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-2xl font-bold mb-2">macOS</h3>
          <p className="text-gray-400 mb-6">Apple Silicon and Intel</p>
          
          <div className="mt-auto w-full">
            <a 
              href={downloadConfig.macUrl}
              download
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium hover:text-brand-400 group/btn"
            >
              <Download className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" />
              Download .dmg
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
