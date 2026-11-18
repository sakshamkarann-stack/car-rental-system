
const cars = [
    {
        id: 1,
        name: "Kia Seltos",
        type: "SUV",
        price: 2899,
        rating: 4.9,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        tag: "Bestseller",
        img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 2,
        name: "Honda City",
        type: "Sedan",
        price: 2199,
        rating: 4.8,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        tag: "Popular",
        img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 3,
        name: "Hyundai Creta",
        type: "SUV",
        price: 2599,
        rating: 4.9,
        seats: 5,
        transmission: "Manual",
        fuel: "Diesel",
        tag: "Great Value",
        img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 4,
        name: "Mercedes C-Class",
        type: "Luxury",
        price: 7499,
        rating: 5.0,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        tag: "Premium",
        img: "https://images.unsplash.com/photo-1618843479618-39b6f1c2f3a7?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 5,
        name: "Maruti Swift",
        type: "Hatchback",
        price: 1499,
        rating: 4.7,
        seats: 5,
        transmission: "Manual",
        fuel: "Petrol",
        tag: "City Favourite",
        img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 6,
        name: "Tata Nexon EV",
        type: "Electric",
        price: 3199,
        rating: 4.8,
        seats: 5,
        transmission: "Automatic",
        fuel: "Electric",
        tag: "Go Electric",
        img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 7,
        name: "Toyota Fortuner",
        type: "SUV",
        price: 5999,
        rating: 4.9,
        seats: 7,
        transmission: "Automatic",
        fuel: "Diesel",
        tag: "Adventure",
        img: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 8,
        name: "BMW 3 Series",
        type: "Luxury",
        price: 6999,
        rating: 4.9,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        tag: "Editor's Pick",
        img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
    }
];

const $ = selector => document.querySelector(selector);

let activeFilter = "all";
let selectedCar = null;

let favorites = JSON.parse(
    localStorage.getItem("veloce-favorites") || "[]"
);

function money(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// RENDER CARS

function renderCars() {

    let list = cars.filter(car => {

        const categoryMatch =
            activeFilter === "all" ||
            car.type === activeFilter;

        const searchCategory =
            $("#typeSelect").value === "all" ||
            car.type === $("#typeSelect").value;

        return categoryMatch && searchCategory;
    });

    const sort = $("#sortSelect").value;

    if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
        list.sort((a, b) => b.rating - a.rating);
    }

    $("#resultsCount").textContent =
        `Showing ${list.length} vehicles`;

    $("#favCount").textContent = favorites.length;

    const grid = $("#carGrid");

    grid.innerHTML = list.map(car => `
        <article class="car-card">

            <div class="car-photo">

                <img
                    src="${car.img}"
                    alt="${car.name}"
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'"
                >

                <span class="car-tag">${car.tag}</span>

                <button
                    class="fav-btn ${favorites.includes(car.id) ? "active" : ""}"
                    data-fav="${car.id}">
                    ${favorites.includes(car.id) ? "♥" : "♡"}
                </button>

            </div>

            <div class="car-info">

                <div class="car-title-row">
                    <h3>${car.name}</h3>
                    <span class="rating">★ ${car.rating}</span>
                </div>

                <p class="car-type">${car.type} · Premium Collection</p>

                <div class="car-specs">
                    <span>♙ ${car.seats} Seats</span>
                    <span>⚙ ${car.transmission}</span>
                    <span>◉ ${car.fuel}</span>
                </div>

                <div class="car-bottom">

                    <div class="price">
                        <strong>${money(car.price)}</strong>
                        <small>Per day</small>
                    </div>

                    <button
                        class="book-btn"
                        data-book="${car.id}">
                        Book Now ↗
                    </button>

                </div>
            </div>
        </article>
    `).join("");

    $("#emptyState").classList.toggle(
        "hidden",
        list.length !== 0
    );

    grid.classList.toggle(
        "hidden",
        list.length === 0
    );
}

// CATEGORY FILTERS

$("#filters").addEventListener("click", function(e) {

    const button = e.target.closest("[data-filter]");

    if (!button) return;

    activeFilter = button.dataset.filter;

    document.querySelectorAll(".filter-chip").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    renderCars();
});

// SORTING

$("#sortSelect").addEventListener("change", renderCars);

// SEARCH

$("#typeSelect").addEventListener("change", function() {
    activeFilter = "all";

    document.querySelectorAll(".filter-chip").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === "all"
        );
    });

    renderCars();
});

$("#searchForm").addEventListener("submit", function(e) {

    e.preventDefault();

    if (!validDates($("#pickupDate").value, $("#returnDate").value)) {
        notify("Return date must be after pick-up date!");
        return;
    }

    renderCars();

    $("#fleet").scrollIntoView({
        behavior: "smooth"
    });

    notify("Cars found successfully!");
});

// RESET FILTERS

function resetFilters() {

    activeFilter = "all";

    $("#typeSelect").value = "all";
    $("#sortSelect").value = "recommended";

    document.querySelectorAll(".filter-chip").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === "all"
        );
    });

    renderCars();
}

$("#clearFilters").addEventListener("click", resetFilters);
$("#resetEmpty").addEventListener("click", resetFilters);

// FAVOURITES

$("#carGrid").addEventListener("click", function(e) {

    const favButton = e.target.closest("[data-fav]");
    const bookButton = e.target.closest("[data-book]");

    if (favButton) {

        const id = Number(favButton.dataset.fav);

        if (favorites.includes(id)) {
            favorites = favorites.filter(x => x !== id);
            notify("Removed from favourites");
        } else {
            favorites.push(id);
            notify("Added to favourites!");
        }

        localStorage.setItem(
            "veloce-favorites",
            JSON.stringify(favorites)
        );

        renderCars();
    }

    if (bookButton) {
        openBooking(Number(bookButton.dataset.book));
    }
});

// FAVOURITES SHORTCUT

$("#favoritesShortcut").addEventListener("click", function() {

    const saved = cars.filter(car =>
        favorites.includes(car.id)
    );

    if (!saved.length) {
        notify("No saved cars yet!");
        return;
    }

    activeFilter = "all";

    $("#typeSelect").value = "all";

    $("#filters").querySelectorAll("button").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === "all"
        );
    });

    $("#carGrid").innerHTML = saved.map(car => `
        <article class="car-card">
            <div class="car-photo">
                <img src="${car.img}" alt="${car.name}">
                <span class="car-tag">Saved</span>
            </div>

            <div class="car-info">
                <div class="car-title-row">
                    <h3>${car.name}</h3>
                    <span class="rating">★ ${car.rating}</span>
                </div>

                <p class="car-type">${car.type}</p>

                <div class="car-bottom" style="margin-top:20px">
                    <div class="price">
                        <strong>${money(car.price)}</strong>
                        <small>Per day</small>
                    </div>

                    <button class="book-btn" data-book="${car.id}">
                        Book Now ↗
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    $("#resultsCount").textContent =
        `Your ${saved.length} saved cars`;

    $("#emptyState").classList.add("hidden");
    $("#carGrid").classList.remove("hidden");

    $("#fleet").scrollIntoView({behavior: "smooth"});
});

// DATE MANAGEMENT

function localDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

$("#pickupDate").min = localDate(today);
$("#pickupDate").value = localDate(tomorrow);

$("#returnDate").min = localDate(tomorrow);
$("#returnDate").value = localDate(dayAfter);

$("#bookPickup").min = localDate(today);
$("#bookPickup").value = localDate(tomorrow);

$("#bookReturn").min = localDate(tomorrow);
$("#bookReturn").value = localDate(dayAfter);

function validDates(pickup, returned) {

    return pickup &&
        returned &&
        new Date(returned) > new Date(pickup);
}

function updateMinimumReturn(pickupId, returnId) {

    const pickup = new Date($(pickupId).value + "T00:00:00");

    if (Number.isNaN(pickup.getTime())) return;

    pickup.setDate(pickup.getDate() + 1);

    const minimum = localDate(pickup);

    $(returnId).min = minimum;

    if ($(returnId).value < minimum) {
        $(returnId).value = minimum;
    }
}

$("#pickupDate").addEventListener("change", () => {
    updateMinimumReturn("#pickupDate", "#returnDate");
});

// BOOKING MODAL

function openBooking(id) {

    selectedCar = cars.find(car => car.id === id);

    $("#modalTitle").textContent =
        `Reserve ${selectedCar.name}`;

    $("#modalCarMeta").textContent =
        `${selectedCar.type} · ${selectedCar.seats} Seats · ${money(selectedCar.price)}/day`;

    $("#modalCarImage").style.backgroundImage =
        `url("${selectedCar.img}")`;

    $("#bookPickup").value = $("#pickupDate").value;
    $("#bookReturn").value = $("#returnDate").value;

    $("#insurance").checked = false;
    $("#childSeat").checked = false;

    updateMinimumReturn("#bookPickup", "#bookReturn");
    updatePrice();

    $("#bookingModal").classList.remove("hidden");

    document.body.style.overflow = "hidden";
}

function closeBooking() {

    $("#bookingModal").classList.add("hidden");

    document.body.style.overflow = "";
}

$("#closeModal").addEventListener("click", closeBooking);

$("#bookingModal").addEventListener("click", function(e) {
    if (e.target === $("#bookingModal")) {
        closeBooking();
    }
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeBooking();
});

// PRICE CALCULATOR

function updatePrice() {

    if (!selectedCar) return;

    const pickup = $("#bookPickup").value;
    const returned = $("#bookReturn").value;

    let days = 1;

    if (validDates(pickup, returned)) {

        days = Math.ceil(
            (new Date(returned) - new Date(pickup)) /
            (1000 * 60 * 60 * 24)
        );
    }

    const base = selectedCar.price * days;

    let extras = 0;

    if ($("#insurance").checked) {
        extras += 499 * days;
    }

    if ($("#childSeat").checked) {
        extras += 199 * days;
    }

    $("#rentalDays").textContent = days;
    $("#basePrice").textContent = money(base);
    $("#extraPrice").textContent = money(extras);
    $("#totalPrice").textContent = money(base + extras);
}

$("#bookPickup").addEventListener("change", function() {
    updateMinimumReturn("#bookPickup", "#bookReturn");
    updatePrice();
});

$("#bookReturn").addEventListener("change", updatePrice);

$("#insurance").addEventListener("change", updatePrice);
$("#childSeat").addEventListener("change", updatePrice);

// CONFIRM BOOKING

$("#bookingForm").addEventListener("submit", function(e) {

    e.preventDefault();

    if (!validDates(
        $("#bookPickup").value,
        $("#bookReturn").value
    )) {
        notify("Please select valid rental dates!");
        return;
    }

    const booking = {

        reference: "VL" + Date.now().toString().slice(-7),

        car: selectedCar.name,

        pickup: $("#bookPickup").value,

        returned: $("#bookReturn").value,

        time: $("#pickupTime").value,

        total: $("#totalPrice").textContent,

        insurance: $("#insurance").checked,

        childSeat: $("#childSeat").checked
    };

    const bookings = JSON.parse(
        localStorage.getItem("veloce-bookings") || "[]"
    );

    bookings.push(booking);

    localStorage.setItem(
        "veloce-bookings",
        JSON.stringify(bookings)
    );

    closeBooking();

    notify(
        `Booking ${booking.reference} created! Total: ${booking.total}`
    );

    console.log("Booking Details:", booking);
});

// MOBILE MENU

$("#menuToggle").addEventListener("click", function() {
    $("#nav").classList.toggle("open");
});

$("#nav").addEventListener("click", function(e) {
    if (e.target.tagName === "A") {
        $("#nav").classList.remove("open");
    }
});

// INITIALIZE

renderCars();
