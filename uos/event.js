// Inject CSS Styles
function injectStyles() {
    const css = `
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
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
        font-size: 16px;
    }

    .filter-toggle {
        margin-bottom: 10px;
    }

    #filter-toggle-button,
    #clear-filters-button {
        background-color: #7100FF;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 5px;
    }

    #filter-toggle-button:hover,
    #clear-filters-button:hover {
        background-color: #5a00cc;
    }

    .hidden {
        display: none;
    }

    .filters-container {
        background-color: #f1f1f1;
        padding: 10px;
        border-radius: 5px;
    }

    .filter-section {
        margin-bottom: 10px;
    }

    .filter-options label {
        display: block;
        margin-bottom: 5px;
    }

    .event {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        padding: 10px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .event img {
        width: 150px;
        height: 100px;
        object-fit: cover;
        border-radius: 5px;
    }

    .event h3 {
        margin: 0;
        font-size: 1.5em;
        color: #7100FF;
    }

    .event-details p {
        margin: 5px 0;
        font-weight: bold;
    }

    .flags {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .flag {
        padding: 5px 10px;
        background-color: #7100FF;
        color: white;
        border-radius: 20px;
        font-size: 0.8em;
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

// Call the function to inject styles
injectStyles();

// Main Script Logic
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuGS5R5uLLYkcmqRBmslKVHL3UanEYQN6xmluJcUkFU_kMliZLVWxZb9iBGXh3t8KXXsy--fAAAgsG/pub?output=csv';

let events = [];
let filteredEvents = [];
let displayedEventCount = 0;
const eventsPerPage = 10;

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

    displayedEventCount = 0;
    renderEvents(filteredEvents);
    toggleClearFiltersButton();
}

function renderFilters() {
    document.getElementById('tags-filter').innerHTML = '';
    document.getElementById('event-type-filter').innerHTML = '';
    document.getElementById('location-filter').innerHTML = '';

    const allTags = new Set();
    const allEventTypes = new Set();
    const allLocations = new Set();

    events.forEach(event => {
        if (event.Tags) {
            event.Tags.split(',').map(tag => allTags.add(tag.trim()));
        }
        if (event["Event type"]) {
            allEventTypes.add(event["Event type"].trim());
        }
        if (event.Location) {
            allLocations.add(event.Location.trim());
        }
    });

    allTags.forEach(tag => {
        document.getElementById('tags-filter').innerHTML += `
            <label>
                <input type="checkbox" value="${tag}" onchange="filterAndRenderEvents()"> ${tag}
            </label>
        `;
    });

    allEventTypes.forEach(eventType => {
        document.getElementById('event-type-filter').innerHTML += `
            <label>
                <input type="checkbox" value="${eventType}" onchange="filterAndRenderEvents()"> ${eventType}
            </label>
        `;
    });

    allLocations.forEach(location => {
        document.getElementById('location-filter').innerHTML += `
            <label>
                <input type="checkbox" value="${location}" onchange="filterAndRenderEvents()"> ${location}
            </label>
        `;
    });
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
                    <div class="link">
                        <a href="${URL}">
                            ${URL ? 'Book your place' : ''}
                            <span class="link-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </span>
                        </a>
                    </div>
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

function showMoreEvents() {
    renderEvents(filteredEvents);
}

function toggleFilters() {
    document.getElementById('filters-container').classList.toggle('hidden');
}

function toggleClearFiltersButton() {
    const searchQuery = document.getElementById('search-input').value.trim();
    const activeFilters = document.querySelectorAll('.filter-options input:checked').length > 0;

    document.getElementById('clear-filters-button').style.display = (searchQuery || activeFilters) ? 'inline-block' : 'none';
}

function clearAllFilters() {
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.getElementById('search-input').value = '';
    filterAndRenderEvents();
}
