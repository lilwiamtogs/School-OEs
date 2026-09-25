const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-list');

if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
        navigation.classList.toggle('is-open');
    });
}

const drinkImage = document.querySelector('.featured-drink');
const drinkName = document.querySelector('.drink-name');
const drinkCount = document.querySelector('.drink-count');
const pauseButton = document.querySelector('.pause-button');
const previousButton = document.querySelector('.previous-drink');
const nextButton = document.querySelector('.next-drink');

if (drinkImage && drinkName && drinkCount && pauseButton && previousButton && nextButton) {
    const drinks = [
        ['images/1.png', 'Cloud Nine', 'Iced espresso layered over milk in a stemmed glass'],
        ['images/2.png', 'Matcha Orbit', 'Chilled green matcha drink in a tall stemmed glass'],
        ['images/latte-photo.png', 'Milky Way Latte', 'Iced latte in a clear glass inside a bright coffee shop'],
        ['images/milk-tea-replacement.png', 'Golden Hour', 'Classic milk tea with tapioca pearls in a sealed cup']
    ];

    let currentDrink = 0;
    let isPaused = false;

    function showDrink(number) {
        if (number < 0) {
            currentDrink = drinks.length - 1;
        } else if (number >= drinks.length) {
            currentDrink = 0;
        } else {
            currentDrink = number;
        }

        drinkImage.src = drinks[currentDrink][0];
        drinkName.textContent = drinks[currentDrink][1];
        drinkImage.alt = drinks[currentDrink][2];
        drinkCount.textContent = '0' + (currentDrink + 1) + ' / 04';
    }

    previousButton.addEventListener('click', function () {
        showDrink(currentDrink - 1);
    });

    nextButton.addEventListener('click', function () {
        showDrink(currentDrink + 1);
    });

    pauseButton.addEventListener('click', function () {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Play' : 'Pause';
    });

    setInterval(function () {
        if (!isPaused) {
            showDrink(currentDrink + 1);
        }
    }, 4000);
}

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        document.querySelector('.form-status').textContent = 'Thanks! This is a demo, so no message was sent.';
    });
}
