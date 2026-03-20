// Migrado desde ProyectoUni/assets/js/script.js
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
	hamburger.classList.toggle("active");
	navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

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

toggleSwitch.addEventListener("change", switchTheme, false);

//  Store color theme for future visits

function setCookie(name, value, days = 365) {
	const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}
function getCookie(name) {
	const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
	return v ? decodeURIComponent(v.pop()) : null;
}
function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute("data-theme", "dark");
		setCookie('theme','dark');
	} else {
		document.documentElement.setAttribute("data-theme", "light");
		setCookie('theme','light');
	}
}

// Load theme preference from cookie
const currentTheme = getCookie('theme');
if (currentTheme) {
	document.documentElement.setAttribute("data-theme", currentTheme);
	if (currentTheme === "dark") {
		toggleSwitch.checked = true;
	}
}

//Adding date

let myDate = document.querySelector("#datee");

const yes = new Date().getFullYear();
myDate.innerHTML = yes;
