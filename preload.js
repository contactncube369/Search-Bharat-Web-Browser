/* ============================================
   Search Bharat - Preload Script
   Secure bridge between Electron and renderer.
   Exposes safe APIs to the browser UI.
   ============================================ */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  openDevTools: () => ipcRenderer.send('open-devtools'),

  // Listen for tracker blocked events from main process
  onTrackerBlocked: (callback) => {
    ipcRenderer.on('tracker-blocked', (event, url) => callback(url));
  },

  // Privacy & VPN
  setProxy: (location) => ipcRenderer.invoke('set-proxy', location),
  clearProxy: () => ipcRenderer.send('clear-proxy'),
  setWebRTC: (allow) => ipcRenderer.send('set-webrtc', allow),

  // Screenshot
  takeScreenshot: () => ipcRenderer.invoke('take-screenshot'),

  // Download events (Bharat Shield)
  onDownloadStarted: (callback) => {
    ipcRenderer.on('download-started', (event, data) => callback(data));
  },

  // Check if running in Electron
  isElectron: true,

  // Receive security events
  onSecurityEvent: (callback) => {
    ipcRenderer.on('security-event', (event, data) => callback(data));
  },

  // Open new tab from webview window.open
  onOpenNewTab: (callback) => {
    ipcRenderer.on('open-new-tab', (event, url) => callback(url));
  }
});

/* ============================================
   Phase 2: Fingerprint Guard & Data Leak Detection
   ============================================ */

// Only run these protections in actual web content, not in the browser chrome itself
if (window.location.protocol !== 'bharat:' && window.location.protocol !== 'file:') {
  
  // 1. Fingerprint Guard: Spoof Canvas API
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(...args) {
    ipcRenderer.send('shield-event', { type: 'fingerprint', api: 'Canvas.toDataURL', url: window.location.href });
    // Add subtle noise to the canvas to spoof fingerprint
    const ctx = this.getContext('2d');
    if (ctx) {
      const width = this.width || 1;
      const height = this.height || 1;
      ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.01)`;
      ctx.fillRect(0, 0, width, height);
    }
    return originalToDataURL.apply(this, args);
  };

  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function(...args) {
    ipcRenderer.send('shield-event', { type: 'fingerprint', api: 'Canvas.getImageData', url: window.location.href });
    const imageData = originalGetImageData.apply(this, args);
    // Mutate a random pixel slightly
    if (imageData && imageData.data && imageData.data.length > 0) {
      const i = Math.floor(Math.random() * (imageData.data.length / 4)) * 4;
      imageData.data[i] = (imageData.data[i] + 1) % 256;
    }
    return imageData;
  };

  // 2. Fingerprint Guard: Spoof WebGL
  const originalReadPixels = WebGLRenderingContext.prototype.readPixels;
  WebGLRenderingContext.prototype.readPixels = function(...args) {
    ipcRenderer.send('shield-event', { type: 'fingerprint', api: 'WebGL.readPixels', url: window.location.href });
    // This is often used for WebGL fingerprinting, we just log and let it pass or we could modify the buffer
    return originalReadPixels.apply(this, args);
  };

  // 3. Data Leak Detection: Intercept Form Submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!form || form.tagName !== 'FORM') return;

    let formDataText = '';
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      formDataText += ` ${value}`;
    }

    // Basic regex for sensitive Indian data
    const patterns = {
      'Aadhaar Number': /\b\d{4}\s?\d{4}\s?\d{4}\b/,
      'PAN Card': /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/,
      'Credit Card': /\b(?:\d[ -]*?){13,16}\b/
    };

    let leakDetected = null;
    for (const [type, regex] of Object.entries(patterns)) {
      if (regex.test(formDataText)) {
        leakDetected = type;
        break;
      }
    }

    if (leakDetected) {
      ipcRenderer.send('shield-event', { type: 'dataleak', dataType: leakDetected, url: window.location.href });
      // We don't prevent default here to let the warning be async,
      // or we could e.preventDefault() and wait for user confirmation via IPC.
      // For this phase, we just log it as a warning so it doesn't break legit sites.
    }
  }, true); // use capture phase
}

