let currentSlide = 0;

let slides = document.querySelectorAll(".slide");
let navButtons = document.querySelectorAll(".navButton");
let currentNumber = document.getElementById("currentNumber");

function showSlide(slideNumber) {
    slides[currentSlide].classList.remove("active");
    navButtons[currentSlide].classList.remove("active");

    currentSlide = slideNumber;

    slides[currentSlide].classList.add("active");
    navButtons[currentSlide].classList.add("active");
    currentNumber.innerHTML = currentSlide + 1;
}

function nextSlide() {
    let next = currentSlide + 1;

    if (next >= slides.length) {
        next = 0;
    }

    showSlide(next);
}