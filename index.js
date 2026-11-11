/**
 * ═══════════════════════════════════════════════════════════════
 * PERSONAL DEVELOPER PORTFOLIO - CORE ENGINE
 * Muhammad Abid Mansoori — Full-Stack Software Developer
 * ═══════════════════════════════════════════════════════════════
 */

// ─── 1. XSS SANITIZATION HELPER ────────────────────────────────
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ─── 2. MOBILE MENU DRAWER CONTROLLER ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggleBtn && mobileDrawer) {
    const toggleMenu = (open) => {
      const isCurrentlyOpen = !mobileDrawer.classList.contains('hidden');
      const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

      if (shouldOpen) {
        mobileDrawer.classList.remove('hidden');
        menuToggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileDrawer.classList.add('hidden');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      }
    };

    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close on any drawer link click
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileDrawer.classList.contains('hidden')) {
        toggleMenu(false);
        menuToggleBtn.focus();
      }
    });
  }

  // ─── 3. ACTIVE SECTION HIGHLIGHT ON SCROLL ───────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[data-path]');

  const highlightNav = () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('bg-ink-black', 'text-on-primary', 'font-bold', 'shadow-[2px_2px_0px_#000000]');
            link.classList.remove('border-transparent', 'text-on-surface-variant');
          } else {
            link.classList.remove('bg-ink-black', 'text-on-primary', 'font-bold', 'shadow-[2px_2px_0px_#000000]');
            link.classList.add('border-transparent', 'text-on-surface-variant');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // ─── 4. GITHUB REPOSITORIES DYNAMIC INTEGRATION ───────────────
  loadGitHubRepos();

  // ─── 5. CONTACT FORM HANDLING ────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
});

// ─── 6. DYNAMIC GITHUB REPOSITORIES LOADER WITH CACHING ────────
async function loadGitHubRepos() {
  const container = document.getElementById('github-repos-container');
  if (!container) return;

  const CACHE_KEY = 'abid_gh_repos_v2';
  const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

  // Check LocalStorage cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY && Array.isArray(parsed.data)) {
        renderRepos(parsed.data, container);
        return;
      }
    }
  } catch (err) {
    console.warn('Cache read error:', err);
  }

  // Fetch from GitHub REST API
  try {
    const response = await fetch('https://api.github.com/users/dev-muhammadabid/repos?sort=updated&per_page=6');
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
    const repos = await response.json();

    // Cache valid data
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: repos })
      );
    } catch (e) {
      // Storage quota or disabled
    }

    renderRepos(repos, container);
  } catch (error) {
    console.warn('GitHub API fetch failed, rendering curated fallback:', error.message);
    renderFallbackRepos(container);
  }
}

function renderRepos(repos, container) {
  if (!repos || !repos.length) {
    renderFallbackRepos(container);
    return;
  }

  const itemsHtml = repos
    .filter(r => !r.fork && r.name !== 'dev-muhammadabid')
    .slice(0, 6)
    .map((repo) => {
      const name = sanitizeInput(repo.name);
      const desc = sanitizeInput(repo.description || 'Open-source software repository.');
      const lang = sanitizeInput(repo.language || 'Code');
      const stars = repo.stargazers_count || 0;
      const url = sanitizeInput(repo.html_url);

      return `
        <div class="bg-surface-paper-light border-3 border-border-black p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div class="flex items-center justify-between gap-2 pb-2 mb-2 border-b-2 border-border-black">
              <span class="font-headline-sm text-sm font-extrabold text-ink-black truncate">${name}</span>
              <a href="${url}" target="_blank" rel="noopener noreferrer" class="p-1 bg-secondary-container border border-border-black hover:bg-primary-container" title="Open repository">
                <span class="material-symbols-outlined text-[16px] block text-ink-black">open_in_new</span>
              </a>
            </div>
            <p class="font-body-sm text-xs text-on-surface-variant line-clamp-2 mb-3">${desc}</p>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-border-black font-label-code-sm text-[11px]">
            <span class="font-bold text-ink-black bg-surface-paper px-2 py-0.5 border border-border-black">${lang}</span>
            <span class="flex items-center gap-1 font-extrabold text-ink-black">★ ${stars}</span>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${itemsHtml}
    </div>
  `;
}

function renderFallbackRepos(container) {
  const fallbackData = [
    { name: 'DevSleuth', desc: 'AI-assisted hybrid code review platform combining static analysis with LLM reasoning.', lang: 'Java / Spring', url: 'https://github.com/dev-muhammadabid/DevSleuth' },
    { name: 'AapdaVision-AI', desc: 'Real-time multi-hazard disaster intelligence & predictive forecasting platform.', lang: 'Java / Python', url: 'https://github.com/dev-muhammadabid/AapdaVision-AI' },
    { name: 'VaultLock', desc: 'Secure client-side encrypted document vault with zero-knowledge architecture.', lang: 'JavaScript', url: 'https://github.com/dev-muhammadabid/VaultLock' },
    { name: 'AiShorts', desc: 'Real-time WebSocket chatbot integrated with Google Gemini API for fast AI answers.', lang: 'JavaScript', url: 'https://github.com/dev-muhammadabid/AiShorts' },
    { name: 'Shayraana', desc: 'Social publishing platform for writers, poets, and literature enthusiasts.', lang: 'Full-Stack', url: 'https://github.com/dev-muhammadabid/Shayraana' },
    { name: 'PacMan', desc: 'Modernized classic PacMan with AI enemies using BFS and Monte Carlo simulation.', lang: 'Java', url: 'https://github.com/dev-muhammadabid/PacMan' }
  ];

  const items = fallbackData.map(r => `
    <div class="bg-surface-paper-light border-3 border-border-black p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:-translate-y-1 transition-transform">
      <div>
        <div class="flex items-center justify-between gap-2 pb-2 mb-2 border-b-2 border-border-black">
          <span class="font-headline-sm text-sm font-extrabold text-ink-black">${sanitizeInput(r.name)}</span>
          <a href="${sanitizeInput(r.url)}" target="_blank" rel="noopener noreferrer" class="p-1 bg-secondary-container border border-border-black hover:bg-primary-container">
            <span class="material-symbols-outlined text-[16px] block text-ink-black">open_in_new</span>
          </a>
        </div>
        <p class="font-body-sm text-xs text-on-surface-variant line-clamp-2 mb-3">${sanitizeInput(r.desc)}</p>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-border-black font-label-code-sm text-[11px]">
        <span class="font-bold text-ink-black bg-surface-paper px-2 py-0.5 border border-border-black">${sanitizeInput(r.lang)}</span>
        <span class="font-bold text-on-surface-variant">Active</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${items}</div>`;
}

// ─── 7. CONTACT FORM HANDLER WITH SECURE CLIENT-SIDE DISPATCH ──
function handleContactSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('contact_name');
  const emailInput = document.getElementById('contact_email');
  const messageInput = document.getElementById('contact_message');
  const submitBtn = document.getElementById('submitBtn');

  if (!nameInput || !emailInput || !messageInput || !submitBtn) return;

  const rawName = nameInput.value.trim();
  const rawEmail = emailInput.value.trim();
  const rawMessage = messageInput.value.trim();

  // Validate format and length
  if (rawName.length < 2 || rawName.length > 80) {
    alert('Please enter a valid name (2 to 80 characters).');
    nameInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(rawEmail) || rawEmail.length > 100) {
    alert('Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  if (rawMessage.length < 5 || rawMessage.length > 3000) {
    alert('Please enter a message between 5 and 3000 characters.');
    messageInput.focus();
    return;
  }

  // Sanitized values
  const cleanName = sanitizeInput(rawName);
  const cleanEmail = sanitizeInput(rawEmail);
  const cleanMessage = sanitizeInput(rawMessage);

  // Disable UI and show sending feedback
  submitBtn.disabled = true;
  const originalHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span>Dispatching...</span><span class="material-symbols-outlined text-[20px] animate-spin">refresh</span>`;

  // Trigger mailto protocol as fallback or standard open
  const mailtoSubject = encodeURIComponent(`Portfolio Inquiry from ${rawName}`);
  const mailtoBody = encodeURIComponent(`Hi Abid,\n\n${rawMessage}\n\nFrom: ${rawName} (${rawEmail})`);
  const mailtoUrl = `mailto:mail.muhammadabid@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  setTimeout(() => {
    // Open default email client
    window.location.href = mailtoUrl;

    submitBtn.innerHTML = `<span>Sent Successfully ✓</span><span class="material-symbols-outlined text-[20px]">check</span>`;
    submitBtn.classList.remove('bg-primary-container');
    submitBtn.classList.add('bg-secondary-container');

    // Reset form fields
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      submitBtn.classList.remove('bg-secondary-container');
      submitBtn.classList.add('bg-primary-container');
    }, 4000);
  }, 400);
}

// Global console greeting
console.log(
  "%c[SYSTEM_INIT] Muhammad Abid Mansoori | Full-Stack Software Developer\n%cNeo-Brutalist Architecture & High-Performance Engineering\nContact: mail.muhammadabid@gmail.com | https://github.com/dev-muhammadabid",
  "background: #000; color: #4edea3; font-weight: bold; font-size: 14px; padding: 4px;",
  "color: #1c1b1b; font-size: 11px;"
);
