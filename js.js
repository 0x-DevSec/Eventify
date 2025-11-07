// store data
let events = [];
let archive = [];

const btnStats = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");


//======================//
// 1- Switch Screen 
//=====================//

// attach click listeners
btnStats.forEach(btn => {
  btn.addEventListener("click", () => switchScreen(btn));
});

// switch screen function
function switchScreen(btn) {
  const target = btn.dataset.screen;

  // Hide all screens
  screens.forEach(screen => {
    screen.classList.remove("is-visible");
  });

  // Show the target screen
  const targetScreen = document.querySelector(`.screen[data-screen="${target}"]`);
  if (targetScreen) {
    targetScreen.classList.add("is-visible");
  }

  // Update active button
  btnStats.forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");

  // Update page header
  document.getElementById("page-title").textContent = btn.querySelector(".sidebar__label").textContent;
}
