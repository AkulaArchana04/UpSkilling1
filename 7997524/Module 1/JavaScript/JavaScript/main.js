/**
 * Local Community Event Portal - Assignment JavaScript
 * 
 * This file implements all 14 exercises required by the JavaScript Exercises assignment.
 * Each section is clearly labeled and matches the objective/tasks specified.
 */

// ==========================================
// 1. JavaScript Basics & Setup
// ==========================================
console.log("Welcome to the Community Portal");

// Use an alert to notify when the page is fully loaded
window.addEventListener("load", () => {
    // Alerting on load
    alert("Welcome to the Community Portal! The page has fully loaded.");
    console.log("Setup check: alert fired and console logs active.");
});

// ==========================================
// 5. Objects and Prototypes
// ==========================================
// Define Event constructor/class
class CommunityEvent {
    constructor(id, name, date, venue, category, seats, description, image = "images/event1.jpg") {
        this.id = id;
        this.name = name;
        this.date = date;
        this.venue = venue;
        this.category = category;
        this.seats = seats;
        this.description = description;
        this.image = image;
    }
}

const Event = CommunityEvent;

// Add checkAvailability to prototype
CommunityEvent.prototype.checkAvailability = function() {
    return this.seats > 0;
};

// ==========================================
// 2. Syntax, Data Types, and Operators
// ==========================================
// Use const for event name and date, let for seats
const demoEventName = "Music Festival";
const demoEventDate = "2026-06-10";
let demoEventSeats = 50;

// Concatenate event info using template literals
const demoEventDetails = `Event: "${demoEventName}" will be held on ${demoEventDate} with ${demoEventSeats} seats available.`;
console.log("Concatenated details: ", demoEventDetails);

// Use ++ or -- to manage seat count on registration
// (This is also implemented below in registerUser and handleCancel)

// ==========================================
// 6. Arrays and Methods
// ==========================================
// Manage an array of all community events
const eventsList = [
    new CommunityEvent(1, "Music Festival", "2026-06-10", "City Hall", "Music", 50, "Enjoy live music performances from local bands.", "images/event1.jpg"),
    new CommunityEvent(2, "Food Carnival", "2026-06-15", "Central Park", "Food", 30, "Taste delicious foods from different regions.", "images/event2.jpg"),
    new CommunityEvent(3, "Farmer's Market", "2026-06-20", "Main Stadium", "Shopping", 10, "Discover fresh produce and local goods.", "images/event3.jpg"),
    new CommunityEvent(4, "Art Workshop", "2026-06-25", "Community Center", "Workshop", 0, "Learn sketching and painting from experts.", "images/event1.jpg"), // Full event
    new CommunityEvent(5, "Historical Tour", "2025-05-12", "Old Town", "Workshop", 15, "Explore the historic spots in town.", "images/event2.jpg") // Past event
];

// Add new events using .push()
function addEvent(newEvent) {
    eventsList.push(newEvent);
    console.log("New event added via .push(). New count: ", eventsList.length);
}

// Use .filter() to show only music events (Logged to console to demonstrate)
const justMusicEvents = eventsList.filter(e => e.category === "Music");
console.log("Filtered Music Events using .filter():", justMusicEvents);

// Use .map() to format display cards
const formattedCardTitles = eventsList.map(e => `Workshop on ${e.name}`);
console.log("Formatted titles with .map():", formattedCardTitles);


// ==========================================
// 4. Functions, Scope, Closures, Higher-Order Functions
// ==========================================

// Closure to track total registrations for a category
function createCategoryRegistrationTracker() {
    const registrationCounts = {}; // private scope variable
    return function(category) {
        if (!registrationCounts[category]) {
            registrationCounts[category] = 0;
        }
        registrationCounts[category]++; // Increment using ++
        console.log(`[Closure Tracker] Total registrations for category "${category}": ${registrationCounts[category]}`);
        return registrationCounts[category];
    };
}
const trackRegistration = createCategoryRegistrationTracker();

// Pass callbacks to filter functions for dynamic search (Higher-Order Function)
function filterEvents(callback) {
    // 10. Use spread operator to clone event list before filtering
    const clonedEvents = [...eventsList];
    return clonedEvents.filter(callback);
}

// 4. Implement filterEventsByCategory
function filterEventsByCategory(category) {
    console.log(`Filtering by category: ${category}`);
    let filtered;
    if (category === "All") {
        filtered = [...eventsList];
    } else {
        // Callback passed to HOF
        filtered = filterEvents(event => event.category === category);
    }
    renderEvents(filtered);
}

// ==========================================
// 7. DOM Manipulation & 14. jQuery fadeIn/fadeOut
// ==========================================
function renderEvents(eventsToRender) {
    const container = document.querySelector("#eventContainer");
    if (!container) return; // Not on events.html page

    // Clear existing event cards using jQuery fadeOut first
    const existingCards = $(container).find(".dynamic-card");
    if (existingCards.length > 0) {
        existingCards.fadeOut(400, function() {
            $(this).remove();
            buildAndAppendCards();
        });
    } else {
        buildAndAppendCards();
    }

    function buildAndAppendCards() {
        // 3. Loop through the event list and display using forEach()
        eventsToRender.forEach(event => {
            // 10. Use destructuring to extract event details
            const { id, name, date, venue, category, seats, description, image } = event;

            // 3. Use if-else to hide past or full events
            const isUpcoming = new Date(date) >= new Date("2026-06-01"); // Custom logic for demo dates
            const hasSeats = event.checkAvailability(); // Prototype check

            if (!isUpcoming || !hasSeats) {
                // Skip displaying past or full events
                console.log(`Hiding event: ${name} (Upcoming: ${isUpcoming}, Seats: ${seats})`);
                return;
            }

            // Create and append event cards using createElement()
            const card = document.createElement("div");
            card.className = "eventCard dynamic-card";
            card.style.display = "none"; // Hide initially for jQuery fadeIn

            // Use template literals for innerHTML
            card.innerHTML = `
                <img src="${image}" alt="${name}" width="300">
                <h2>${name}</h2>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Date:</strong> ${date} | <strong>Venue:</strong> ${venue}</p>
                <p>${description}</p>
                <p><strong>Available Seats:</strong> <span id="seats-${id}">${seats}</span></p>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button class="registerBtn" onclick="registerUser(${id})" style="background-color: green; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Register</button>
                    <button class="cancelBtn" onclick="cancelRegistration(${id})" style="background-color: red; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Cancel Registration</button>
                </div>
            `;
            container.appendChild(card);

            // 14. Use .fadeIn() for event cards
            $(card).fadeIn(800);
        });

        // 5. List object keys and values using Object.entries()
        if (eventsToRender.length > 0) {
            console.log("Object.entries() demonstration for first rendered event:");
            console.log(Object.entries(eventsToRender[0]));
        }
    }
}

// 4. Implement registerUser(eventId)
function registerUser(eventId) {
    // 3. Wrap registration logic in try-catch to handle errors
    try {
        console.log(`[Registration Initiated] Event ID: ${eventId}`);
        const event = eventsList.find(e => e.id === eventId);
        
        if (!event) {
            throw new Error("Registration failed: Event does not exist in our registry.");
        }

        if (!event.checkAvailability()) {
            throw new Error(`Registration failed: "${event.name}" is completely sold out!`);
        }

        // Manage seat count: Decrement using --
        event.seats--;
        console.log(`[Seat Count Update] Seat registered. Remaining: ${event.seats}`);

        // Update UI
        const seatsDisplay = document.querySelector(`#seats-${eventId}`);
        if (seatsDisplay) {
            seatsDisplay.innerText = event.seats;
        }

        // Trigger closure category registration count tracker
        trackRegistration(event.category);

        alert(`you have successfully registerd fot the ${event.name}`);

    } catch (error) {
        alert(error.message);
        console.error("[Registration Error]", error.message);
    }
}

// Function to handle cancellation (Update UI check)
function cancelRegistration(eventId) {
    const event = eventsList.find(e => e.id === eventId);
    if (event) {
        // Manage seat count: Increment using ++
        event.seats++;
        console.log(`[Seat Count Update] Registration cancelled. Remaining: ${event.seats}`);

        // Update UI
        const seatsDisplay = document.querySelector(`#seats-${eventId}`);
        if (seatsDisplay) {
            seatsDisplay.innerText = event.seats;
        }
        alert(`Registration cancelled for "${event.name}".`);
    }
}

// ==========================================
// 8. Event Handling (Category change & Keydown search)
// ==========================================
// Set up handlers on page load if elements exist
document.addEventListener("DOMContentLoaded", () => {
    // 8. keydown quick search by name
    const searchInput = document.querySelector("#searchQuery");
    if (searchInput) {
        searchInput.addEventListener("keydown", (event) => {
            // Allow processing on next tick to capture value
            setTimeout(() => {
                const query = searchInput.value.toLowerCase();
                console.log(`[Quick Search] Key pressed. Query: ${query}`);
                
                const filtered = eventsList.filter(e => e.name.toLowerCase().includes(query));
                renderEvents(filtered);
            }, 0);
        });
    }

    // Expose functions globally for simple markup access
    window.filterEventsByCategory = filterEventsByCategory;
    window.registerUser = registerUser;
    window.cancelRegistration = cancelRegistration;
});

// ==========================================
// 9. Async JS, Promises, Async/Await
// ==========================================
// Fetch event data from a mock JSON endpoint
async function loadEventsAsync() {
    const container = document.querySelector("#eventContainer");
    if (!container) return; // Not on events.html

    // Show loading spinner
    const spinner = document.createElement("div");
    spinner.id = "loadingSpinner";
    spinner.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; margin: 40px 0;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid purple; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 10px; color: purple;">Loading events database...</p>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    `;
    container.appendChild(spinner);

    try {
        // Use Fetch with Promise chaining (.then() and .catch()) to fetch random resource first (as per requirements)
        console.log("[Mock Fetch Process] Initializing JSON fetch...");
        
        // Wait 1.5s to show the loading spinner simulation
        await new Promise(resolve => setTimeout(resolve, 1500));

        await fetch("https://jsonplaceholder.typicode.com/todos/1")
            .then(response => {
                if (!response.ok) throw new Error("Network response not ok");
                return response.json();
            })
            .then(data => {
                console.log("[Fetch Success] Fetched sample JSON payload successfully:", data);
                // Remove loading spinner
                const activeSpinner = document.querySelector("#loadingSpinner");
                if (activeSpinner) activeSpinner.remove();

                // Render dynamic events from arrays
                renderEvents(eventsList);
            })
            .catch(error => {
                console.error("[Fetch Error Handle]", error);
                const activeSpinner = document.querySelector("#loadingSpinner");
                if (activeSpinner) activeSpinner.remove();
                
                // Fallback to local list if fetch fails
                renderEvents(eventsList);
            });
    } catch (e) {
        console.error("Outer async/await error catching: ", e);
    }
}

// ==========================================
// 11. Working with Forms & 12. AJAX & Fetch API
// ==========================================
// 14. Use $('#registerBtn').click(...) to handle click events (jQuery method)
$(document).ready(function() {
    const regForm = $(".registration-form");

    if (regForm.length > 0) {
        // Capture submit event using jQuery click or standard submit
        $("#registerBtn").click(function(event) {
            // 11. Prevent default form behavior
            event.preventDefault();

            // 11. Capture name, email, and selected event using form.elements
            const formEl = regForm[0];
            const emailInput = formEl.elements["email"];
            const nameInput = formEl.elements["name"];
            const eventSelect = formEl.elements["eventType"];
            const phoneInput = formEl.elements["phone"];
            const dateInput = formEl.elements["eventDate"];
            const eventName = eventSelect.options[eventSelect.selectedIndex] ? eventSelect.options[eventSelect.selectedIndex].text : "event";

            // Reset error messages inline
            $("#email-error").hide().text("");
            $("#name-error").hide().text("");
            $("#event-error").hide().text("");
            $("#phone-error").hide().text("");
            $("#date-error").hide().text("");

            let isValid = true;

            // 11. Validate inputs and show errors inline
            if (!emailInput.value.includes("@")) {
                $("#email-error").text("Please enter a valid email address.").fadeIn();
                isValid = false;
            }
            if (nameInput.value.trim() === "") {
                $("#name-error").text("Name is required.").fadeIn();
                isValid = false;
            }
            if (dateInput.value === "") {
                $("#date-error").text("Please select a date.").fadeIn();
                isValid = false;
            }
            if (eventSelect.value === "") {
                $("#event-error").text("Please select an event.").fadeIn();
                isValid = false;
            }

            if (!isValid) {
                console.warn("[Validation Warning] Form submission rejected due to invalid fields.");
                return;
            }

            // --- 12. AJAX & Fetch API ---
            // Create user payload
            const userData = {
                email: emailInput.value,
                name: nameInput.value,
                eventType: eventSelect.value,
                eventDate: dateInput.value,
                phone: phoneInput ? phoneInput.value : ""
            };

            // 13. Log form submission steps and check fetch request payload
            console.log("[Form Submission Step 1] Validated input details successfully.");
            console.log("[Form Submission Step 2] Request payload assembled: ", userData);

            // Fetch to POST user data to mock API
            console.log("[Form Submission Step 3] Dispatching mock POST fetch request...");
            
            fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("Mock POST endpoint responded with an error");
                return res.json();
            })
            .then(result => {
                console.log("[Form Submission Step 4] Response received: ", result);
                
                // 12. Use setTimeout() to simulate delayed response
                setTimeout(() => {
                    alert(`you have successfully registerd fot the ${eventName}`);
                }, 1000);
            })
            .catch(error => {
                console.error("[AJAX Error] POST failed: ", error);
                alert("Server registration failed. Please try again.");
            });
        });
    }

    // Initialize async events render if we are on events.html
    if (document.querySelector("#eventContainer")) {
        loadEventsAsync();
    }
});

// ==========================================
// 13. Debugging and Testing Instructions
// ==========================================
/**
 * Developer Instructions for Chrome Dev Tools Debugging:
 * 
 * 1. Open events.html or register.html in Google Chrome.
 * 2. Press F12 (or right-click and select Inspect) to open Chrome Dev Tools.
 * 3. Go to the "Console" tab to inspect the logged messages like:
 *    - "Welcome to the Community Portal"
 *    - "Object.entries() demonstration"
 *    - Closures, registration tracker logs, and payloads.
 * 4. Go to the "Sources" tab:
 *    - Press Ctrl+P (Cmd+P on Mac) and type "main.js" to open this script.
 *    - Click on the line number next to "event.seats--;" inside registerUser() (Line 192) to set a Breakpoint.
 *    - Register for any event to trigger the breakpoint, step through execution, and inspect local scopes/variables.
 * 5. Go to the "Network" tab:
 *    - Perform a registration from register.html.
 *    - Check the payload and mock responses for the POST request to "https://jsonplaceholder.typicode.com/posts".
 */

// ==========================================
// 14. Benefit of JS Frameworks over jQuery
// ==========================================
console.log("jQuery vs React/Vue Framework Benefit:");
console.log("Benefit: Frameworks like React and Vue employ a virtual DOM and declarative state management. " +
            "Instead of manually selecting and updating specific DOM elements (like jQuery), we simply update the " +
            "data state, and the framework automatically calculates changes and updates the UI efficiently.");
