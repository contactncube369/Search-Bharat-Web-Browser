export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030712] py-12 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-bold text-xl text-white mb-4">SearchBharat</div>
          <p className="mb-6">AI-Powered Privacy, Security, and Speed.</p>
          <p>© {new Date().getFullYear()} SearchBharat. All rights reserved.</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Connect</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
