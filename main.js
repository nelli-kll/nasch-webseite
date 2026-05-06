
if (window.history.replaceState) {
  window.history.replaceState(null, "", window.location.href);
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  
  const loginForm     = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginError    = document.getElementById("login-error");

  const heroLogin     = document.getElementById("heroLogin");
  const loginToggle   = document.getElementById("loginToggle");
  const heroClose     = document.getElementById("heroClose");
  const heroCta       = document.getElementById("heroCta");
  const heroSection   = document.querySelector(".hero");

  
  if (heroSection) {
    // Hilfe mit chatgpt
    const heroSlides = ["assets/bilder/hero_slide_1.webp", "assets/bilder/hero_slide_2.webp", "assets/bilder/hero_slide_3.webp"];
    let heroIndex = 0;
    let heroTimer = null;
    let heroFadeTimeout = null;
    let heroIsFading = false;

    
    const heroImagePromises = new Map();
    const ensureImageLoaded = (src) => {
      if (heroImagePromises.has(src)) return heroImagePromises.get(src);
      const img = new Image();
      img.src = src;
      const p = (img.decode ? img.decode() : Promise.resolve()).catch(() => {});
      heroImagePromises.set(src, p);
      return p;
    };
    heroSlides.forEach(ensureImageLoaded);

    const heroDotsWrap = document.createElement("div");
    heroDotsWrap.className = "hero-dots";

    const heroDots = heroSlides.map((_, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hero-dot";
      btn.setAttribute("aria-label", `Hero-Bild ${idx + 1}`);
      btn.addEventListener("click", () => setHeroSlide(idx, true));
      heroDotsWrap.appendChild(btn);
      return btn;
    });

    heroSection.appendChild(heroDotsWrap);

    const applyHeroState = (idx) => {
      heroDots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === idx);
      });
    };

    const crossfadeTo = (nextIdx) => {
      if (nextIdx === heroIndex || heroIsFading) return;
      heroIsFading = true;
      if (heroFadeTimeout) clearTimeout(heroFadeTimeout);

      ensureImageLoaded(heroSlides[nextIdx]).then(() => {
        const currentIdx = heroIndex;
        heroIndex = nextIdx;
        applyHeroState(heroIndex); 

        heroSection.style.backgroundImage = `url("${heroSlides[currentIdx]}")`;
        heroSection.style.setProperty("--hero-next-image", `url("${heroSlides[nextIdx]}")`);
        heroSection.classList.add("hero-show-alt");

        heroFadeTimeout = setTimeout(() => {
          heroSection.classList.remove("hero-show-alt");
          heroSection.style.backgroundImage = `url("${heroSlides[nextIdx]}")`;
          heroIsFading = false;
        }, 1000);
      }).catch(() => {
        heroIsFading = false;
      });
    };

    const startHeroTimer = () => {
      if (heroTimer) clearInterval(heroTimer);
      heroTimer = setInterval(() => {
        if (!heroIsFading) {
          const next = (heroIndex + 1) % heroSlides.length;
          crossfadeTo(next);
        }
      }, 6500);
    };

    function setHeroSlide(idx, restartTimer) {
      crossfadeTo(idx);
      if (restartTimer) startHeroTimer();
    }

    // Hilfe mit chatgpt
    heroSection.style.backgroundImage = `url("${heroSlides[heroIndex]}")`;
    heroSection.style.setProperty("--hero-next-image", `url("${heroSlides[(heroIndex + 1) % heroSlides.length]}")`);
    applyHeroState(heroIndex);
    startHeroTimer();
  }

  const lockToggle    = document.getElementById("lockToggle");
  const logoutBtn     = document.getElementById("logout-btn");

  function toggleLogin(isLoggedIn) {
    if (isLoggedIn) {
      body.classList.remove("logged-out");
      body.classList.add("logged-in");
      if (typeof updateActiveNav === "function") {
        updateActiveNav();
      }
      body.classList.remove("hero-login-open");
      if (heroLogin) {
        heroLogin.classList.remove("is-open", "force-closed");
      }
    } else {
      body.classList.remove("logged-in");
      body.classList.add("logged-out");

      if (usernameInput) usernameInput.value = "";
      if (passwordInput) passwordInput.value = "";
      if (loginError)    loginError.textContent = "";
    }
  }

  
  toggleLogin(false);

  
  if (loginForm && usernameInput && passwordInput) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = usernameInput.value.trim();
      const pass = passwordInput.value;

      if (user === "Mitglied" && pass === "lecker") {
        toggleLogin(true);
      } else if (loginError) {
        loginError.textContent = "Benutzername oder Passwort ist falsch.";
      }
    });
  }

  function openLoginPanel() {
    if (!heroLogin) return;
    heroLogin.classList.remove("force-closed");
    heroLogin.classList.add("is-open");
    if (window.matchMedia("(max-width: 768px)").matches) {
      body.classList.add("hero-login-open");
    }
    if (loginToggle) {
      loginToggle.classList.add("loggedIn");
      loginToggle.setAttribute("aria-expanded", "true");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (usernameInput) {
      usernameInput.focus({ preventScroll: true });
    }
  }

  function closeLoginPanel() {
    if (!heroLogin) return;
    heroLogin.classList.remove("is-open");
    heroLogin.classList.add("force-closed");
    body.classList.remove("hero-login-open");
    if (loginToggle) {
      loginToggle.classList.remove("loggedIn");
      loginToggle.setAttribute("aria-expanded", "false");
    }
  }
  // Hilfe mit chatgpt
  if (heroLogin && loginToggle) {
    loginToggle.addEventListener("click", () => {
      const isLoggedIn = body.classList.contains("logged-in");

      if (isLoggedIn) {
        
        toggleLogin(false);
        closeLoginPanel();
        window.scrollTo({
          top: 0,
          behavior: "smooth"  
        });
      } else {
        
        const willOpen = !heroLogin.classList.contains("is-open");
        if (willOpen) {
          openLoginPanel();
        } else {
          closeLoginPanel();
        }
        window.scrollTo({
          top: 0,
          behavior: "smooth"  
        });
      }
    });
  }

  if (heroCta) {
    heroCta.addEventListener("click", () => {
      const isLoggedIn = body.classList.contains("logged-in");
      if (isLoggedIn) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const isOpen = heroLogin && heroLogin.classList.contains("is-open");
      if (isOpen) {
        closeLoginPanel();
      } else {
        openLoginPanel();
      }
    });
  }

  if (heroClose) {
    heroClose.addEventListener("click", () => {
      closeLoginPanel();
    });
  }


  const header    = document.querySelector(".site-header");
  const navLinks  = document.querySelectorAll('.main-nav a[href^="#"]');

  const navToggleBtn = document.getElementById("navToggle");
  const navList      = document.getElementById("main-nav-list");

  function setNavOpen(isOpen) {
    body.classList.toggle("nav-open", isOpen);
    if (navToggleBtn) {
      navToggleBtn.setAttribute("aria-expanded", String(isOpen));
    }
    if (navList) {
      navList.setAttribute("aria-hidden", String(!isOpen));
    }
  }

  setNavOpen(false);

  const navItems = Array.from(navLinks).map(link => {
    const id = link.getAttribute("href").substring(1);
    let section = document.getElementById(id);

    
    if (!section && id === "start") {
      section = document.querySelector(".hero") || document.getElementById("top");
    }

    return { link, section };
  }).filter(item => item.section);

  function updateActiveNav() {
    const headerHeight = header ? header.offsetHeight : 0;
    const scrollPos = window.scrollY + headerHeight + 40;

    let currentItem = null;

    for (const item of navItems) {
      const top = item.section.offsetTop;
      const bottom = top + item.section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        currentItem = item;
        break;
      }
    }

    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;

    if (nearBottom) {
      navLinks.forEach(link => link.classList.remove("nav-active"));
      const kontaktLink = document.querySelector('.main-nav a[href="#kontakt"]');
      if (kontaktLink) kontaktLink.classList.add("nav-active");
      return;
    }

    navLinks.forEach(link => link.classList.remove("nav-active"));
    if (currentItem) {
      currentItem.link.classList.add("nav-active");
    }
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  
  navItems.forEach(item => {
    item.link.addEventListener("click", (e) => {
      e.preventDefault();
      item.section.scrollIntoView({ behavior: "smooth", block: "start" });

      navLinks.forEach(link => link.classList.remove("nav-active"));
      item.link.classList.add("nav-active");
      setNavOpen(false);
    });
  });

  if (navToggleBtn && navList) {
    navToggleBtn.addEventListener("click", () => {
      const isOpen = body.classList.contains("nav-open");
      setNavOpen(!isOpen);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setNavOpen(false);
      }
    });
  }

  

  const siteHeader = document.querySelector(".site-header");

  function updateHeaderScrollState() {
    if (!siteHeader) return;

    if (window.scrollY > 25) {
      siteHeader.classList.add("header-scrolled");
    } else {
      siteHeader.classList.remove("header-scrolled");
    }
  }

  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState);

  
  const tagungSection = document.getElementById("tagung");
  const tagungLine = tagungSection ? tagungSection.querySelector(".timeline__line") : null;
  const mvSection = document.getElementById("mitgliederversammlung");
  const mvLine = mvSection ? mvSection.querySelector(".timeline__line") : null;

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  function updateTagungLineProgress() {
    if (!tagungSection || !tagungLine) return;

    const rect = tagungSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = rect.height || 1;

    const leadIn = viewportHeight * 0.35; 
    const progress = clamp((window.scrollY + viewportHeight - sectionTop - leadIn) / sectionHeight, 0, 1);
    tagungLine.style.setProperty("--tagung-progress", `${progress * 100}%`);
  }

  function updateMvLineProgress() {
    if (!mvSection || !mvLine) return;

    const rect = mvSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = rect.height || 1;

    const leadIn = viewportHeight * 0.35;
    const progress = clamp((window.scrollY + viewportHeight - sectionTop - leadIn) / sectionHeight, 0, 1);
    mvLine.style.setProperty("--mv-progress", `${progress * 100}%`);
  }

  window.addEventListener("scroll", updateTagungLineProgress);
  window.addEventListener("resize", updateTagungLineProgress);
  updateTagungLineProgress();

  window.addEventListener("scroll", updateMvLineProgress);
  window.addEventListener("resize", updateMvLineProgress);
  updateMvLineProgress();

  

  const successBox = document.getElementById("form-success");

  function wireSubmit(form) {
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();      
      form.reset();
      if (successBox) {
        successBox.style.display = "block";
        setTimeout(() => {
          successBox.style.display = "none";
        }, 3500);
      }
    });
  }

  const basicForm = document.getElementById("form-basic");
  const stepForm  = document.getElementById("anmeldung-form-logged-in");

  wireSubmit(basicForm);
  wireSubmit(stepForm);

  if (stepForm) {
    const step1     = stepForm.querySelector(".form-step-1");
    const step2     = stepForm.querySelector(".form-step-2");
    const nextBtn   = stepForm.querySelector("[data-next]");
    const prevBtn   = stepForm.querySelector("[data-prev]");
    const indicator = document.querySelector(".anmeldung-card-logged-in .anmeldung-step-indicator");

    
    if (nextBtn && step1 && step2) {
      nextBtn.addEventListener("click", () => {
        step1.classList.remove("active");
        step2.classList.add("active");
        if (indicator) indicator.textContent = "2/2";
      });
    }

    
    if (prevBtn && step1 && step2) {
      prevBtn.addEventListener("click", () => {
        step2.classList.remove("active");
        step1.classList.add("active");
        if (indicator) indicator.textContent = "1/2";
      });
    }
  }

});

document.addEventListener("DOMContentLoaded", () => {
  

  const backToTopBtn = document.getElementById("backToTop");

  function updateBackToTopVisibility() {
    if (!backToTopBtn) return;

    if (window.scrollY > 400) {
      backToTopBtn.classList.add("back-to-top--visible");
    } else {
      backToTopBtn.classList.remove("back-to-top--visible");
    }
  }

  if (backToTopBtn) {
    
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  
  window.addEventListener("scroll", updateBackToTopVisibility);
  updateBackToTopVisibility(); 
});


