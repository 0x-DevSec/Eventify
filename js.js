// Variables

let events = [];
let archive = [];
let variantCounter = 0;

const btnStats = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");

const eventForm = document.getElementById("event-form");
const statTotalEvents = document.getElementById("stat-total-events");
const statTotalSeats = document.getElementById("stat-total-seats");
const statTotalPrice = document.getElementById("stat-total-price");

const listdata = document.querySelector(".table__body");




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

//======================//
// 2 - Add Event form & stats 
//=====================//

function updateStats() {
    const totalEvents = events.length;
    let totalSeats = 0;
    let totalRevenue = 0;

    for (let i = 0; i < events.length; i++) {
        totalSeats = totalSeats + events[i].seats;
        totalRevenue = totalRevenue + events[i].seats * events[i].price;
    }

    statTotalEvents.textContent = totalEvents;
    statTotalSeats.textContent = totalSeats;
    statTotalPrice.textContent = "$" + totalRevenue.toFixed(2);
}

eventForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // FORM VALIDATION PART

    // --- REGEX RULES ---
    const regextitle = /^[a-zA-ZÀ-ÿ0-9\s'.,-]{2,100}$/;
    const regeximageurl = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;
    const regexdescription = /^[\wÀ-ÿ\s.,'?!-]{10,500}$/;
    const regexnombrseats = /^[1-9][0-9]{0,2}$/;
    const regexprixbase = /^(?:\d+|\d+\.\d{1,2})$/;

    // --- INPUTS ---
    const titleInput = document.querySelector("#event-title");
    const imageInput = document.querySelector("#event-image");
    const descriptionInput = document.querySelector("#event-description");
    const seatsInput = document.querySelector("#event-seats");
    const priceInput = document.querySelector("#event-price");
    const errormsg = document.querySelector(".alert");

    const title = titleInput.value.trim();
    const imageurl = imageInput.value.trim();
    const description = descriptionInput.value.trim();
    const nombrseats = seatsInput.value.trim();
    const prixbase = priceInput.value.trim();

    // --- VALIDATION ---
    if (!regextitle.test(title)) {
        errormsg.classList.remove("is-hidden");
        errormsg.textContent = "Le titre est invalide, essayez une autre fois.";
        titleInput.focus();
        return;
    }
    if (!regeximageurl.test(imageurl)) {
        errormsg.classList.remove("is-hidden");
        errormsg.textContent = "L'URL de l'image est invalide, essayez une autre fois.";
        imageInput.focus();
        return;
    }
    if (!regexdescription.test(description)) {
        errormsg.classList.remove("is-hidden");
        errormsg.textContent = "La description est invalide, essayez une autre fois.";
        descriptionInput.focus();
        return;
    }
    if (!regexnombrseats.test(nombrseats)) {
        errormsg.classList.remove("is-hidden");
        errormsg.textContent = "Le nombre de places est invalide, essayez une autre fois.";
        seatsInput.focus();
        return;
    }
    if (!regexprixbase.test(prixbase)) {
        errormsg.classList.remove("is-hidden");
        errormsg.textContent = "Le prix est invalide, essayez une autre fois.";
        priceInput.focus();
        return;
    }

    // --- IF EVERYTHING IS VALID ---
    errormsg.classList.add("is-hidden");

    const newEvent = {
        title: title,
        image: imageurl,
        description: description,
        seats: parseInt(nombrseats),
        price: parseFloat(prixbase)
    };

    events.push(newEvent);
    updateStats();
    eventForm.reset();
    listevents();
});


//  VARIANTS SECTION  //

function add_variants() {
    const variants_list = document.querySelector(".variants__list");
    variants_list.innerHTML += `
  <div class="variant-row">
    <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')"/>
    <input type="number" class="input variant-row__qty" placeholder="Qty" min="1"/>
    <input type="number" class="input variant-row__value" placeholder="Value" step="0.01"/>
    <select class="select variant-row__type">
      <option value="fixed">Fixed Price</option>
      <option value="percentage">Percentage Off</option>
    </select>
    <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>
  </div>`;
}



//======================//
// 2 - list Events
//=====================//


function listevents() {
  listdata.innerHTML = "";
  let events_counter = 1;

  events.forEach(event => {
    listdata.innerHTML += `
      <tr class="table__row">
        <td>${events_counter++}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td><span class="badge">$${event.price.toFixed(2)}</span></td>
        <td>
          <button class="btn btn--small" data-action="details">Details</button>
          <button class="btn btn--small" data-action="edit">Edit</button>
          <button class="btn btn--danger btn--small" data-action="delete">Delete</button>
        </td>
      </tr>`;
  });
}










