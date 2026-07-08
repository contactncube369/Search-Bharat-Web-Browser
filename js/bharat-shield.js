/* ============================================
   Search Bharat — Bharat Shield AI Engine
   Core security module: URL scanning, phishing
   detection, permission guardian, download protection
   ============================================ */

class BharatShield {
  constructor() {
    // ── Threat Database ──
    this.threatLog = [];
    this.permissionLog = [];
    this.downloadLog = [];
    this.scanCount = 0;
    this.threatsBlocked = 0;
    this.downloadsScanned = 0;
    this.permissionsAnalyzed = 0;

    // ── Settings ──
    this.settings = {
      urlScanner: true,
      phishingDetector: true,
      permissionGuardian: true,
      downloadProtection: true,
      trackerDetection: true,
      fingerprintGuard: true,
      dataLeakDetection: true,
    };

    // ── Suspicious Keywords ──
    this.suspiciousKeywords = [
      'login', 'signin', 'sign-in', 'verify', 'verification', 'secure',
      'update', 'account', 'banking', 'bank', 'password', 'credential',
      'confirm', 'suspend', 'locked', 'unusual', 'alert', 'urgent',
      'expire', 'validate', 'authenticate', 'wallet', 'payment', 'pay',
      'invoice', 'refund', 'claim', 'prize', 'winner', 'reward',
      'free', 'gift', 'offer', 'discount', 'limited',
      // India-specific
      'paytm', 'phonepe', 'gpay', 'upi', 'aadhaar', 'aadhar',
      'pan-card', 'kyc', 'sbi', 'hdfc', 'icici', 'axis',
      'rupay', 'bhim', 'irctc',
    ];

    // ── Known Brand Names (for spoofing detection) ──
    this.knownBrands = [
      'google', 'facebook', 'meta', 'apple', 'microsoft', 'amazon',
      'netflix', 'paypal', 'instagram', 'twitter', 'whatsapp', 'telegram',
      'linkedin', 'adobe', 'dropbox', 'spotify', 'uber', 'airbnb',
      // Indian brands
      'paytm', 'phonepe', 'flipkart', 'swiggy', 'zomato', 'ola',
      'jio', 'airtel', 'vodafone', 'hdfc', 'icici', 'sbi',
      'axis', 'kotak', 'irctc', 'bhim', 'gpay', 'cred',
      'zerodha', 'groww', 'nykaa', 'myntra',
    ];

    // ── Risky TLDs ──
    this.riskyTLDs = [
      '.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.buzz',
      '.club', '.work', '.date', '.bid', '.stream', '.download',
      '.win', '.loan', '.racing', '.review', '.science', '.party',
      '.click', '.link', '.info', '.site', '.online', '.icu',
    ];

    // ── Dangerous File Extensions ──
    this.dangerousExtensions = [
      '.exe', '.msi', '.bat', '.cmd', '.ps1', '.vbs', '.vbe',
      '.js', '.jse', '.wsf', '.wsh', '.scr', '.pif', '.com',
      '.hta', '.cpl', '.inf', '.reg', '.rgs', '.sct',
    ];

    this.suspiciousExtensions = [
      '.docm', '.xlsm', '.pptm', '.dotm', '.xltm',
      '.jar', '.apk', '.dmg', '.iso', '.img',
      '.zip', '.rar', '.7z', '.tar',
    ];

    // ── Tracker Domains (Phase 2 stub data) ──
    this.trackerDomains = [
      'google-analytics.com', 'googletagmanager.com', 'doubleclick.net',
      'facebook.com/tr', 'connect.facebook.net',
      'analytics.tiktok.com', 'hotjar.com', 'clarity.ms',
      'fingerprintjs.com', 'mouseflow.com', 'mixpanel.com',
      'segment.com', 'amplitude.com', 'heapanalytics.com',
    ];

    this.loadSettings();
  }

  // ── URL Risk Scanner ──────────────────────────────

  scanURL(url) {
    if (!this.settings.urlScanner) return { score: 0, level: 'safe', factors: [] };

    this.scanCount++;
    const factors = [];
    let score = 0;

    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      const fullUrl = url.toLowerCase();

      // 1. Domain length analysis
      if (hostname.length > 30) {
        score += 15;
        factors.push({ name: 'Long Domain', desc: `Domain is ${hostname.length} characters`, icon: '📏', severity: 'medium' });
      } else if (hostname.length > 20) {
        score += 5;
        factors.push({ name: 'Moderate Domain Length', desc: `${hostname.length} characters`, icon: '📏', severity: 'low' });
      }

      // 2. Suspicious keywords in URL
      const keywordsFound = this.suspiciousKeywords.filter(kw => fullUrl.includes(kw));
      if (keywordsFound.length >= 3) {
        score += 25;
        factors.push({ name: 'Multiple Suspicious Keywords', desc: keywordsFound.slice(0, 3).join(', '), icon: '🚩', severity: 'high' });
      } else if (keywordsFound.length >= 1) {
        score += 10;
        factors.push({ name: 'Suspicious Keywords', desc: keywordsFound.join(', '), icon: '🚩', severity: 'medium' });
      }

      // 3. Punycode/Homograph attack detection
      if (hostname.startsWith('xn--') || /[^\x00-\x7F]/.test(hostname)) {
        score += 30;
        factors.push({ name: 'Punycode/Homograph Attack', desc: 'Domain uses internationalized characters that may impersonate another site', icon: '🎭', severity: 'high' });
      }

      // 4. Excessive subdomains
      const subdomains = hostname.split('.').length - 2; // minus TLD and domain
      if (subdomains >= 4) {
        score += 20;
        factors.push({ name: 'Excessive Subdomains', desc: `${subdomains + 2} levels deep`, icon: '🔗', severity: 'high' });
      } else if (subdomains >= 2) {
        score += 8;
        factors.push({ name: 'Multiple Subdomains', desc: `${subdomains + 2} levels`, icon: '🔗', severity: 'low' });
      }

      // 5. TLD analysis
      const tld = '.' + hostname.split('.').pop();
      if (this.riskyTLDs.includes(tld)) {
        score += 15;
        factors.push({ name: 'Risky TLD', desc: `${tld} is frequently used in phishing`, icon: '🌐', severity: 'medium' });
      }

      // 6. IP-based URL
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        score += 25;
        factors.push({ name: 'IP-Based URL', desc: 'Direct IP address instead of domain name', icon: '🔢', severity: 'high' });
      }

      // 7. HTTP (non-secure)
      if (parsed.protocol === 'http:') {
        score += 10;
        factors.push({ name: 'Insecure Connection', desc: 'No SSL/TLS encryption', icon: '🔓', severity: 'medium' });
      }

      // 8. Hyphens in domain
      const hyphenCount = (hostname.match(/-/g) || []).length;
      if (hyphenCount >= 3) {
        score += 15;
        factors.push({ name: 'Excessive Hyphens', desc: `${hyphenCount} hyphens in domain`, icon: '➖', severity: 'medium' });
      }

      // 9. Brand spoofing detection
      const domainParts = hostname.replace(/\.(com|org|net|co|in|io).*$/, '');
      const brandsInDomain = this.knownBrands.filter(b => {
        const mainDomain = hostname.split('.').slice(-2, -1)[0] || '';
        return domainParts.includes(b) && mainDomain !== b;
      });
      if (brandsInDomain.length > 0) {
        score += 25;
        factors.push({ name: 'Brand Impersonation', desc: `Contains brand name: ${brandsInDomain[0]}`, icon: '🎯', severity: 'high' });
      }

      // 10. Unusual port
      if (parsed.port && !['80', '443', '8080'].includes(parsed.port)) {
        score += 10;
        factors.push({ name: 'Unusual Port', desc: `Port ${parsed.port}`, icon: '🔌', severity: 'low' });
      }

      // 11. Very long path
      if (parsed.pathname.length > 100) {
        score += 8;
        factors.push({ name: 'Excessively Long Path', desc: `${parsed.pathname.length} characters`, icon: '📄', severity: 'low' });
      }

      // 12. Encoded characters in URL
      if (fullUrl.includes('%') && (fullUrl.match(/%/g) || []).length > 5) {
        score += 10;
        factors.push({ name: 'Heavy URL Encoding', desc: 'Many encoded characters in URL', icon: '🔤', severity: 'medium' });
      }

    } catch (e) {
      // Invalid URL
      score += 20;
      factors.push({ name: 'Invalid URL', desc: 'Could not parse URL', icon: '❌', severity: 'high' });
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Determine risk level
    let level = 'safe';
    if (score >= 70) level = 'danger';
    else if (score >= 35) level = 'warn';

    const result = { score, level, factors, url, timestamp: Date.now() };

    // Log threats
    if (level !== 'safe') {
      this.logThreat({
        type: 'url-risk',
        title: `Risky URL Detected (${score}/100)`,
        desc: new URL(url).hostname,
        level,
        action: level === 'danger' ? 'blocked' : 'warned',
        url,
      });
    }

    return result;
  }

  // ── Phishing Detector ─────────────────────────────

  analyzePageForPhishing(pageData) {
    if (!this.settings.phishingDetector) return { score: 0, level: 'safe', factors: [] };

    const factors = [];
    let score = 0;

    // pageData = { title, url, hasLoginForm, hasPasswordField, externalScriptCount,
    //              isHTTPS, hiddenIframes, formActions, brandMentions }

    // 1. Login form on suspicious domain
    if (pageData.hasPasswordField) {
      const urlRisk = this.scanURL(pageData.url);
      if (urlRisk.score > 30) {
        score += 30;
        factors.push({ name: 'Login Form on Risky Site', desc: 'Password field found on suspicious domain', icon: '🔑', severity: 'high' });
      } else {
        score += 5;
        factors.push({ name: 'Login Form Present', desc: 'Page contains a password field', icon: '🔑', severity: 'low' });
      }
    }

    // 2. Brand spoofing in title
    if (pageData.title) {
      const titleLower = pageData.title.toLowerCase();
      const hostname = new URL(pageData.url).hostname;
      const spoofedBrands = this.knownBrands.filter(b => {
        return titleLower.includes(b) && !hostname.includes(b);
      });
      if (spoofedBrands.length > 0) {
        score += 30;
        factors.push({ name: 'Brand Spoofing', desc: `Page mentions "${spoofedBrands[0]}" but domain doesn't match`, icon: '🎭', severity: 'high' });
      }
    }

    // 3. Excessive external scripts
    if (pageData.externalScriptCount > 15) {
      score += 10;
      factors.push({ name: 'Many External Scripts', desc: `${pageData.externalScriptCount} external scripts loaded`, icon: '📜', severity: 'medium' });
    }

    // 4. Hidden iframes
    if (pageData.hiddenIframes > 0) {
      score += 20;
      factors.push({ name: 'Hidden Iframes', desc: `${pageData.hiddenIframes} hidden iframe(s) detected`, icon: '👁️', severity: 'high' });
    }

    // 5. No HTTPS
    if (!pageData.isHTTPS) {
      score += 15;
      factors.push({ name: 'No HTTPS', desc: 'Page is not using encryption', icon: '🔓', severity: 'medium' });
    }

    // 6. Form action to external domain
    if (pageData.formActions && pageData.formActions.length > 0) {
      const currentDomain = new URL(pageData.url).hostname;
      const externalForms = pageData.formActions.filter(action => {
        try {
          return new URL(action, pageData.url).hostname !== currentDomain;
        } catch { return false; }
      });
      if (externalForms.length > 0) {
        score += 20;
        factors.push({ name: 'External Form Submission', desc: 'Form data sent to different domain', icon: '📤', severity: 'high' });
      }
    }

    score = Math.min(score, 100);
    let level = 'safe';
    if (score >= 60) level = 'danger';
    else if (score >= 30) level = 'warn';

    return { score, level, factors };
  }

  // ── Permission Guardian ───────────────────────────

  analyzePermission(permission, siteUrl) {
    if (!this.settings.permissionGuardian) return { risk: 'low', reason: '', allow: true };

    this.permissionsAnalyzed++;
    let risk = 'low';
    let reason = '';
    let allow = true;

    const hostname = (() => {
      try { return new URL(siteUrl).hostname; } catch { return siteUrl; }
    })();

    // Context-based analysis
    const siteCategory = this.categorizeSite(hostname);
    const permRisk = this.getPermissionContextRisk(permission, siteCategory);

    risk = permRisk.risk;
    reason = permRisk.reason;
    allow = risk !== 'high';

    // Log this permission analysis
    const logEntry = {
      permission,
      site: hostname,
      siteCategory,
      risk,
      reason,
      decision: allow ? 'allowed' : 'denied',
      timestamp: Date.now(),
    };
    this.permissionLog.push(logEntry);

    if (risk !== 'low') {
      this.logThreat({
        type: 'permission',
        title: `${risk === 'high' ? '⚠️ Risky' : '⚡ Suspicious'} Permission: ${permission}`,
        desc: `${hostname} — ${siteCategory}`,
        level: risk === 'high' ? 'danger' : 'warn',
        action: risk === 'high' ? 'blocked' : 'warned',
        url: siteUrl,
      });
    }

    return { risk, reason, allow, siteCategory };
  }

  categorizeSite(hostname) {
    const categories = {
      'calculator': ['calc', 'calculator', 'math'],
      'news': ['news', 'times', 'post', 'herald', 'tribune', 'gazette'],
      'shopping': ['shop', 'store', 'buy', 'amazon', 'flipkart', 'myntra'],
      'social': ['facebook', 'twitter', 'instagram', 'tiktok', 'reddit'],
      'banking': ['bank', 'hdfc', 'sbi', 'icici', 'axis', 'kotak', 'paytm'],
      'entertainment': ['youtube', 'netflix', 'spotify', 'game', 'play'],
      'education': ['edu', 'school', 'university', 'learn', 'course'],
      'email': ['mail', 'gmail', 'outlook', 'yahoo'],
      'video': ['meet', 'zoom', 'teams', 'video', 'call'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => hostname.includes(kw))) return category;
    }
    return 'general';
  }

  getPermissionContextRisk(permission, siteCategory) {
    // Permission-to-context risk matrix
    const riskMatrix = {
      camera: {
        calculator: { risk: 'high', reason: 'A calculator site should never need camera access. This could be used for surveillance or recording.' },
        news: { risk: 'high', reason: 'News sites rarely need camera access. This is suspicious.' },
        shopping: { risk: 'medium', reason: 'Some shopping sites use camera for AR try-on, but verify this is expected.' },
        video: { risk: 'low', reason: 'Video calling sites need camera access.' },
        social: { risk: 'low', reason: 'Social media may need camera for stories/posts.' },
        general: { risk: 'medium', reason: 'This site is requesting camera access. Verify this is expected before allowing.' },
      },
      microphone: {
        calculator: { risk: 'high', reason: 'A calculator has no reason to access your microphone. This could record audio without your knowledge.' },
        news: { risk: 'high', reason: 'News sites don\'t need microphone access.' },
        video: { risk: 'low', reason: 'Video calling requires microphone access.' },
        general: { risk: 'medium', reason: 'This site is requesting microphone access. Be cautious.' },
      },
      geolocation: {
        calculator: { risk: 'high', reason: 'Calculators don\'t need your location. This data could be sold to advertisers.' },
        shopping: { risk: 'low', reason: 'Shopping sites may use location for delivery estimates.' },
        news: { risk: 'medium', reason: 'News sites may want location for local news, but it could also be for tracking.' },
        general: { risk: 'medium', reason: 'Location sharing reveals your physical whereabouts. Only allow if necessary.' },
      },
      notifications: {
        general: { risk: 'medium', reason: 'Notification permission is often abused for spam advertising.' },
        email: { risk: 'low', reason: 'Email services benefit from notification access.' },
        social: { risk: 'low', reason: 'Social media notifications can be useful.' },
      },
      clipboard: {
        general: { risk: 'medium', reason: 'Clipboard access could read passwords or sensitive data you\'ve copied.' },
        banking: { risk: 'high', reason: 'Banking sites accessing clipboard could read OTPs or account numbers.' },
      },
    };

    const permMap = riskMatrix[permission];
    if (!permMap) return { risk: 'low', reason: 'This permission appears safe in this context.' };

    return permMap[siteCategory] || permMap.general || { risk: 'low', reason: 'This permission appears safe.' };
  }

  // ── Download Protection ───────────────────────────

  analyzeDownload(filename, sourceUrl, fileSize) {
    if (!this.settings.downloadProtection) return { score: 0, level: 'safe', risks: [], action: 'allow' };

    this.downloadsScanned++;
    const risks = [];
    let score = 0;
    const ext = '.' + filename.split('.').pop().toLowerCase();

    // 1. Dangerous extension
    if (this.dangerousExtensions.includes(ext)) {
      score += 40;
      risks.push({ icon: '🚨', desc: `Dangerous file type: ${ext.toUpperCase()} — Can execute code on your system` });
    }

    // 2. Suspicious extension
    if (this.suspiciousExtensions.includes(ext)) {
      score += 20;
      risks.push({ icon: '⚠️', desc: `Suspicious file type: ${ext.toUpperCase()} — May contain macros or scripts` });
    }

    // 3. Double extension (e.g. document.pdf.exe)
    const parts = filename.split('.');
    if (parts.length >= 3) {
      const secondLast = '.' + parts[parts.length - 2].toLowerCase();
      if (this.dangerousExtensions.includes(ext) && ['.pdf', '.doc', '.jpg', '.png', '.txt'].includes(secondLast)) {
        score += 30;
        risks.push({ icon: '🎭', desc: 'Double extension detected — File disguised as a safe type' });
      }
    }

    // 4. Source domain risk
    if (sourceUrl) {
      const urlRisk = this.scanURL(sourceUrl);
      if (urlRisk.score >= 50) {
        score += 20;
        risks.push({ icon: '🌐', desc: 'Download from a risky source domain' });
      }
    }

    // 5. Very small executable (potential dropper)
    if (this.dangerousExtensions.includes(ext) && fileSize && fileSize < 50000) {
      score += 15;
      risks.push({ icon: '📦', desc: 'Unusually small executable — May be a malware dropper' });
    }

    score = Math.min(score, 100);
    let level = 'safe';
    let action = 'allow';
    if (score >= 60) { level = 'danger'; action = 'block'; }
    else if (score >= 30) { level = 'warn'; action = 'warn'; }

    const result = { score, level, risks, action, filename, sourceUrl, ext };

    this.downloadLog.push({ ...result, timestamp: Date.now() });

    if (level !== 'safe') {
      this.logThreat({
        type: 'download',
        title: `Risky Download: ${filename}`,
        desc: `Risk: ${score}/100 — ${ext.toUpperCase()} file`,
        level,
        action: action === 'block' ? 'blocked' : 'warned',
        url: sourceUrl,
      });
    }

    return result;
  }

  // ── Threat Logging ────────────────────────────────

  logThreat(threat) {
    threat.timestamp = Date.now();
    threat.id = Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    this.threatLog.unshift(threat);

    // Keep last 100 threats
    if (this.threatLog.length > 100) this.threatLog.pop();

    if (threat.action === 'blocked') this.threatsBlocked++;

    // Save to localStorage
    this.saveThreatLog();

    // Emit event for dashboard
    window.dispatchEvent(new CustomEvent('bharat-shield-threat', { detail: threat }));
  }

  // ── Tracker, Fingerprint & Data Leak Protection ───

  logTrackerBlocked(domain, sourceUrl) {
    if (!this.settings.trackerDetection) return;

    this.logThreat({
      type: 'tracker',
      title: 'Tracker Blocked',
      desc: `Blocked tracking request to ${domain}`,
      level: 'warn',
      action: 'blocked',
      url: sourceUrl || 'Unknown',
    });
  }

  logFingerprintAttempt(api, sourceUrl) {
    if (!this.settings.fingerprintGuard) return;

    this.logThreat({
      type: 'fingerprint',
      title: 'Fingerprint Attempt Spoofed',
      desc: `Spoofed response for ${api} API`,
      level: 'warn',
      action: 'spoofed',
      url: sourceUrl || 'Unknown',
    });
  }

  logDataLeakAttempt(dataType, sourceUrl) {
    if (!this.settings.dataLeakDetection) return;

    this.logThreat({
      type: 'dataleak',
      title: 'Data Leak Prevented',
      desc: `Detected and warned about submitting ${dataType}`,
      level: 'danger',
      action: 'warned',
      url: sourceUrl || 'Unknown',
    });
  }


  // ── Security Score ────────────────────────────────

  getSecurityScore() {
    let score = 100;
    let details = [];

    // Deductions for disabled features
    if (!this.settings.urlScanner) { score -= 20; details.push('URL Scanner disabled'); }
    if (!this.settings.phishingDetector) { score -= 20; details.push('Phishing Detector disabled'); }
    if (!this.settings.permissionGuardian) { score -= 15; details.push('Permission Guardian disabled'); }
    if (!this.settings.downloadProtection) { score -= 15; details.push('Download Protection disabled'); }
    if (!this.settings.trackerDetection) { score -= 10; details.push('Tracker Detection disabled'); }
    if (!this.settings.fingerprintGuard) { score -= 10; details.push('Fingerprint Guard disabled'); }
    if (!this.settings.dataLeakDetection) { score -= 10; details.push('Data Leak Detection disabled'); }

    // Check external security settings
    const securitySettings = JSON.parse(localStorage.getItem('bharat-security') || '{}');
    if (securitySettings.trackerBlocker === false) { score -= 10; details.push('Tracker Blocker disabled'); }
    if (securitySettings.httpsEnforcement === false) { score -= 10; details.push('HTTPS Enforcement disabled'); }

    const privacySettings = JSON.parse(localStorage.getItem('bharat-privacy') || '{}');
    if (privacySettings.fingerprint === false) { score -= 5; details.push('Fingerprint Protection disabled'); }
    if (privacySettings.webrtc === false) { score -= 5; details.push('WebRTC Leak Prevention disabled'); }

    score = Math.max(score, 0);
    let level = 'safe';
    if (score < 40) level = 'danger';
    else if (score < 70) level = 'warn';

    return { score, level, details };
  }

  // ── Persistence ───────────────────────────────────

  loadSettings() {
    try {
      const saved = localStorage.getItem('bharat-shield-settings');
      if (saved) this.settings = { ...this.settings, ...JSON.parse(saved) };

      const threats = localStorage.getItem('bharat-shield-threats');
      if (threats) this.threatLog = JSON.parse(threats);

      const stats = localStorage.getItem('bharat-shield-stats');
      if (stats) {
        const s = JSON.parse(stats);
        this.scanCount = s.scanCount || 0;
        this.threatsBlocked = s.threatsBlocked || 0;
        this.downloadsScanned = s.downloadsScanned || 0;
        this.permissionsAnalyzed = s.permissionsAnalyzed || 0;
      }
    } catch (e) { /* use defaults */ }
  }

  saveSettings() {
    localStorage.setItem('bharat-shield-settings', JSON.stringify(this.settings));
    this.saveStats();
  }

  saveThreatLog() {
    try {
      localStorage.setItem('bharat-shield-threats', JSON.stringify(this.threatLog.slice(0, 50)));
    } catch (e) { /* storage full */ }
  }

  saveStats() {
    localStorage.setItem('bharat-shield-stats', JSON.stringify({
      scanCount: this.scanCount,
      threatsBlocked: this.threatsBlocked,
      downloadsScanned: this.downloadsScanned,
      permissionsAnalyzed: this.permissionsAnalyzed,
    }));
  }

  // ── Toggle Settings ───────────────────────────────

  toggleSetting(key) {
    if (this.settings[key] !== undefined) {
      this.settings[key] = !this.settings[key];
      this.saveSettings();
      return this.settings[key];
    }
    return null;
  }

  clearThreatLog() {
    this.threatLog = [];
    this.saveThreatLog();
  }

  // ── Phase 3: AI Shield Assistant ──────────────────

  async analyzeWithAI(url, riskFactors) {
    if (!window.bharatApp || !window.bharatApp.aiAssistant) return "AI Assistant unavailable.";
    
    const factorsText = riskFactors.map(f => `- ${f.name}: ${f.desc}`).join('\\n');
    const prompt = `You are Bharat Shield, a security AI. Explain why the following website is dangerous to a non-technical user in 2-3 short sentences. Use a concerned but helpful tone.
URL: ${url}
Risk Factors:
${factorsText}`;

    // Call the AI assistant directly
    try {
      // Temporarily use the AI assistant's generateResponse without adding to UI chat
      const response = await window.bharatApp.aiAssistant.generateResponse(prompt);
      return response;
    } catch(e) {
      return "Could not generate AI explanation. Please proceed with caution.";
    }
  }

  async inspectPage(htmlSnippet) {
    if (!window.bharatApp || !window.bharatApp.aiAssistant) return { score: 50, explanation: "AI Assistant unavailable." };

    const prompt = `You are an expert cybersecurity analyst. Analyze this HTML/JS snippet for malicious behavior, obfuscation, or phishing attempts. Provide a JSON response ONLY, in this exact format: {"score": [0-100 risk score], "explanation": "Brief 2 sentence explanation of findings"}.
Snippet:
${htmlSnippet.substring(0, 4000)}`;

    try {
      const response = await window.bharatApp.aiAssistant.generateResponse(prompt);
      // Try to parse JSON from the response
      const jsonStr = response.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      return JSON.parse(jsonStr);
    } catch(e) {
      return { score: 50, explanation: "Analysis failed or returned invalid format." };
    }
  }
}
