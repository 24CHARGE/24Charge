document.addEventListener("DOMContentLoaded", () => {
    // FAQ ACCORDION
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        if (!question) return;

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            faqItems.forEach((other) => other.classList.remove("active"));

            if (!isActive) {
                item.classList.add("active");
            }
        });
    });

    // NAVBAR SCROLL STATE
    const navbar = document.querySelector(".navbar");

    const updateNavbar = () => {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 30);
        }
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    // MOBILE MENU
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    const closeMobileMenu = () => {
        if (!menuToggle || !navMenu) return;
        navMenu.classList.remove("show");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = navMenu.classList.toggle("show");
            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    // DROPDOWNS
    const dropdowns = document.querySelectorAll(".dropdown");

    const closeDropdown = (dropdown) => {
        dropdown.classList.remove("active");
        const button = dropdown.querySelector(".dropdown-btn");
        if (button) button.setAttribute("aria-expanded", "false");
    };

    const closeAllDropdowns = (except = null) => {
        dropdowns.forEach((dropdown) => {
            if (dropdown !== except) closeDropdown(dropdown);
        });
    };

    dropdowns.forEach((dropdown) => {
        const button = dropdown.querySelector(".dropdown-btn");
        if (!button) return;

        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const willOpen = !dropdown.classList.contains("active");
            closeAllDropdowns(dropdown);
            dropdown.classList.toggle("active", willOpen);
            button.setAttribute("aria-expanded", String(willOpen));
        });

        dropdown.querySelectorAll(".dropdown-menu a").forEach((link) => {
            link.addEventListener("click", () => {
                closeDropdown(dropdown);
                if (window.innerWidth <= 768) closeMobileMenu();
            });
        });
    });

    // CLOSE MENUS WHEN CLICKING OUTSIDE
    document.addEventListener("click", (event) => {
        closeAllDropdowns();

        if (
            navMenu &&
            menuToggle &&
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // PRICE TABLE TOGGLE
    const priceToggleBtn = document.querySelector(".price-table-toggle");
    const priceTableWrap = document.querySelector(".price-table-wrap");
    const toggleLabel = priceToggleBtn?.querySelector(".toggle-label") ?? null;

    if (priceToggleBtn && priceTableWrap && toggleLabel) {
        priceToggleBtn.addEventListener("click", () => {
            const isOpen = priceTableWrap.classList.toggle("open");
            priceToggleBtn.setAttribute("aria-expanded", String(isOpen));

            const lang = document.documentElement.lang === "en" ? "en" : "th";
            const thText = isOpen ? "ซ่อนตารางราคา" : "ดูตารางราคาเต็ม";
            const enText = isOpen ? "Hide price table" : "View full price table";

            toggleLabel.textContent = lang === "en" ? enText : thText;
            toggleLabel.setAttribute("data-th", thText);
            toggleLabel.setAttribute("data-en", enText);
        });
    }

    // LANGUAGE SWITCHER (single TH / EN toggle)
    const langToggle = document.querySelector(".lang-toggle");
    const translatable = document.querySelectorAll("[data-th][data-en]");

    function setLanguage(lang) {
        const normalizedLang = lang === "en" ? "en" : "th";
        document.documentElement.lang = normalizedLang;

        translatable.forEach((element) => {
            const text = element.getAttribute(normalizedLang === "en" ? "data-en" : "data-th");
            if (text === null) return;

            if (element.getAttribute("data-html") === "true") {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        });

        if (langToggle) {
            const nextLang = normalizedLang === "en" ? "th" : "en";
            langToggle.dataset.lang = nextLang;
            langToggle.textContent = nextLang.toUpperCase();
            langToggle.setAttribute(
                "aria-label",
                nextLang === "en" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"
            );
        }

        try {
            localStorage.setItem("24charge-lang", normalizedLang);
        } catch (error) {
            // Storage can be unavailable in private browsing; the site still works.
        }
    }

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            setLanguage(langToggle.dataset.lang);
        });
    }

    let initialLang = "th";
    try {
        const saved = localStorage.getItem("24charge-lang");
        if (saved === "en" || saved === "th") initialLang = saved;
    } catch (error) {
        // Keep Thai as the default.
    }



    // TRANSLATE PLACEHOLDERS AND SELECT OPTIONS
    const updateDynamicLanguage = (lang) => {
        document.querySelectorAll('[data-placeholder-th][data-placeholder-en]').forEach((element) => {
            element.placeholder = element.getAttribute(lang === 'en' ? 'data-placeholder-en' : 'data-placeholder-th') || '';
        });

        document.querySelectorAll('option[data-th][data-en]').forEach((option) => {
            option.textContent = option.getAttribute(lang === 'en' ? 'data-en' : 'data-th') || option.textContent;
        });
    };

    // Wrap setLanguage so new form placeholders also change language.
    const originalSetLanguage = setLanguage;
    setLanguage = function(lang) {
        originalSetLanguage(lang);
        updateDynamicLanguage(lang === 'en' ? 'en' : 'th');
    };
    updateDynamicLanguage(document.documentElement.lang === 'en' ? 'en' : 'th');

    // PAGE SCROLL PROGRESS
    const progressBar = document.querySelector('.scroll-progress span');
    const updateScrollProgress = () => {
        if (!progressBar) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
        progressBar.style.width = `${percent}%`;
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    // SCROLL REVEAL
    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    // SUBTLE CARD TILT FOR POINTER DEVICES
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        document.querySelectorAll('.interactive-card').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    // RIPPLE FEEDBACK
    document.addEventListener('pointerdown', (event) => {
        const target = event.target.closest('.ripple-target');
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-ink';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        target.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });

    // HERO PLACEHOLDER SLIDER
    document.querySelectorAll('[data-slider]').forEach((slider) => {
        const slides = [...slider.querySelectorAll('[data-slide]')];
        const dots = [...slider.querySelectorAll('[data-slide-to]')];
        const prev = slider.querySelector('[data-slider-prev]');
        const next = slider.querySelector('[data-slider-next]');
        if (!slides.length) return;

        let current = 0;
        let timer = null;
        let startX = null;

        const showSlide = (index) => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === current);
                dot.setAttribute('aria-selected', String(i === current));
            });
        };

        const startAuto = () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            window.clearInterval(timer);
            timer = window.setInterval(() => showSlide(current + 1), 5200);
        };

        prev?.addEventListener('click', () => { showSlide(current - 1); startAuto(); });
        next?.addEventListener('click', () => { showSlide(current + 1); startAuto(); });
        dots.forEach((dot) => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slideTo)); startAuto(); }));

        slider.addEventListener('pointerenter', () => window.clearInterval(timer));
        slider.addEventListener('pointerleave', startAuto);
        slider.addEventListener('touchstart', (event) => { startX = event.touches[0]?.clientX ?? null; }, { passive: true });
        slider.addEventListener('touchend', (event) => {
            if (startX === null) return;
            const endX = event.changedTouches[0]?.clientX ?? startX;
            if (Math.abs(endX - startX) > 45) showSlide(current + (endX < startX ? 1 : -1));
            startX = null;
            startAuto();
        }, { passive: true });

        showSlide(0);
        startAuto();
    });

    // CURRENT NAV ITEM WHILE SCROLLING
    const sectionLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')].filter((link) => link.getAttribute('href').length > 1);
    if ('IntersectionObserver' in window) {
        const targets = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            sectionLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${visible.target.id}`));
        }, { rootMargin: '-35% 0px -55%', threshold: [0, .2, .5] });
        targets.forEach((section) => sectionObserver.observe(section));
    }

    // FLOATING ISSUE REPORTER
    const issueFab = document.querySelector('#issue-fab');
    const issuePanel = document.querySelector('#issue-panel');
    const issueBackdrop = document.querySelector('.issue-backdrop');
    const issueForm = document.querySelector('#issue-form');
    const issueStatus = document.querySelector('#issue-form-status');
    const siteToast = document.querySelector('#site-toast');
    let lastFocusedElement = null;
    let toastTimer = null;

    const showToast = (message) => {
        if (!siteToast) return;
        siteToast.textContent = message;
        siteToast.classList.add('is-visible');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => siteToast.classList.remove('is-visible'), 3200);
    };

    const openIssuePanel = () => {
        if (!issuePanel || !issueBackdrop || !issueFab) return;
        lastFocusedElement = document.activeElement;
        issueBackdrop.hidden = false;
        requestAnimationFrame(() => issueBackdrop.classList.add('is-open'));
        issuePanel.classList.add('is-open');
        issuePanel.setAttribute('aria-hidden', 'false');
        issueFab.setAttribute('aria-expanded', 'true');
        document.body.classList.add('issue-open');
        window.setTimeout(() => issuePanel.querySelector('input, select, textarea, button')?.focus(), 220);
    };

    const closeIssuePanel = () => {
        if (!issuePanel || !issueBackdrop || !issueFab) return;
        issuePanel.classList.remove('is-open');
        issuePanel.setAttribute('aria-hidden', 'true');
        issueFab.setAttribute('aria-expanded', 'false');
        issueBackdrop.classList.remove('is-open');
        document.body.classList.remove('issue-open');
        window.setTimeout(() => { issueBackdrop.hidden = true; }, 250);
        lastFocusedElement?.focus?.();
    };

    issueFab?.addEventListener('click', openIssuePanel);
    document.querySelectorAll('[data-open-issue]').forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            closeAllDropdowns();
            closeMobileMenu();
            openIssuePanel();
        });
    });
    document.querySelectorAll('[data-close-issue]').forEach((trigger) => trigger.addEventListener('click', closeIssuePanel));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && issuePanel?.classList.contains('is-open')) closeIssuePanel();
    });

    issueForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!issueForm.checkValidity()) {
            issueForm.reportValidity();
            return;
        }

        const endpoint = issueForm.getAttribute('action') || '';
        const lang = document.documentElement.lang === 'en' ? 'en' : 'th';
        if (!endpoint || endpoint.includes('YOUR_EMAIL@example.com')) {
            const message = lang === 'en'
                ? 'Please replace YOUR_EMAIL@example.com in index.html with your real support email first.'
                : 'กรุณาเปลี่ยน YOUR_EMAIL@example.com ใน index.html เป็นอีเมลรับแจ้งปัญหาจริงก่อน';
            issueStatus.textContent = message;
            issueStatus.className = 'issue-form-status is-error';
            showToast(message);
            return;
        }

        const submitButton = issueForm.querySelector('button[type="submit"]');
        const defaultLabel = submitButton?.querySelector('span')?.textContent || '';
        if (submitButton) {
            submitButton.disabled = true;
            const label = submitButton.querySelector('span');
            if (label) label.textContent = lang === 'en' ? 'Sending…' : 'กำลังส่ง…';
        }
        issueStatus.textContent = lang === 'en' ? 'Sending your report…' : 'กำลังส่งข้อมูล…';
        issueStatus.className = 'issue-form-status';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(issueForm),
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error('Submission failed');

            const success = lang === 'en'
                ? 'Report sent. Our team will get back to you soon.'
                : 'ส่งแจ้งปัญหาแล้ว ทีมงานจะติดต่อกลับโดยเร็ว';
            issueStatus.textContent = success;
            issueStatus.className = 'issue-form-status is-success';
            issueForm.reset();
            showToast(success);
            window.setTimeout(closeIssuePanel, 1300);
        } catch (error) {
            const failure = lang === 'en'
                ? 'Could not send the report. Please try again or use the contact section.'
                : 'ส่งไม่สำเร็จ กรุณาลองอีกครั้งหรือใช้ช่องทางในหน้าติดต่อเรา';
            issueStatus.textContent = failure;
            issueStatus.className = 'issue-form-status is-error';
            showToast(failure);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                const label = submitButton.querySelector('span');
                if (label) label.textContent = defaultLabel;
            }
        }
    });

    setLanguage(initialLang);
});


// Image placeholders for unfinished product photography.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-image-fallback]').forEach((image) => {
        const showFallback = () => {
            image.hidden = true;
            const fallback = image.nextElementSibling;
            if (fallback?.classList.contains('image-fallback')) fallback.hidden = false;
        };
        image.addEventListener('error', showFallback, { once: true });
        if (image.complete && image.naturalWidth === 0) showFallback();
    });
});
