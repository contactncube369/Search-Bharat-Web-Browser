"use client";

import { CheckCircle, ShieldCheck, Lock, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

export function SecurityTrust() {
  const badges = [
    { icon: ShieldCheck, title: "Virus Scanned", desc: "100% clean and safe" },
    { icon: Lock, title: "Secure Installer", desc: "Code-signed binaries" },
    { icon: FileCheck, title: "SHA256 Verified", desc: "Cryptographic proof" },
    { icon: CheckCircle, title: "Privacy Focused", desc: "No tracking included" },
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-400 mb-4 transition-transform hover:scale-110 hover:bg-brand-500/20">
                <badge.icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-white mb-1">{badge.title}</h4>
              <p className="text-sm text-gray-400">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
