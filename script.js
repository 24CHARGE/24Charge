// FAQ ACCORDION

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        faqItems.forEach((other) => other.classList.remove("active"));

        if (!isActive) {
            item.classList.add("active");
        }
    });
});

// MOBILE MENU

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuToggle.classList.toggle("active");
});

// DROPDOWNS (สำหรับผู้ใช้งาน / สำหรับพาร์ทเนอร์ / เกี่ยวกับเรา)

const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropdown-btn");

    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const isActive = dropdown.classList.contains("active");

        dropdowns.forEach((other) => other.classList.remove("active"));

        if (!isActive) {
            dropdown.classList.add("active");
        }
    });
});

// CLOSE MENUS WHEN CLICKING OUTSIDE

document.addEventListener("click", (e) => {

    dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });

    if (
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
    ) {
        navMenu.classList.remove("show");
        menuToggle.classList.remove("active");
    }

});

// PRICE TABLE TOGGLE

const priceToggleBtn = document.querySelector(".price-table-toggle");
const priceTableWrap = document.querySelector(".price-table-wrap");
const toggleLabel = priceToggleBtn ? priceToggleBtn.querySelector(".toggle-label") : null;

if (priceToggleBtn && priceTableWrap && toggleLabel) {

    priceToggleBtn.addEventListener("click", () => {

        const isOpen = priceTableWrap.classList.toggle("open");

        priceToggleBtn.setAttribute("aria-expanded", isOpen);

        const lang = document.documentElement.getAttribute("lang") === "en" ? "en" : "th";

        if (isOpen) {
            toggleLabel.textContent = lang === "en" ? "Hide price table" : "ซ่อนตารางราคา";
        } else {
            toggleLabel.textContent = lang === "en" ? "View full price table" : "ดูตารางราคาเต็ม";
        }

        // keep the data attributes in sync so re-toggling language works correctly
        toggleLabel.setAttribute("data-th", isOpen ? "ซ่อนตารางราคา" : "ดูตารางราคาเต็ม");
        toggleLabel.setAttribute("data-en", isOpen ? "Hide price table" : "View full price table");

    });

}

// LANGUAGE SWITCHER (TH / EN)

const langButtons = document.querySelectorAll(".lang-btn");
const translatable = document.querySelectorAll("[data-th][data-en]");

function setLanguage(lang) {

    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "th");

    translatable.forEach((el) => {
        const text = el.getAttribute(lang === "en" ? "data-en" : "data-th");
        if (text === null) return;

        if (el.getAttribute("data-html") === "true") {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    });

    langButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    try {
        localStorage.setItem("24charge-lang", lang);
    } catch (err) {
        // localStorage unavailable — ignore, language just won't persist
    }
}

langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        setLanguage(btn.getAttribute("data-lang"));
    });
});

// initialise: default to Thai, or restore a saved preference
let initialLang = "th";
try {
    const saved = localStorage.getItem("24charge-lang");
    if (saved === "en" || saved === "th") {
        initialLang = saved;
    }
} catch (err) {
    // ignore
}

setLanguage(initialLang);