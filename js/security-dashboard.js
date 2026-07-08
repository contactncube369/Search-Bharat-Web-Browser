/* ============================================
   Search Bharat — Security Dashboard Controller
   Manages the Security Dashboard UI, renders
   threat logs, score gauge, and protection status
   ============================================ */

class SecurityDashboard {
  constructor(shield) {
    this.shield = shield;
    this.currentUrlRisk = null;
  }

  init() {
    // Listen for threat events
    window.addEventListener('bharat-shield-threat', (e) => {
      this.onNewThreat(e.detail);
    });
  }

  // ── Render Full Dashboard ──────────────────────────

  renderDashboard() {
    this.renderStats();
    this.renderSecurityGauge();
    this.renderProtections();
    this.renderCurrentUrlRisk();
    this.renderThreatLog();
  }

  renderStats() {
    const el = (id, val) => {
      const e = document.getElementById(id);
      if (e) e.textContent = typeof val === 'number' ? val.toLocaleString() : val;
    };

    el('shieldScanCount', this.shield.scanCount);
    el('shieldThreatsBlocked', this.shield.threatsBlocked);
    el('shieldDownloadsScanned', this.shield.downloadsScanned);
    el('shieldPermissionsAnalyzed', this.shield.permissionsAnalyzed);
  }

  renderSecurityGauge() {
    const { score, level, details } = this.shield.getSecurityScore();

    // Update gauge circle
    const fill = document.getElementById('securityGaugeFill');
    const scoreEl = document.getElementById('securityGaugeScore');
    const statusEl = document.getElementById('securityGaugeStatus');

    if (!fill || !scoreEl || !statusEl) return;

    // SVG circle math: circumference = 2 * PI * radius
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    fill.style.strokeDasharray = circumference;
    fill.style.strokeDashoffset = offset;

    // Color based on level
    fill.className.baseVal = `bharat-security__gauge-fill bharat-security__gauge-fill--${level}`;
    scoreEl.className = `bharat-security__gauge-score bharat-security__gauge-score--${level}`;
    scoreEl.textContent = score;

    const statusTexts = { safe: '✅ Protected', warn: '⚠️ Partial', danger: '🔴 At Risk' };
    statusEl.className = `bharat-security__gauge-status bharat-security__gauge-status--${level}`;
    statusEl.textContent = statusTexts[level];
  }

  renderProtections() {
    const container = document.getElementById('shieldProtectionsList');
    if (!container) return;

    const protections = [
      { name: 'URL Risk Scanner', key: 'urlScanner', icon: '🔍' },
      { name: 'Phishing Detector', key: 'phishingDetector', icon: '🎣' },
      { name: 'Permission Guardian', key: 'permissionGuardian', icon: '🔐' },
      { name: 'Download Protection', key: 'downloadProtection', icon: '📥' },
      { name: 'Tracker Detection', key: 'trackerDetection', icon: '🕵️' },
      { name: 'Fingerprint Guard', key: 'fingerprintGuard', icon: '🛡️' },
      { name: 'Data Leak Detection', key: 'dataLeakDetection', icon: '🔒' },
    ];

    // Also check external settings
    const securitySettings = JSON.parse(localStorage.getItem('bharat-security') || '{}');
    const externalProtections = [
      { name: 'Tracker Blocker', active: securitySettings.trackerBlocker !== false, icon: '🕵️' },
      { name: 'Ad Blocker', active: securitySettings.adBlocker !== false, icon: '🚫' },
      { name: 'HTTPS Enforcement', active: securitySettings.httpsEnforcement !== false, icon: '🔒' },
      { name: 'Phishing Detection (Legacy)', active: securitySettings.phishingDetection !== false, icon: '🛡️' },
    ];

    container.innerHTML = '';

    protections.forEach(p => {
      const active = this.shield.settings[p.key];
      container.innerHTML += `
        <div class="bharat-security__protection-item" data-shield-key="${p.key}">
          <div class="bharat-security__protection-dot bharat-security__protection-dot--${active ? 'active' : 'inactive'}"></div>
          <span style="font-size:16px;flex-shrink:0;">${p.icon}</span>
          <span class="bharat-security__protection-name">${p.name}</span>
          <span class="bharat-security__protection-status bharat-security__protection-status--${active ? 'on' : 'off'}">${active ? 'Active' : 'Off'}</span>
        </div>
      `;
    });

    externalProtections.forEach(p => {
      container.innerHTML += `
        <div class="bharat-security__protection-item">
          <div class="bharat-security__protection-dot bharat-security__protection-dot--${p.active ? 'active' : 'inactive'}"></div>
          <span style="font-size:16px;flex-shrink:0;">${p.icon}</span>
          <span class="bharat-security__protection-name">${p.name}</span>
          <span class="bharat-security__protection-status bharat-security__protection-status--${p.active ? 'on' : 'off'}">${p.active ? 'Active' : 'Off'}</span>
        </div>
      `;
    });

    // Bind click to toggle shield settings
    container.querySelectorAll('[data-shield-key]').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const key = item.dataset.shieldKey;
        const newState = this.shield.toggleSetting(key);
        if (newState !== null) {
          this.renderProtections();
          this.renderSecurityGauge();
          if (window.bharatApp) {
            window.bharatApp.showToast(
              `${newState ? '✅' : '⭕'} ${key.replace(/([A-Z])/g, ' $1').trim()} ${newState ? 'enabled' : 'disabled'}`,
              newState ? '🛡️' : '⚠️'
            );
          }
        }
      });
    });
  }

  renderCurrentUrlRisk() {
    const container = document.getElementById('shieldCurrentRisk');
    if (!container) return;

    if (!this.currentUrlRisk || this.currentUrlRisk.score === 0) {
      container.innerHTML = `
        <div class="bharat-security__risk-card" style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:12px;opacity:0.3;">🔍</div>
          <div style="font-size:14px;color:var(--bharat-text-tertiary);">Navigate to a website to see its risk analysis</div>
        </div>
      `;
      return;
    }

    const r = this.currentUrlRisk;
    const levelColors = { safe: '#00b894', warn: '#fdcb6e', danger: '#ff6b6b' };

    container.innerHTML = `
      <div class="bharat-security__risk-card">
        <div class="bharat-security__risk-header">
          <div class="bharat-security__risk-url">${this.escapeHtml(r.url)}</div>
          <div class="bharat-security__risk-score-badge bharat-security__risk-score-badge--${r.level}">
            ${r.level === 'safe' ? '✅' : r.level === 'warn' ? '⚠️' : '🚨'} 
            Risk: ${r.score}/100
          </div>
        </div>
        <div class="bharat-security__risk-factors">
          ${r.factors.length > 0 ? r.factors.map(f => `
            <div class="bharat-security__risk-factor">
              <span class="bharat-security__risk-factor-icon">${f.icon}</span>
              <div>
                <div style="font-weight:600;margin-bottom:2px;">${f.name}</div>
                <div style="opacity:0.6;">${f.desc}</div>
              </div>
            </div>
          `).join('') : `
            <div class="bharat-security__risk-factor">
              <span class="bharat-security__risk-factor-icon">✅</span>
              <div>No risk factors detected — This site appears safe</div>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderThreatLog() {
    const container = document.getElementById('shieldThreatLog');
    if (!container) return;

    if (this.shield.threatLog.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--bharat-text-tertiary);font-size:13px;">
          <div style="font-size:36px;margin-bottom:8px;opacity:0.3;">🛡️</div>
          No threats detected yet — Bharat Shield is protecting you
        </div>
      `;
      return;
    }

    container.innerHTML = this.shield.threatLog.slice(0, 20).map((t, i) => {
      const icons = { 'url-risk': '🌐', 'download': '📥', 'permission': '🔐', 'phishing': '🎣', 'tracker': '🕵️', 'fingerprint': '🛡️', 'dataleak': '🔒' };
      const timeDiff = this.timeAgo(t.timestamp);
      return `
        <div class="bharat-security__threat-item" style="animation-delay:${i * 0.05}s;">
          <span class="bharat-security__threat-icon">${icons[t.type] || '⚠️'}</span>
          <div class="bharat-security__threat-info">
            <div class="bharat-security__threat-title">${this.escapeHtml(t.title)}</div>
            <div class="bharat-security__threat-desc">${this.escapeHtml(t.desc)}</div>
          </div>
          <span class="bharat-security__threat-badge bharat-security__threat-badge--${t.action}">${t.action}</span>
          <span class="bharat-security__threat-time">${timeDiff}</span>
        </div>
      `;
    }).join('');
  }

  // ── URL Risk Badge (in navbar) ─────────────────────

  updateUrlRiskBadge(riskResult) {
    this.currentUrlRisk = riskResult;
    const badge = document.getElementById('urlRiskBadge');
    if (!badge) return;

    if (!riskResult || riskResult.score === 0) {
      badge.classList.remove('bharat-urlbar__risk-badge--visible');
      return;
    }

    badge.className = `bharat-urlbar__risk-badge bharat-urlbar__risk-badge--visible bharat-urlbar__risk-badge--${riskResult.level}`;
    
    const labels = { safe: 'Safe', warn: 'Caution', danger: 'Danger' };
    badge.innerHTML = `${riskResult.level === 'safe' ? '✅' : riskResult.level === 'warn' ? '⚠️' : '🚨'} ${labels[riskResult.level]} ${riskResult.score}`;
  }

  // ── AI Webpage Inspector ──────────────────────────

  async runAiInspector() {
    const container = document.getElementById('aiInspectorResult');
    if (!container) return;

    if (!window.bharatApp || !window.bharatApp.isElectron) {
      container.style.display = 'block';
      container.innerHTML = '<span style="color:var(--bharat-text-tertiary);">⚠️ Inspector only works in the active browser context.</span>';
      return;
    }

    const wv = window.bharatApp.webviews[window.bharatApp.tabManager.activeTabId];
    if (!wv) {
      container.style.display = 'block';
      container.innerHTML = '<span style="color:var(--bharat-text-tertiary);">⚠️ No active tab to inspect.</span>';
      return;
    }

    container.style.display = 'block';
    container.innerHTML = '<span style="color:var(--bharat-accent-primary);">🤖 Inspector is analyzing page structure...</span>';

    try {
      const htmlSnippet = await wv.executeJavaScript(`
        (function() {
          // Extract meta tags, forms, and external script URLs
          let data = "Title: " + document.title + "\\n";
          document.querySelectorAll('meta').forEach(m => {
            data += "Meta: " + (m.name || m.property) + " = " + m.content + "\\n";
          });
          document.querySelectorAll('script[src]').forEach(s => {
            data += "Script: " + s.src + "\\n";
          });
          document.querySelectorAll('form').forEach(f => {
            data += "Form Action: " + f.action + " Method: " + f.method + "\\n";
          });
          return data;
        })();
      `);

      const result = await this.shield.inspectPage(htmlSnippet);
      const level = result.score < 40 ? 'danger' : result.score < 70 ? 'warn' : 'safe';
      
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <strong>🤖 AI Inspector Score:</strong>
          <span class="bharat-security__risk-score-badge bharat-security__risk-score-badge--${level}">
            ${level === 'safe' ? '✅' : level === 'warn' ? '⚠️' : '🚨'} ${result.score}/100
          </span>
        </div>
        <div style="font-size:13px; color:var(--bharat-text-secondary);">${result.explanation}</div>
      `;
    } catch (e) {
      container.innerHTML = '<span style="color:#ff6b6b;">❌ Analysis failed: ' + e.message + '</span>';
    }
  }

  // ── Security Warning Overlay ──────────────────────

  async showSecurityWarning(riskResult, onProceed, onGoBack) {
    const overlay = document.getElementById('securityWarning');
    if (!overlay) return;

    document.getElementById('secWarningUrl').textContent = riskResult.url;
    document.getElementById('secWarningScore').textContent = riskResult.score + '/100';
    
    const descEl = document.getElementById('secWarningDesc');
    descEl.innerHTML = this.getWarningDescription(riskResult) + '<br><br><span style="color:var(--bharat-accent-primary);">🤖 Generating AI Analysis...</span>';

    overlay.classList.add('bharat-security-warning--visible');

    // Fetch AI Analysis asynchronously
    try {
      const aiExplanation = await this.shield.analyzeWithAI(riskResult.url, riskResult.factors);
      descEl.innerHTML = `<strong>🤖 AI Shield Assistant:</strong><br>${aiExplanation}`;
    } catch (e) {
      descEl.innerHTML = this.getWarningDescription(riskResult) + '<br><br><span style="color:var(--bharat-text-tertiary);">AI Analysis unavailable.</span>';
    }

    const goBackBtn = document.getElementById('secWarningGoBack');
    const proceedBtn = document.getElementById('secWarningProceed');

    const cleanup = () => {
      overlay.classList.remove('bharat-security-warning--visible');
      goBackBtn.replaceWith(goBackBtn.cloneNode(true));
      proceedBtn.replaceWith(proceedBtn.cloneNode(true));
    };

    document.getElementById('secWarningGoBack').addEventListener('click', () => {
      cleanup();
      if (onGoBack) onGoBack();
    });

    document.getElementById('secWarningProceed').addEventListener('click', () => {
      cleanup();
      if (onProceed) onProceed();
    });
  }

  getWarningDescription(risk) {
    const reasons = risk.factors
      .filter(f => f.severity === 'high')
      .map(f => f.desc)
      .slice(0, 3);
    
    if (reasons.length > 0) {
      return `Bharat Shield detected ${reasons.length} serious risk factor${reasons.length > 1 ? 's' : ''}: ${reasons.join('; ')}. This website may be trying to steal your personal information.`;
    }
    return 'This website has been flagged as potentially dangerous. Proceed with extreme caution.';
  }

  // ── Download Protection Dialog ────────────────────

  showDownloadWarning(downloadResult, onAllow, onBlock) {
    const dialog = document.getElementById('downloadShield');
    if (!dialog) return;

    document.getElementById('dlShieldFilename').textContent = downloadResult.filename;
    document.getElementById('dlShieldType').textContent = downloadResult.ext.toUpperCase();
    document.getElementById('dlShieldSource').textContent = (() => {
      try { return new URL(downloadResult.sourceUrl).hostname; }
      catch { return downloadResult.sourceUrl || 'Unknown'; }
    })();
    document.getElementById('dlShieldScore').textContent = `Risk: ${downloadResult.score}/100`;

    const risksContainer = document.getElementById('dlShieldRisks');
    risksContainer.innerHTML = downloadResult.risks.map(r =>
      `<div class="bharat-download-shield__risk-item">${r.icon} ${r.desc}</div>`
    ).join('');

    dialog.classList.add('bharat-download-shield--visible');

    const blockBtn = document.getElementById('dlShieldBlock');
    const allowBtn = document.getElementById('dlShieldAllow');

    const cleanup = () => {
      dialog.classList.remove('bharat-download-shield--visible');
      blockBtn.replaceWith(blockBtn.cloneNode(true));
      allowBtn.replaceWith(allowBtn.cloneNode(true));
    };

    document.getElementById('dlShieldBlock').addEventListener('click', () => {
      cleanup();
      if (onBlock) onBlock();
    });

    document.getElementById('dlShieldAllow').addEventListener('click', () => {
      cleanup();
      if (onAllow) onAllow();
    });
  }

  // ── New Threat Handler ────────────────────────────

  onNewThreat(threat) {
    // If dashboard is visible, update it
    const dashboardPage = document.getElementById('securityDashboard');
    if (dashboardPage && dashboardPage.classList.contains('bharat-security--active')) {
      this.renderStats();
      this.renderThreatLog();
    }
  }

  // ── Utilities ──────────────────────────────────────

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }
}
