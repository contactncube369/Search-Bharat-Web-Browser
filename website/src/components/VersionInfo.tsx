"use client";

import { downloadConfig } from "../../config/downloads";

export function VersionInfo() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">Version Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">Version</span>
            <span className="font-mono font-medium text-white">{downloadConfig.version}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">Release Date</span>
            <span className="font-medium text-white">{downloadConfig.releaseDate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">Installer Size</span>
            <span className="font-medium text-white">{downloadConfig.size}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400">SHA256 Checksum</span>
            <span className="font-mono text-xs text-white truncate max-w-[150px]" title={downloadConfig.sha256}>
              {downloadConfig.sha256.substring(0, 16)}...
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
