const AppConfig = {
  downloadUrl: "https://y.luoszs.uk/d/%E6%9D%82%E4%B8%83%E6%9D%82%E5%85%AD/%E5%B9%BB%E6%9C%88%E7%A9%BA%E9%97%B4_1.0.0.apk?sign=oNh5HnF_wzHVQHzRwdcbTmgZKIlpNIhHNvKWx-f8YtE=:0",
  links: {
    nav: [
      { icon: 'mdi-home', title: '官方网站', desc: '最新资讯 · 正版下载', url: 'https://www.qijisoft.com' },
      { icon: 'mdi-cloud', title: '官方网盘', desc: '网盘资源 & 海量下载', url: 'https://y.luoszs.uk' },
      { icon: 'mdi-forum', title: '官方社区', desc: '交流反馈 & 资源下载', url: 'https://h.luoszs.uk' },
      { icon: 'mdi-bullhorn', title: '活动中心', desc: '福利礼包 & 会员特权', url: 'https://event.qijisoft.com' },
      { icon: 'mdi-code-braces', title: '开发者博客', desc: '技术动态 & 版本规划', url: 'https://blog.qijisoft.com' },
      { icon: 'mdi-email', title: '客服支持', desc: '在线反馈 · 1v1服务', url: 'https://support.qijisoft.com' }
    ],
    rec: [
      { icon: 'mdi-music', name: '幻月音乐', desc: '无损音质 · 个性推荐', badge: '官方', url: 'https://music.qijisoft.com' },
      { icon: 'mdi-television', name: '幻月影视', desc: '海量片库 · 极速播放', badge: '热门', url: 'https://cms.luoszs.uk' },
      { icon: 'mdi-book-open-page-variant', name: '幻月阅读', desc: '小说漫画 · 沉浸体验', badge: '新', url: 'https://read.qijisoft.com' },
      { icon: 'mdi-toolbox', name: '幻月工具盒', desc: '实用小工具合集', badge: '必备', url: 'https://tools.qijisoft.com' }
    ]
  }
};

const LoadingManager = {
  element: null,
  
  init() {
    this.element = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
      setTimeout(() => this.hide(), 1500);
    });
  },
  
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
    }
  }
};

const DOMCache = {
  elements: {},
  
  get(id) {
    if (!this.elements[id]) {
      this.elements[id] = document.getElementById(id);
    }
    return this.elements[id];
  },
  
  selectAll(selector) {
    return document.querySelectorAll(selector);
  }
};

const Renderer = {
  renderNav() {
    const container = DOMCache.get('navGrid');
    if (!container) return;
    
    container.innerHTML = '';
    AppConfig.links.nav.forEach(item => {
      const card = this.createNavCard(item);
      container.appendChild(card);
    });
  },
  
  createNavCard(item) {
    const card = document.createElement('div');
    card.className = 'nav-card';
    card.setAttribute('data-url', item.url);
    card.setAttribute('data-title', item.title);
    card.setAttribute('data-icon', item.icon);
    card.innerHTML = `
      <div class="nav-icon"><i class="mdi ${item.icon}"></i></div>
      <div class="nav-title">${item.title}</div>
      <div class="nav-desc">${item.desc}</div>
    `;
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      ModalManager.showConfirm(item.url, item.title, item.icon);
    });
    return card;
  },
  
  renderRec() {
    const container = DOMCache.get('recGrid');
    if (!container) return;
    
    container.innerHTML = '';
    AppConfig.links.rec.forEach(item => {
      const card = this.createRecCard(item);
      container.appendChild(card);
    });
  },
  
  createRecCard(item) {
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.setAttribute('data-url', item.url);
    card.setAttribute('data-title', item.name);
    card.setAttribute('data-icon', item.icon);
    card.innerHTML = `
      <div class="rec-icon"><i class="mdi ${item.icon}"></i></div>
      <div class="rec-info">
        <div class="rec-name">${item.name}</div>
        <div class="rec-desc">${item.desc}</div>
      </div>
      <div class="rec-badge">${item.badge}</div>
    `;
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      ModalManager.showConfirm(item.url, item.name, item.icon);
    });
    return card;
  }
};

const ModalManager = {
  pendingUrl: '',
  
  init() {
    this.bindConfirmEvents();
    this.bindChangelogEvents();
  },
  
  bindConfirmEvents() {
    const cancelBtn = DOMCache.get('modalCancel');
    const confirmBtn = DOMCache.get('modalConfirm');
    const confirmModal = DOMCache.get('confirmModal');
    
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.hideConfirm());
    if (confirmBtn) confirmBtn.addEventListener('click', () => this.redirectToPending());
    if (confirmModal) {
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) this.hideConfirm();
      });
    }
  },
  
  bindChangelogEvents() {
    const changelogBtn = DOMCache.get('changelogBtn');
    const closeChangelogBtn = DOMCache.get('closeChangelogBtn');
    const changelogModal = DOMCache.get('changelogModal');
    
    if (changelogBtn) changelogBtn.addEventListener('click', () => this.showChangelog());
    if (closeChangelogBtn) closeChangelogBtn.addEventListener('click', () => this.hideChangelog());
    if (changelogModal) {
      changelogModal.addEventListener('click', (e) => {
        if (e.target === changelogModal) this.hideChangelog();
      });
    }
  },
  
  showConfirm(url, title, icon = 'mdi-link') {
    this.pendingUrl = url;
    const modalIcon = DOMCache.get('modalIcon');
    const modalTitle = DOMCache.get('modalTitle');
    const modalDesc = DOMCache.get('modalDesc');
    const modalUrlSpan = DOMCache.get('modalUrl');
    const confirmModal = DOMCache.get('confirmModal');
    
    if (modalIcon) modalIcon.innerHTML = `<i class="mdi ${icon}"></i>`;
    if (modalTitle) modalTitle.innerText = '访问确认';
    if (modalDesc) modalDesc.innerText = `您即将跳转到「${title}」页面`;
    if (modalUrlSpan) modalUrlSpan.innerText = url;
    if (confirmModal) confirmModal.classList.add('active');
  },
  
  hideConfirm() {
    const confirmModal = DOMCache.get('confirmModal');
    if (confirmModal) confirmModal.classList.remove('active');
    this.pendingUrl = '';
  },
  
  redirectToPending() {
    if (this.pendingUrl) {
      window.open(this.pendingUrl, '_blank');
      this.hideConfirm();
      Toast.show('已在新窗口打开链接');
    } else {
      this.hideConfirm();
    }
  },
  
  showChangelog() {
    const changelogModal = DOMCache.get('changelogModal');
    if (changelogModal) changelogModal.classList.add('active');
  },
  
  hideChangelog() {
    const changelogModal = DOMCache.get('changelogModal');
    if (changelogModal) changelogModal.classList.remove('active');
  }
};

const Toast = {
  show(msg) {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1A2C3E;color:white;padding:6px 18px;border-radius:40px;font-size:12px;z-index:1001;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }
};

const DownloadManager = {
  downloadTriggered: false,
  
  init() {
    const manualDownloadLink = DOMCache.get('manualDownloadLink');
    if (manualDownloadLink) {
      manualDownloadLink.href = AppConfig.downloadUrl;
    }
    
    const downloadBtn = DOMCache.get('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDownloadClick();
      });
    }
    
    const manualDownload = DOMCache.get('manualDownloadLink');
    if (manualDownload) {
      manualDownload.addEventListener('click', () => {
        Toast.show('正在打开下载链接...');
      });
    }
  },
  
  handleDownloadClick() {
    if (this.downloadTriggered) {
      this.showFallbackMessage();
      return;
    }
    this.startDownload();
  },
  
  showFallbackMessage() {
    const fallbackArea = DOMCache.get('fallbackArea');
    if (fallbackArea && fallbackArea.style.display !== 'block') {
      fallbackArea.style.display = 'block';
    }
  },
  
  performDownload() {
    try {
      const newWindow = window.open(AppConfig.downloadUrl, '_blank');
      if (newWindow === null || typeof newWindow === 'undefined') {
        this.showFallbackMessage();
        const statusMsgSpan = DOMCache.get('statusMsg');
        if (statusMsgSpan) statusMsgSpan.innerText = '弹窗被拦截，请点击手动下载';
        return false;
      }
      return true;
    } catch (err) {
      this.showFallbackMessage();
      const statusMsgSpan = DOMCache.get('statusMsg');
      if (statusMsgSpan) statusMsgSpan.innerText = '启动失败，使用备用链接';
      return false;
    }
  },
  
  startDownload() {
    this.downloadTriggered = true;
    const loadingIndicator = DOMCache.get('loadingIndicator');
    const successBadge = DOMCache.get('successBadge');
    const downloadBtn = DOMCache.get('downloadBtn');
    const statusMsgSpan = DOMCache.get('statusMsg');
    
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    if (successBadge) successBadge.style.display = 'none';
    if (downloadBtn) {
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px;"></div> 启动中...';
    }
    
    const success = this.performDownload();
    if (success) {
      if (statusMsgSpan) statusMsgSpan.innerText = '下载链接已打开，请稍候...';
      setTimeout(() => {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (successBadge) successBadge.style.display = 'flex';
        if (downloadBtn) downloadBtn.innerHTML = '✅ 下载已开始';
        setTimeout(() => {
          this.showFallbackMessage();
        }, 2000);
      }, 500);
    } else {
      if (statusMsgSpan) statusMsgSpan.innerText = '自动下载被拦截，请点击下方链接';
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      this.showFallbackMessage();
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<span>⚠️</span> 使用备用下载';
        downloadBtn.onclick = () => this.showFallbackMessage();
      }
    }
  }
};

const TabManager = {
  init() {
    const tabBtns = DOMCache.selectAll('.tab-btn');
    const panels = DOMCache.selectAll('.tab-panel');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(panel => panel.classList.remove('active-panel'));
        document.getElementById(targetId).classList.add('active-panel');
      });
    });
  }
};

const BrowserTip = {
  init() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('qq/') || ua.includes('micromessenger')) {
      this.showTip();
    }
  },
  
  showTip() {
    const tip = document.createElement('div');
    tip.style.cssText = 'background:#FFF7E5;border-radius:20px;padding:8px 12px;font-size:12px;margin-top:14px;color:#B45F06;';
    tip.innerHTML = '💡 当前浏览器可能限制下载，请点击右上角选择"在浏览器中打开"';
    const tabContainer = document.querySelector('.tab-container');
    if (tabContainer) {
      tabContainer.insertAdjacentElement('afterend', tip);
    }
  }
};

const App = {
  init() {
    LoadingManager.init();
    Renderer.renderNav();
    Renderer.renderRec();
    ModalManager.init();
    DownloadManager.init();
    TabManager.init();
    BrowserTip.init();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
