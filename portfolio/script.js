#!/usr/bin/env node
/*jslint browser, devel, white*/

// browser - undeclared document, window
// devel - undeclared console
// white - use spaces, not tabs

const menuIcon = document.getElementById("menuIcon");
const menu = document.getElementById("menu");

menuIcon.addEventListener("click", function() {
	if (menu.style.display === "none" || menu.style.display === "") {
		menu.style.display = "block";
	} else {
		menu.style.display = "none";
	}
});

window.addEventListener("resize", function() {
	if (window.innerWidth >= 750) {
		menuIcon.style.display = "none";
		menu.style.display = "block";
	} else {
		menuIcon.style.display = "block";
		menu.style.display = "none";
	}
});

window.addEventListener("load", function() {
	if (window.innerWidth >= 750) {
		menuIcon.style.display = "none";
		menu.style.display = "block";
	} else {
		menuIcon.style.display = "block";
		menu.style.display = "none";
	}
});

const homeButton = document.getElementById("homeButton");
const hobbiesButton = document.getElementById("hobbiesButton");
const projectsButton = document.getElementById("projectsButton");

const homeImage = document.getElementById("homeImage");
const hobbiesImage = document.getElementById("hobbyImage");
const projectsImage = document.getElementById("projectImage");

homeButton.addEventListener("mouseenter", function() {
	homeImage.style.display = "block";
});
homeButton.addEventListener("mouseleave", function() {
	homeImage.style.display = "none";
});

hobbiesButton.addEventListener("mouseenter", function() {
	hobbiesImage.style.display = "block";
});
hobbiesButton.addEventListener("mouseleave", function() {
	hobbiesImage.style.display = "none";
});

projectsButton.addEventListener("mouseenter", function() {
	projectsImage.style.display = "block";
});
projectsButton.addEventListener("mouseleave", function() {
	projectsImage.style.display = "none";
});

const gallery = document.getElementById("gallery");
const imgPaths = [
	"images/bazy-danych.png",
	"images/muzyka.jpg",
	"images/raport.png",
	"images/sport.jpg",
	"images/szopdb.png",
	"images/trylma.png"
];

function loadImg(path) {
	return new Promise(function(resolve, reject) {
		const img = document.createElement("img");
		img.src = path;
		img.alt = "Galeria";
		img.onload = () =>
            resolve(img);
		img.onerror = () =>
            reject(new Error(`Nie udało się załadować pliku z ${path}`));
	});
}

Promise
	.all(imgPaths.map(loadImg))
	.then(function(images) {
        images.forEach(function(img) {
            gallery.appendChild(img);
        });
	})
	.catch(function(e) {
		console.error(e);
		gallery.textContent = "Wystąpił błąd przy ładowaniu zdjęć.";
	});