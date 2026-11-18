
// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
    });
});


// LOST AND FOUND SYSTEM

const lostForm = document.getElementById("lostForm");
const listingContainer = document.getElementById("listingContainer");
const filterType = document.getElementById("filterType");

const STORAGE_KEY = "campusconnect_items";

function getItems() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// ADD LISTING

lostForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const item = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        type: document.getElementById("itemType").value,
        name: document.getElementById("itemName").value.trim(),
        location: document.getElementById("itemLocation").value.trim(),
        date: document.getElementById("itemDate").value,
        contact: document.getElementById("itemContact").value.trim(),
        details: document.getElementById("itemDetails").value.trim()
    };

    if (!item.name || !item.location || !item.date || !item.contact) {
        alert("Please fill all required fields.");
        return;
    }

    const items = getItems();

    items.push(item);

    saveItems(items);

    lostForm.reset();

    renderItems();

    alert("Your listing has been added successfully!");
});


// DISPLAY LISTINGS

function renderItems() {

    const items = getItems();

    const filter = filterType.value;

    const filteredItems = filter === "All"
        ? items
        : items.filter(item => item.type === filter);

    if (filteredItems.length === 0) {

        listingContainer.innerHTML = `
            <div class="empty">
                <span>✦</span>
                <b>No listings found</b>
                <small>Try another filter or add a new item.</small>
            </div>
        `;

        return;
    }

    listingContainer.innerHTML = filteredItems.map(item => `
        <div class="listing-item">

            <span class="item-tag ${item.type === "Found" ? "found" : ""}">
                ${escapeHTML(item.type)}
            </span>

            <h4>${escapeHTML(item.name)}</h4>

            <p>
                Location: ${escapeHTML(item.location)}<br>
                Date: ${escapeHTML(item.date)}<br>
                Contact: ${escapeHTML(item.contact)}
            </p>

            <p>${escapeHTML(item.details)}</p>

            <button class="delete-btn"
                type="button"
                data-id="${escapeHTML(item.id)}">
                Delete listing
            </button>

        </div>
    `).join("");
}


// FILTER

filterType.addEventListener("change", renderItems);


// DELETE LISTING

listingContainer.addEventListener("click", function(event) {

    const button = event.target.closest("[data-id]");

    if (!button) return;

    const id = button.dataset.id;

    const items = getItems().filter(item => item.id !== id);

    saveItems(items);

    renderItems();
});


// INITIAL LOAD

renderItems();
