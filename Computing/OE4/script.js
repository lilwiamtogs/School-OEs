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
    showSlide((currentSlide + 1) % slides.length);
}

let lastGestureTime = 0;

function moveSlideByGesture(direction) {
    let now = Date.now();

    if (now - lastGestureTime < 600) {
        return;
    }

    lastGestureTime = now;
    showSlide((currentSlide + direction + slides.length) % slides.length);
}

window.addEventListener("wheel", function (event) {
    if (Math.abs(event.deltaY) >= 10) {
        moveSlideByGesture(event.deltaY > 0 ? 1 : -1);
    }
}, { passive: true });

let touchStartY = null;

window.addEventListener("touchstart", function (event) {
    touchStartY = event.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", function (event) {
    if (touchStartY === null) {
        return;
    }

    let distance = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;

    if (Math.abs(distance) >= 50) {
        moveSlideByGesture(distance > 0 ? 1 : -1);
    }
}, { passive: true });
