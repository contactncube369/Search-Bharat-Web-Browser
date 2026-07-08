"use client";

import { motion } from "framer-motion";

export function InstallationSteps() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Installation Guide</h2>
        <p className="text-gray-400">Get up and running in a few simple steps</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Windows Steps */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">Win</span>
            Windows Installation
          </h3>
          <ol className="space-y-6 relative border-l border-white/10 ml-4 pl-8">
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-brand-500 transition-colors flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white">1</span>
              <h4 className="font-medium text-white group-hover:text-brand-300 transition-colors">Download SearchBharatSetup.exe</h4>
              <p className="text-sm text-gray-400 mt-1">Click the Windows download button above.</p>
            </li>
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-brand-500 transition-colors flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white">2</span>
              <h4 className="font-medium text-white group-hover:text-brand-300 transition-colors">Run Installer</h4>
              <p className="text-sm text-gray-400 mt-1">Double click the downloaded file to begin installation.</p>
            </li>
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-brand-500 transition-colors flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white">3</span>
              <h4 className="font-medium text-white group-hover:text-brand-300 transition-colors">Complete Setup</h4>
              <p className="text-sm text-gray-400 mt-1">Follow the prompts in the installation wizard.</p>
            </li>
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-brand-500 flex items-center justify-center text-sm font-bold text-brand-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]">4</span>
              <h4 className="font-medium text-white">Launch Browser</h4>
              <p className="text-sm text-gray-400 mt-1">Open SearchBharat and enjoy the fast web.</p>
            </li>
          </ol>
        </motion.div>

        {/* macOS Steps */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center text-sm">Mac</span>
            macOS Installation
          </h3>
          <ol className="space-y-6 relative border-l border-white/10 ml-4 pl-8">
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-white transition-colors flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white">1</span>
              <h4 className="font-medium text-white group-hover:text-gray-300 transition-colors">Download SearchBharat.dmg</h4>
              <p className="text-sm text-gray-400 mt-1">Click the macOS download button above.</p>
            </li>
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-white transition-colors flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white">2</span>
              <h4 className="font-medium text-white group-hover:text-gray-300 transition-colors">Open DMG</h4>
              <p className="text-sm text-gray-400 mt-1">Double click to mount the disk image.</p>
            </li>
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-white transition-colors flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white">3</span>
              <h4 className="font-medium text-white group-hover:text-gray-300 transition-colors">Drag to Applications</h4>
              <p className="text-sm text-gray-400 mt-1">Drag the SearchBharat icon into the Applications folder.</p>
            </li>
            <li className="relative group">
              <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-brand-500 flex items-center justify-center text-sm font-bold text-brand-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]">4</span>
              <h4 className="font-medium text-white">Launch Browser</h4>
              <p className="text-sm text-gray-400 mt-1">Open from Launchpad or Spotlight.</p>
            </li>
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
