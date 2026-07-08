"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { downloadConfig } from "../../config/downloads";
import { motion } from "framer-motion";

export function SmartDownload() {
  const [platform, setPlatform] = useState<"Windows" | "macOS" | "Unknown">("Unknown");
  
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) setPlatform("Windows");
    else if (userAgent.indexOf("Mac") !== -1) setPlatform("macOS");
  }, []);

  const downloadUrl = platform === "macOS" ? downloadConfig.macUrl : downloadConfig.windowsUrl;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center mt-12 z-20 relative"
    >
      <a
        href={downloadUrl}
        download
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white bg-brand-600 rounded-full overflow-hidden transition-transform hover:scale-105 hover:bg-brand-500 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Download className="w-5 h-5 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" />
        <span>Download SearchBharat</span>
      </a>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 text-sm text-gray-400 font-medium"
      >
        {platform !== "Unknown" ? `Detected Platform: ${platform}` : "Download for your platform"}
      </motion.p>
    </motion.div>
  );
}
