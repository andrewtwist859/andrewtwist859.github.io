// Inject CSS Styles
function injectStyles() {
    const css = `
    body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
    }

    .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-family: 'source-serif-pro', serif;
        font-weight: 700;
        text-align: center;
    }

    #search-input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .filter-toggle {
        margin-bottom: 10px;
    }

    #filter-toggle-button, #clear-filters-button {
        background-color: #7100FF;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        margin-right: 5px;
    }

    .hidden {
        display: none;
    }

    .filters-container {
        background-color: #f1f1f1;
        padding: 10px;
        border-radius: 5px;
    }

    .event {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        padding: 10px;
        background-color: #ffffff;
        border-radius: 5px;
        border: 1px solid #ddd;
    }

    .event img {
        width: 150px;
        height: 100px;
        border-radius: 5px;
    }

    .event h3 {
        font-family: 'source-serif-pro', serif;
        color: #7100FF;
    }

    .flag {
        display: inline-block;
        padding: 5px 10px;
        margin-top: 5px;
        background-color: #7100FF;
        color: white;
        border-radius: 20px;
    }

    @media (max-width: 768px) {
        .event {
            flex-direction: column;
            align-items: center;
        }

        .event img {
            width: 100%;
            height: auto;
        }
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Inject HTML Structure
function injectHTML() {
    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = `
        <h1>Event Listings</h1>
        <input type="search" id="search-input" placeholder="Search by title..." />
        <div class="filter-toggle">
            <button id="filter-toggle-button" onclick="toggleFilters()">Filter Events</button>
            <button id="clear-filters-button" style="display:none;" onclick="clearAllFilters()">Clear Filters</button>
        </div>
        <div id="filters-container" class="hidden">
            <div id="tags-filter" class="filter-options"></div>
            <div id="event-type-filter" class="filter-options"></div>
            <div id="location-filter" class="filter-options"></div>
        </div>
        <div id="events-container"></div>
        <button id="show-more-button" style="display:none;" onclick="showMoreEvents()">Show More Events</button>
    `;
    document.body.appendChild(container);
}

// Event Logic
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuGS5R5uLLYkcmqRBmslKVHL3UanEYQN6xmluJcUkFU_kMliZLVWxZb9iBGXh3t8KXXsy--fAAAgsG/pub?output=csv';
let events = [];
let filteredEvents = [];
let displayedEventCount = 0;
const eventsPerPage = 10;

function fetchEvents() {
    fetch(sheetURL)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    events = results.data;
                    filterAndRenderEvents();
                    renderFilters();
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function filterAndRenderEvents() {
    filteredEvents = events;
    renderEvents(filteredEvents.slice(0, eventsPerPage));
}

function renderFilters() {
    document.getElementById('tags-filter').innerHTML = '<strong>Tags</strong>';
    document.getElementById('event-type-filter').innerHTML = '<strong>Event Type</strong>';
}

function renderEvents(eventList) {
    const container = document.getElementById('events-container');
    container.innerHTML = eventList.map(event => `
        <div class="event">
            <img src="${event.Thumbnail || 'https://via.placeholder.com/150'}" alt="${event.Name}">
            <div>
                <h3>${event.Name}</h3>
                <p>${event.Description}</p>
            </div>
        </div>
    `).join('');
}

injectStyles();
injectHTML();
fetchEvents();
