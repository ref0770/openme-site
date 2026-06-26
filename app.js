// Google tag (gtag.js)
(function initGoogleAdsTag() {
  const tagId = 'AW-18272692455';
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;

  window.gtag('js', new Date());
  window.gtag('config', tagId);
})();

document.addEventListener('DOMContentLoaded',()=>{
  const cfg = window.OpenMeConfig || {};
  const lang = document.documentElement.lang || 'uk';
  const phoneHref = 'tel:+380800301521';
  const callDescription = lang.startsWith('ru') ? 'Звонки бесплатные' : 'Дзвінки безкоштовні';
  const phoneLabel = `<span class="mobile-call-main">0 800 301 521</span><span class="mobile-call-sub">${callDescription}</span>`;
  const telegramLabel = 'Telegram';
  const whatsappLabel = 'WhatsApp';

  // Replace phone and messenger links
  document.querySelectorAll('a[href*="{{PHONE}}"]').forEach(a=>a.href = `tel:${cfg.phone}`);
  document.querySelectorAll('a.phone').forEach(a=>{a.href = `tel:${cfg.phone}`; a.textContent = cfg.phoneDisplay});
  document.querySelectorAll('[href="{{TELEGRAM}}"]').forEach(a=>a.href = cfg.telegram);
  document.querySelectorAll('[href="{{WHATSAPP}}"]').forEach(a=>a.href = cfg.whatsapp);
  document.querySelectorAll('[id^="tg-"]').forEach(a=>a.href = cfg.telegram);
  document.querySelectorAll('[id^="wa-"]').forEach(a=>a.href = cfg.whatsapp);

  // Replace price placeholders
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PRICE_DOOR\}\}/g, cfg.prices.door);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PRICE_CAR\}\}/g, cfg.prices.car);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PRICE_SAFE\}\}/g, cfg.prices.safe);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PRICE_GARAGE\}\}/g, cfg.prices.garage);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PRICE_REPAIR\}\}/g, cfg.prices.repair);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PRICE_REPLACE\}\}/g, cfg.prices.replace);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PHONE_DISPLAY\}\}/g, cfg.phoneDisplay);
  document.body.innerHTML = document.body.innerHTML.replace(/\{\{PHONE\}\}/g, cfg.phone);

  // Mobile quick-action panel: ensure bottom call button and a top mobile messenger bar
  let existingMobileBar = document.querySelector('.mobile-call-bar');
  if (existingMobileBar) {
    existingMobileBar.innerHTML = `<a class="btn-call" href="${phoneHref}">${phoneLabel}</a>`;
  } else {
    const mobileBar = document.createElement('div');
    mobileBar.className = 'mobile-call-bar';
    mobileBar.innerHTML = `<a class="btn-call" href="${phoneHref}">${phoneLabel}</a>`;
    document.body.appendChild(mobileBar);
  }

  const messengerHtml = `
    <a class="messenger-btn messenger-btn--telegram telegram" href="${cfg.telegram}" target="_blank" rel="noopener">
      <span class="messenger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M21.9 4.4c.3-1.1-.7-2-1.7-1.6L3.3 9.3c-1.2.5-1.1 2.2.1 2.5l4.3 1.3 1.7 5.4c.4 1.2 1.9 1.4 2.6.4l2.5-3.5 4.6 3.4c.9.7 2.2.2 2.4-.9l3.4-13.5zM8.3 12.2l9.7-5.9-7.8 7.5-.3 3.2-1.6-4.8z"/>
        </svg>
      </span>
      <span>Telegram</span>
    </a>
    <a class="messenger-btn messenger-btn--whatsapp whatsapp" href="${cfg.whatsapp}" target="_blank" rel="noopener">
      <span class="messenger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12 2a9.8 9.8 0 0 0-8.5 14.7L2.4 22l5.4-1.4A9.9 9.9 0 1 0 12 2zm0 1.9a8 8 0 0 1 0 16 8.1 8.1 0 0 1-3.9-1l-.4-.2-3.1.8.8-3-.2-.4A8 8 0 0 1 12 3.9zm-3.2 4.2c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.3 2 3.2 5 4.3 2.5 1 3 .8 3.5.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.7-.4l-2-1c-.3-.1-.6-.1-.8.2l-.7.9c-.2.3-.4.3-.8.1-.4-.2-1.5-.6-2.8-1.8-1-1-1.7-2.1-1.9-2.4-.2-.4 0-.6.2-.8l.5-.6c.1-.2.2-.4.3-.6.1-.2 0-.5 0-.7l-.9-2.1c-.2-.5-.4-.5-.7-.5h-.6z"/>
        </svg>
      </span>
      <span>WhatsApp</span>
    </a>
  `;

  let messengerBar = document.querySelector('.mobile-messenger-bar');
  if (messengerBar) {
    messengerBar.innerHTML = messengerHtml;
    messengerBar.setAttribute('aria-label', 'Швидкий звʼязок');
  } else {
    const header = document.querySelector('.site-header');
    if (header) {
      const messenger = document.createElement('div');
      messenger.className = 'mobile-messenger-bar';
      messenger.setAttribute('aria-label', 'Швидкий звʼязок');
      messenger.innerHTML = messengerHtml;
      header.after(messenger);
    }
  }

  // determine viewport once (we won't dynamically re-create mobile header on resize)
  const isMobileViewport = window.matchMedia && window.matchMedia('(max-width:768px)').matches;

  const menuButtonLabel = lang.startsWith('ru') ? 'Открыть меню' : 'Відкрити меню';

  // Add mobile header actions only on mobile viewport (robust across pages)
  try {
    if (isMobileViewport) {
      // header container fallbacks
      const headerContainer = document.querySelector('.site-header .header-inner') || document.querySelector('.header-inner') || document.querySelector('.site-header') || document.querySelector('header');
      if (headerContainer) {
        let mobileHeaderActions = headerContainer.querySelector('.mobile-header-actions');
        if (!mobileHeaderActions) {
          mobileHeaderActions = document.createElement('div');
          mobileHeaderActions.className = 'mobile-header-actions';
          headerContainer.appendChild(mobileHeaderActions);
        }

        // ensure lang switcher inside mobile header
        const currentPath = normalizePath(window.location.pathname);
        const isCurrentRu = isRuPath(currentPath);
        const langMapLookup = cfg.languageMap && cfg.languageMap[currentPath];
        const uaHref = normalizePath(isCurrentRu ? (langMapLookup || '/') : currentPath);
        const ruHref = normalizePath(isCurrentRu ? currentPath : (langMapLookup || '/ru/'));

        const langSwitcherHtml = `
          <div class="mobile-lang-switcher" aria-label="Language switcher">
            <a href="${uaHref}"${isCurrentRu ? '' : ' class="active"'}>UA</a>
            <a href="${ruHref}"${isCurrentRu ? ' class="active"' : ''}>RU</a>
          </div>
        `;

        const existingMobileLang = mobileHeaderActions.querySelector('.mobile-lang-switcher');
        if (existingMobileLang) {
          existingMobileLang.outerHTML = langSwitcherHtml;
        } else {
          mobileHeaderActions.insertAdjacentHTML('afterbegin', langSwitcherHtml);
        }

        // If a .menu-toggle already exists anywhere, move it into header actions to avoid duplicates and ensure visibility
        const existingToggle = document.querySelector('.menu-toggle');
        if (existingToggle) {
          if (!existingToggle.closest('.mobile-header-actions')) {
            mobileHeaderActions.appendChild(existingToggle);
          }
          // ensure aria-label matches language
          try { existingToggle.setAttribute('aria-label', menuButtonLabel); } catch(e){}
          try { existingToggle.setAttribute('aria-expanded', existingToggle.getAttribute('aria-expanded') || 'false'); } catch(e){}
        } else {
          // create toggle only if none exists
          if (!mobileHeaderActions.querySelector('.menu-toggle')) {
            const btn = document.createElement('button');
            btn.className = 'menu-toggle';
            btn.type = 'button';
            btn.setAttribute('aria-label', menuButtonLabel);
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<span></span><span></span><span></span>';
            mobileHeaderActions.appendChild(btn);
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error adding mobile header actions', e);
  }

  const nav = document.querySelector('.main-nav');

  if (!nav) {
    console.warn('Mobile menu .main-nav not found');
  }

  const menuToggles = Array.from(document.querySelectorAll('.menu-toggle'));
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    menuToggles.forEach(toggle => {
      toggle.classList.remove('is-active');
      try { toggle.setAttribute('aria-expanded', 'false'); } catch (e) {}
    });
  }

  function openMenu() {
    if (!nav) return;
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    menuToggles.forEach(toggle => {
      toggle.classList.add('is-active');
      try { toggle.setAttribute('aria-expanded', 'true'); } catch (e) {}
    });
  }

  menuToggles.forEach(toggle => {
    if (toggle.dataset.menuHandlerAttached) return;
    const handler = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!nav) return;
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };
    toggle.addEventListener('click', handler);
    toggle.dataset.menuHandlerAttached = '1';
  });

  function updateCallBar() {
    const callBar = document.querySelector('.mobile-call-bar');
    if (!callBar) return;
    if (window.innerWidth > 768 || document.body.classList.contains('nav-open')) {
      callBar.classList.remove('is-visible');
      return;
    }

    const heroCta = document.querySelector('.page-hero .cta, .page-hero .btn-primary, .hero-actions a[href^="tel:"], .hero-actions .btn-primary');
    if (!heroCta) {
      callBar.classList.add('is-visible');
      return;
    }

    const rect = heroCta.getBoundingClientRect();
    const heroVisible = rect.bottom > 0 && rect.top < window.innerHeight * 0.75;
    callBar.classList.toggle('is-visible', !heroVisible);
  }

  window.addEventListener('scroll', updateCallBar, { passive: true });
  window.addEventListener('resize', updateCallBar);
  window.addEventListener('transitionend', updateCallBar);
  updateCallBar();

  document.addEventListener('click', (event) => {
    if (!nav) return;
    const link = event.target.closest && event.target.closest('.main-nav a');
    if (!link) return;
    closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Add mobile menu language switcher if on mobile viewport
  const currentPathForMenu = normalizePath(window.location.pathname);
  const isRuForMenu = isRuPath(currentPathForMenu);
  const langMapForMenu = cfg.languageMap || {};

  const uaHrefForMenu = normalizePath(isRuForMenu ? (langMapForMenu[currentPathForMenu] || '/') : currentPathForMenu);
  const ruHrefForMenu = normalizePath(isRuForMenu ? currentPathForMenu : (langMapForMenu[currentPathForMenu] || '/ru/'));

  const mobileMenuLangHtml = `
    <div class="mobile-menu-lang">
      <a href="${uaHrefForMenu}"${isRuForMenu ? '' : ' class="active"'}>UA</a>
      <a href="${ruHrefForMenu}"${isRuForMenu ? ' class="active"' : ''}>RU</a>
    </div>
  `;

  // Add language switcher to mobile menu only on mobile
  try {
    if (isMobileViewport && nav) {
      const existingMobileLang = nav.querySelector('.mobile-menu-lang');
      if (!existingMobileLang) {
        nav.insertAdjacentHTML('beforeend', mobileMenuLangHtml);
      }
    }
  } catch (e) {
    console.warn('Error adding mobile menu language switcher', e);
  }

  // Add mobile menu contacts only on mobile
  const mobileMenuContactHtml = `
    <div class="mobile-menu-contact">
      <span>${lang.startsWith('ru') ? 'Быстрый вызов' : 'Швидкий виклик'}</span>
      <a href="tel:${cfg.phone}">${cfg.phoneDisplay}</a>
      <a href="${cfg.telegram}" target="_blank" rel="noopener">Telegram</a>
      <a href="${cfg.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  `;

  try {
    if (isMobileViewport && nav) {
      const existingMobileContact = nav.querySelector('.mobile-menu-contact');
      if (!existingMobileContact) {
        nav.insertAdjacentHTML('beforeend', mobileMenuContactHtml);
      }
    }
  } catch (e) {
    console.warn('Error adding mobile menu contacts', e);
  }
  // Language switcher logic
  function normalizePath(path){
    let normalized = path.split('?')[0].split('#')[0];
    if(normalized.endsWith('/index.html')){
      normalized = normalized.slice(0, -10);
    }
    if(normalized === ''){
      normalized = '/';
    }
    if(normalized !== '/' && !normalized.endsWith('/')){
      normalized += '/';
    }
    return normalized;
  }

  function isRuPath(path){
    return path === '/ru/' || path === '/ru' || path.startsWith('/ru/');
  }

  function getLanguageSwitcherHtml(){
    const currentPath = normalizePath(window.location.pathname);
    const isRu = isRuPath(currentPath);
    const langMap = cfg.languageMap || {};

    const uaHref = normalizePath(isRu ? (langMap[currentPath] || '/') : currentPath);
    const ruHref = normalizePath(isRu ? currentPath : (langMap[currentPath] || '/ru/'));

    const uaLink = `<a href="${uaHref}"${isRu ? '' : ' class="active"'}>UA</a>`;
    const ruLink = `<a href="${ruHref}"${isRu ? ' class="active"' : ''}>RU</a>`;

    return `<div class="language-switcher" aria-label="Language switcher">${uaLink}${ruLink}</div>`;
  }

  // Inject language switcher in desktop header only (do not duplicate existing)
  let headerContacts = document.querySelector('.header-contacts');
  if(!headerContacts){
    const headerInner = document.querySelector('.site-header .header-inner') || document.querySelector('.site-header');
    if(headerInner){
      headerContacts = document.createElement('div');
      headerContacts.className = 'header-contacts';
      headerContacts.innerHTML = `<a class="phone" href="tel:${cfg.phone}">${cfg.phoneDisplay}</a><a class="cta" href="tel:${cfg.phone}">${phoneLabel}</a>`;
      headerInner.appendChild(headerContacts);
    }
  }

  if(headerContacts){
    const existingHeaderSwitcher = headerContacts.querySelector('.language-switcher');
    if(existingHeaderSwitcher){
      // replace with consistent markup and mark as desktop-specific
      existingHeaderSwitcher.outerHTML = getLanguageSwitcherHtml().replace('class="language-switcher"','class="language-switcher desktop-language-switcher"');
    } else {
      const phoneLink = headerContacts.querySelector('a.phone');
      const insertHtml = getLanguageSwitcherHtml().replace('class="language-switcher"','class="language-switcher desktop-language-switcher"');
      if(phoneLink){
        phoneLink.insertAdjacentHTML('beforebegin', insertHtml);
      } else {
        headerContacts.insertAdjacentHTML('beforeend', insertHtml);
      }
    }
  }

  // Remove any language switcher present in main nav (textual duplicate) when headerContacts provides one
  try {
    if (headerContacts && headerContacts.querySelector('.language-switcher')) {
      const navLang = document.querySelector('.main-nav .language-switcher');
      if (navLang && !navLang.closest('.mobile-menu-lang')) {
        // remove the duplicate language switcher from navigation
        const navLangLi = navLang.closest('li') || navLang;
        navLangLi.remove();
      }
    }
  } catch (e) {
    console.warn('Error cleaning nav language switcher', e);
  }

  // Replace any hardcoded telegram/whatsapp links across the page at runtime
  document.querySelectorAll('a[href*="t.me/"]').forEach(a=>a.href = cfg.telegram);
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>a.href = cfg.whatsapp);

  // Remove prices block & menu link on district (raiony) pages
  try {
    const pathForDistricts = normalizePath(window.location.pathname);
    const isDistrictPage = pathForDistricts === '/raiony/' || pathForDistricts.startsWith('/raiony/') || pathForDistricts === '/ru/raiony/' || pathForDistricts.startsWith('/ru/raiony/');
    if (isDistrictPage) {
      const pricesEl = document.getElementById('prices');
      if (pricesEl) {
        pricesEl.remove();
      }
      // remove menu link to #prices if present
      document.querySelectorAll('.main-nav a[href="#prices"]').forEach(a=>{
        const li = a.closest('li'); if(li) li.remove(); else a.remove();
      });
    }
  } catch (e) {
    console.warn('Error removing prices on district pages', e);
  }

  // Convert legacy anchor-based situation cards into non-link article problem-cards
  document.querySelectorAll('a.situation-card').forEach(a => {
    const article = document.createElement('article');
    article.className = 'problem-card';
    article.innerHTML = a.innerHTML;
    a.replaceWith(article);
  });

  // Ensure body doesn't scroll when nav open
  window.addEventListener('beforeunload', ()=>document.body.classList.remove('nav-open'));
});
