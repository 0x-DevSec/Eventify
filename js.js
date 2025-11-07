// store data
let events = [];
let archive = [];
let btnStats = document.querySelectorAll(".sidebar__btn");
let screens = document.querySelectorAll(".screen");

// switch screen
function switchScreen(btn) {
    const target = btn.dataset.screen;

    screens.forEach(screen => {
        if (screen.dataset.screen === target) {
            screen.classList.add("is-visible");
        } else {
            screen.classList.remove("is-visible");
        }
    });
}

btnStats.forEach(btn => {
    btn.addEventListener("click", () => switchScreen(btn));
});
