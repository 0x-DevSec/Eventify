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

    if (target === "archive") {
        listArchive();
    }
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
    <button type="button" class="btn btn--danger btn--small variant-row__remove" >Remove</button>
  </div>`;
}



//======================//
// 2 - list Events
//=====================//


function listevents() {
    listdata.innerHTML = ""; // clear table body

    events.forEach((event, index) => {
        listdata.innerHTML += `
      <tr class="table__row">
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td><span class="badge">$${event.price.toFixed(2)}</span></td>
        <td>
         <button class="btn btn--small" data-action="details" onclick="showDetails(${index})">Details</button>
          <button class="btn btn--small" data-action="edit" onclick="editDeatails(${index})">Edit</button>
          <button class="btn btn--small btn--warning" onclick="moveToArchive(${index})" data-action="archive">Archive</button>
          <button class="btn btn--danger btn--small" onclick="deleteevent(${index})" data-action="delete">Delete</button>
        </td>
      </tr>`;
    });
}

// implementation of search bar function
let filter = document.getElementById("search-events");
filter.addEventListener('keyup', function () {
    let search = this.value.toLowerCase();
    let list = document.querySelectorAll(".table__row");

    for (let i of list) {
        let item = i.innerHTML.toLowerCase();
        if (item.indexOf(search) == -1)
            i.classList.add('hide');
        else
            i.classList.remove('hide');

    }
})

//  implementation of delete data function
function deleteevent(index) {
    events.splice(index, 1);
    listevents();
    updateStats();
}



// implementation of sort data 

function bubbleSortEvents(type) {
    let n = events.length;
    let swapped = true;

    while (swapped) {
        swapped = false;
        let i = 0;

        while (i < n - 1) {
            let shouldSwap = false;

            switch (type) {
                case "title-asc":
                    if (events[i].title.toLowerCase() > events[i + 1].title.toLowerCase()) {
                        shouldSwap = true;
                    }
                    break;
                case "title-desc":
                    if (events[i].title.toLowerCase() < events[i + 1].title.toLowerCase()) {
                        shouldSwap = true;
                    }
                    break;
                case "price-asc":
                    if (events[i].price > events[i + 1].price) {
                        shouldSwap = true;
                    }
                    break;
                case "price-desc":
                    if (events[i].price < events[i + 1].price) {
                        shouldSwap = true;
                    }
                    break;
                case "seats-asc":
                    if (events[i].seats > events[i + 1].seats) {
                        shouldSwap = true;
                    }
                    break;
                default:
                    break;
            }


            if (shouldSwap) {
                let temp = events[i];
                events[i] = events[i + 1];
                events[i + 1] = temp;
                swapped = true;

                i++;
            }

            n--;
        }
    }
}

// implementation of show details function
function showDetails(index) {
    const event = events[index];
    const modal = document.getElementById("event-modal");
    const modalBody = document.getElementById("modal-body");
    const modalTitle = document.getElementById("modal-title");

    // Fill modal content
    modalTitle.textContent = event.title;
    modalBody.innerHTML = `
    <p><strong>Description:</strong> ${event.description}</p>
    <p><strong>Seats:</strong> ${event.seats}</p>
    <p><strong>Price:</strong> $${event.price.toFixed(2)}</p>
  `;
    modal.classList.remove("is-hidden");
    const closeModal = () => modal.classList.add("is-hidden");
    modal.querySelector("[data-action='close-modal']").onclick = closeModal;
}

// implementation of edit function 
function editDeatails(index) {
    const event = events[index];

    // Ask user for new values
    const newTitle = prompt("Enter new title:", event.title);
    if (newTitle === null) return;

    const newImage = prompt("Enter new image URL:", event.image);
    if (newImage === null) return;

    const newDesc = prompt("Enter new description:", event.description);
    if (newDesc === null) return;

    const newSeats = prompt("Enter new seats number:", event.seats);
    if (newSeats === null || isNaN(newSeats)) return;

    const newPrice = prompt("Enter new price:", event.price);
    if (newPrice === null || isNaN(newPrice)) return;

    // Update event data
    event.title = newTitle;
    event.image = newImage;
    event.description = newDesc;
    event.seats = parseInt(newSeats);
    event.price = parseFloat(newPrice);
    listevents();
    updateStats();
    alert("Event updated successfully!");
}


// archive function
function moveToArchive(index) {
    const removedEvent = events.splice(index, 1)[0];
    archive.push(removedEvent);
    listevents();
    listArchive();
    updateStats();
}

// display archive
function listArchive() {
    const archiveTable = document.querySelector('#archive-table .table__body');
    if (!archiveTable) return;

    archiveTable.innerHTML = "";

    archive.forEach((event, index) => {
        archiveTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${event.title}</td>
        <td>${event.seats}</td>
        <td>$${event.price.toFixed(2)}</td>
        <td>
          <button class="btn btn--small" onclick="restoreFromArchive(${index})">
            Restore
          </button>
        </td>
      </tr>`;
    });
}