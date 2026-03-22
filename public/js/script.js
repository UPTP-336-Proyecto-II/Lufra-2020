// Migrado desde ProyectoUni/assets/js/script.js

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
if (hamburger && navMenu) {
	hamburger.addEventListener("click", mobileMenu);
}

function mobileMenu() {
	hamburger.classList.toggle("active");
	navMenu.classList.toggle("active");
}

// Close navbar when link is clicked

const navLink = document.querySelectorAll(".nav-link");
if (navLink && navLink.length && hamburger && navMenu) {
	navLink.forEach((n) => n.addEventListener("click", closeMenu));
}

function closeMenu() {
	hamburger.classList.remove("active");
	navMenu.classList.remove("active");
}

// Event Listeners: Handling toggle event

const toggleSwitch = document.querySelector(
	'.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute("data-theme", "dark");
	} else {
		document.documentElement.setAttribute("data-theme", "light");
	}
}

if (toggleSwitch) {
	toggleSwitch.addEventListener("change", switchTheme, false);
}

//  Store color theme for future visits

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute("data-theme", "dark");
		localStorage.setItem('theme','dark');
	} else {
		document.documentElement.setAttribute("data-theme", "light");
		localStorage.setItem('theme','light');
	}
}

// Load theme preference from local storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
	document.documentElement.setAttribute("data-theme", currentTheme);
	if (currentTheme === "dark" && toggleSwitch) {
		toggleSwitch.checked = true;
	}
}

window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        const t = e.newValue || 'light';
        document.documentElement.setAttribute("data-theme", t);
        if (toggleSwitch) toggleSwitch.checked = (t === 'dark');
    }
});

//Adding date


let myDate = document.querySelector("#datee");
const yes = new Date().getFullYear();
if (myDate) {
	myDate.innerHTML = yes;
}