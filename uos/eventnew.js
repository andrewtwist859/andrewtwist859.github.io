(function() {
    // Inject CSS
    function injectStyles() {
        const css = `
            .event-embed-container {
              padding: 20px;
              max-width: 800px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
        
            h1 {
              text-align: left;
              font-family: 'source-serif-pro';
              font-weight: 700;
            }
        
            #search-input {
              width: 100%;
              padding: 10px;
              margin-bottom: 10px;
              border: 1px solid #ddd;
              border-radius: 5px;
              font-size: 16px;
            }
        
            .filter-toggle {
              text-align: left;
              margin-bottom: 10px;
            }
        
            #filter-toggle-button, #show-more-button {
              background-color: #440099;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
            }
        
            #filter-toggle-button:hover {
              background-color: #7100FF;
            }
        
            .hidden {
              display: none;
            }
        
            #filters-container {
              margin-top: 10px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f1f1f1;
            }
        
            .filters-container {
          display: block; /* Change from flex to block */
          margin-bottom: 20px;
        }
        
        .filter-section {
          margin-bottom: 20px; /* Add spacing between filter sections */
        }
        
        .filter-options {
          display: block; /* Ensure filter options also stack vertically */
          margin-top: 5px;
          font-family: 'source-sans-pro';
        }
        
        .filter-options label {
          margin-right: 1rem
        }
        
        .filter-header {
          font-family: 'source-serif-pro';
          font-weight: 700;
          color: #440099;
          margin-bottom: 5px; /* Add spacing between header and options */
        }
        
        #clear-filters-button {
          background-color: #d9534f; /* Red button for clear action */
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px; /* Add some space between the buttons */
        }
        
        #clear-filters-button:hover {
          background-color: #c9302c;
        }
        
            .event {
              font-family: 'source-sans-pro';
              display: flex;
              align-items: flex-start;
              gap: 15px;
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #ffffff;
              position: relative;
            }
        
            .event img {
              width: 150px;
              height: 100px;
              object-fit: cover;
              border-radius: 5px;
            }
        
            .event-content {
              flex: 1;
            }
        
            .event h3 {
              font-family: 'source-serif-pro';
              color: #000;
              font-weight: 700;
              margin: 0;
              font-size: 1.2em;
            }
        
            .event p {
              margin: 5px 0;
              font-size: 1em;
            }
        
            .link {
              margin: 1rem 0rem;
            }
        
            .link-icon svg {
          width: 16px; /* Adjust size as needed */
          height: 16px;
          fill: #7100FF; /* Set the desired fill color */
          margin-left: 0.1rem; /* Add spacing between text and icon */
          vertical-align: middle; /* Align icon with text */
        }
        
            .event a {
              color: #7100FF;
              text-decoration: none;
              font-weight: bold;
            }
        
            .event a:hover {
              text-decoration: underline;
            }
        
            .flags {
              display: flex;
              gap: 10px;
              margin-top: 10px;
              flex-wrap: wrap;
            }
        
            .flag {
              padding: 5px 10px;
              font-size: 0.8em;
              background-color: #7100FF;
              color: white;
              border-radius: 20px;
              text-wrap: nowrap;
            }
        
            .event-details {
              display: flex;
              gap: 20px;
              font-size: 0.9em;
            }
        
            .event-details p {
              margin: 5px 0;
              font-weight: bold;
            }
        
            .event-details span {
              font-weight: normal;
            }
        
            @media (max-width: 768px) {
          .event {
            flex-direction: column; /* Stack content vertically */
            align-items: center; /* Center-align content */
          }
        
          .event img {
            width: 100%; /* Make image take full width */
            height: auto; /* Maintain aspect ratio */
            margin-bottom: 10px; /* Add spacing between image and content */
          }
        
          .event-details {
              flex-direction: column;
              gap: 0;
              margin: 1rem 0rem;
              font-size: 1rem;
            }
        
            .filter-options {
          display: flex;
          flex-direction: column; /* Ensure filter options also stack vertically */
        
        }
        
        .flags {
          margin-top: 1rem;
        }
        
        .event a {
          margin: 1rem 0;
        }
        
        #search-input {
          max-width: 90%;
        }   
        
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

  // Attach key functions to the global window object
window.filterAndRenderEvents = filterAndRenderEvents;
window.toggleFilters = function() {
    document.getElementById('filters-container').classList.toggle('hidden');
};
window.clearAllFilters = function() {
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.getElementById('search-input').value = '';
    filterAndRenderEvents();
};
window.showMoreEvents = function() {
    renderEvents(filteredEvents);
};
window.toggleClearFiltersButton = function() {
    const searchQuery = document.getElementById('search-input').value.trim();
    const activeFilters = document.querySelectorAll('.filter-options input:checked').length > 0;
    document.getElementById('clear-filters-button').style.display = (searchQuery || activeFilters) ? 'inline-block' : 'none';
};

// Load PapaParse and Execute Main Logic
function loadPapaParse(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js';
    script.onload = callback;
    script.onerror = () => console.error('Failed to load PapaParse.');
    document.head.appendChild(script);
}

// Event Tool Logic
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuGS5R5uLLYkcmqRBmslKVHL3UanEYQN6xmluJcUkFU_kMliZLVWxZb9iBGXh3t8KXXsy--fAAAgsG/pub?output=csv';
let events = [];
let filteredEvents = [];
let displayedEventCount = 0;
const eventsPerPage = 10;

function initializeEventTool() {
    fetch(sheetURL)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    events = results.data;
                    filterAndRenderEvents(); // Start with all events
                    renderFilters();
                },
                error: function(error) {
                    console.error('PapaParse Error:', error);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Inject HTML with inline event handlers
function injectHTML() {
    const parentContainer = document.currentScript.parentElement;
    const eventContainer = document.createElement('div');
    eventContainer.className = 'event-embed-container';

    eventContainer.innerHTML = `
        <h1>Event Listings</h1>

        <!-- Search Box -->
        <input type="search" id="search-input" placeholder="Search by title..." oninput="filterAndRenderEvents()" enterkeyhint="search">

        <!-- Filter Toggle -->
        <div class="filter-toggle">
            <button id="filter-toggle-button" onclick="toggleFilters()">Filter Events</button>
            <button id="clear-filters-button" onclick="clearAllFilters()" style="display: none;">Clear All Filters</button>
        </div>

        <!-- Filters -->
        <div id="filters-container" class="hidden">
            <div class="filters-container">
                <div class="filter-section">
                    <div class="filter-header">Filter by Tags:</div>
                    <div id="tags-filter" class="filter-options"></div>
                </div>
                <div class="filter-section">
                    <div class="filter-header">Filter by Event Type:</div>
                    <div id="event-type-filter" class="filter-options"></div>
                </div>
                <div class="filter-section">
                    <div class="filter-header">Filter by Location:</div>
                    <div id="location-filter" class="filter-options"></div>
                </div>
            </div>
        </div>

        <!-- Events Container -->
        <div id="events-container"></div>
        <button id="show-more-button" onclick="showMoreEvents()" style="display: none;">Show More Events</button>
    `;

    parentContainer.appendChild(eventContainer);
}

// Filtering, Rendering, and Event Handling
function filterAndRenderEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredEvents = events.filter(event => {
        const [day, month, year] = event.Date.split('/');
        const eventDate = new Date(`${year}-${month}-${day}`);
        return eventDate >= today;
    });

    filteredEvents = filterEventsList(filteredEvents);

    filteredEvents.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split('/');
        const [dayB, monthB, yearB] = b.Date.split('/');
        return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
    });

    displayedEventCount = 0; // Reset count
    renderEvents(filteredEvents); // Re-render events
    toggleClearFiltersButton(); // Update clear filters button visibility
}

function renderFilters() {
    const tagsContainer = document.getElementById('tags-filter');
    const eventTypeContainer = document.getElementById('event-type-filter');
    const locationContainer = document.getElementById('location-filter');

    tagsContainer.innerHTML = '';
    eventTypeContainer.innerHTML = '';
    locationContainer.innerHTML = '';

    const allTags = new Set();
    const allEventTypes = new Set();
    const allLocations = new Set();

    events.forEach(event => {
        if (event.Tags) event.Tags.split(',').forEach(tag => allTags.add(tag.trim()));
        if (event["Event type"]) allEventTypes.add(event["Event type"].trim());
        if (event.Location) allLocations.add(event.Location.trim());
    });

    allTags.forEach(tag => {
        tagsContainer.innerHTML += `
            <label>
                <input type="checkbox" value="${tag}" onchange="filterAndRenderEvents()"> ${tag}
            </label>`;
    });

    allEventTypes.forEach(type => {
        eventTypeContainer.innerHTML += `
            <label>
                <input type="checkbox" value="${type}" onchange="filterAndRenderEvents()"> ${type}
            </label>`;
    });

    allLocations.forEach(location => {
        locationContainer.innerHTML += `
            <label>
                <input type="checkbox" value="${location}" onchange="filterAndRenderEvents()"> ${location}
            </label>`;
    });
}

function renderEvents(eventList) {
    const container = document.getElementById('events-container');
    const showMoreButton = document.getElementById('show-more-button');

    if (displayedEventCount === 0) {
        container.innerHTML = '';
    }

    const eventsToShow = eventList.slice(displayedEventCount, displayedEventCount + eventsPerPage);
    eventsToShow.forEach(event => {
        const { Name, Description, Location, "Event type": EventType, Date, "Start time": StartTime, "End time": EndTime, Tags, Thumbnail, URL } = event;

        container.innerHTML += `
            <div class="event">
                <a href="${URL}" target="_blank">
                    <img src="${Thumbnail || 'https://via.placeholder.com/150'}" alt="${Name} Thumbnail">
                </a>
                <div class="event-content">
                    <a href="${URL}" target="_blank">
                        <h3>${Name}</h3>
                    </a>
                    <div class="event-details">
                        <p>Date: <span>${Date}</span></p>
                        <p>Time: <span>${StartTime || ''} - ${EndTime || ''}</span></p>
                        <p>Location: <span>${Location}</span></p>
                    </div>
                    <p>${Description}</p>
                    <div class="flags">
                        <span class="flag">${EventType}</span>
                        ${Tags ? Tags.split(',').map(tag => `<span class="flag">${tag.trim()}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        `;
    });

    displayedEventCount += eventsToShow.length;
    showMoreButton.style.display = displayedEventCount < eventList.length ? 'block' : 'none';
}

function filterEventsList(eventsToFilter) {
    const query = document.getElementById('search-input').value.toLowerCase();
    const checkedTags = Array.from(document.querySelectorAll('#tags-filter input:checked')).map(input => input.value);
    const checkedEventTypes = Array.from(document.querySelectorAll('#event-type-filter input:checked')).map(input => input.value);
    const checkedLocations = Array.from(document.querySelectorAll('#location-filter input:checked')).map(input => input.value);

    return eventsToFilter.filter(event => {
        const tags = event.Tags ? event.Tags.split(',').map(tag => tag.trim()) : [];
        const matchesTags = checkedTags.length === 0 || tags.some(tag => checkedTags.includes(tag));
        const matchesEventType = checkedEventTypes.length === 0 || checkedEventTypes.includes(event["Event type"]);
        const matchesLocation = checkedLocations.length === 0 || checkedLocations.includes(event.Location);
        const matchesSearch = event.Name.toLowerCase().includes(query);

        return matchesTags && matchesEventType && matchesLocation && matchesSearch;
    });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    injectHTML(); // Inject the HTML structure
    loadPapaParse(initializeEventTool); // Load PapaParse and initialize
});

})();