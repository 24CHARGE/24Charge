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

// DROPDOWN

const dropdown = document.querySelector(".dropdown");
const btn = document.querySelector(".dropdown-btn");

btn.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("active");
});

// CLOSE MENUS WHEN CLICKING OUTSIDE

document.addEventListener("click", (e) => {

    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
    }

    if (
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
    ) {
        navMenu.classList.remove("show");
        menuToggle.classList.remove("active");
    }

});