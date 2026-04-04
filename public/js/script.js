// Mobile Menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
if (hamburger && navMenu) {
	hamburger.addEventListener("click", () => {
		hamburger.classList.toggle("active");
		navMenu.classList.toggle("active");
	});
}

// Close navbar when link is clicked
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((n) => n.addEventListener("click", () => {
	if (hamburger && navMenu) {
		hamburger.classList.remove("active");
		navMenu.classList.remove("active");
	}
}));

// Theme Switcher Logic
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
	document.documentElement.setAttribute("data-theme", currentTheme);
	if (currentTheme === "dark" && toggleSwitch) {
		toggleSwitch.checked = true;
	}
}

function switchTheme(e) {
	const theme = e.target.checked ? 'dark' : 'light';
	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem('theme', theme);
}

if (toggleSwitch) {
	toggleSwitch.addEventListener("change", switchTheme, false);
}

// Sync theme across tabs
window.addEventListener('storage', (e) => {
	if (e.key === 'theme') {
		const theme = e.newValue || 'light';
		document.documentElement.setAttribute("data-theme", theme);
		if (toggleSwitch) toggleSwitch.checked = (theme === 'dark');
	}
});

// Scroll Reveal Observer
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("active");
		}
	});
}, { threshold: 0.1 });

revealElements.forEach((el) => revealObserver.observe(el));

// Footer Date
const dateSpan = document.querySelector("#datee");
if (dateSpan) {
	dateSpan.innerText = new Date().getFullYear();
}