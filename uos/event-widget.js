(function() {
    const css = `
    .event-embed-container {
      max-width: 750px;
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
      color: #440099;
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
    gap: 0;
  }

  .event img {
    width: 100%; /* Make image take full width */
    height: auto; /* Maintain aspect ratio */
    margin-bottom: 0; /* Add spacing between image and content */
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
  
    const html = `
    <h1>Event Listings</h1>
    <input type="search" id="search-input" placeholder="Search by title..." enterkeyhint="search" oninput="filterAndRenderEvents()">
    
    <!-- Filter Toggle -->
    <div class="filter-toggle">
      <button id="filter-toggle-button">Filter Events</button>
      <button id="clear-filters-button" style="display: none;">Clear All Filters</button>
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

    <div id="events-container"></div>
    <button id="show-more-button" style="display: none;" onclick="showMoreEvents()">Show More Events</button>
    `;
  
    const js = `
  document.addEventListener('DOMContentLoaded', function() {
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
      const query = document.getElementById('search-input').value.toLowerCase();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter future events and apply filters/search
      filteredEvents = events.filter(event => {
        const [day, month, year] = event.Date.split('/');
        const eventDate = new Date(\`\${year}-\${month}-\${day}\`);
        const matchesDate = eventDate >= today;

        // Search logic
        const matchesSearch = event.Name.toLowerCase().includes(query);

        return matchesDate && matchesSearch;
      });

      filteredEvents = filterEventsList(filteredEvents);

      // Sort events by date
      filteredEvents.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split('/');
        const [dayB, monthB, yearB] = b.Date.split('/');
        return new Date(\`\${yearA}-\${monthA}-\${dayA}\`) - new Date(\`\${yearB}-\${monthB}-\${dayB}\`);
      });

      displayedEventCount = 0; // Reset count
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
        if (event.Tags) event.Tags.split(',').forEach(tag => allTags.add(tag.trim()));
        if (event['Event type']) allEventTypes.add(event['Event type'].trim());
        if (event.Location) allLocations.add(event.Location.trim());
      });

      allTags.forEach(tag => document.getElementById('tags-filter').innerHTML += filterInput(tag));
      allEventTypes.forEach(type => document.getElementById('event-type-filter').innerHTML += filterInput(type));
      allLocations.forEach(loc => document.getElementById('location-filter').innerHTML += filterInput(loc));

      attachFilterListeners();
    }

    function attachFilterListeners() {
      document.querySelectorAll('#filters-container input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', filterAndRenderEvents);
      });
    }

    function filterInput(value) {
      return \`<label><input type="checkbox" value="\${value}"> \${value}</label>\`;
    }

    function filterEventsList(eventsToFilter) {
      const checkedTags = getCheckedValues('#tags-filter');
      const checkedEventTypes = getCheckedValues('#event-type-filter');
      const checkedLocations = getCheckedValues('#location-filter');

      return eventsToFilter.filter(event => {
        const tags = event.Tags ? event.Tags.split(',').map(tag => tag.trim()) : [];
        const matchesTags = checkedTags.length === 0 || tags.some(tag => checkedTags.includes(tag));
        const matchesEventType = checkedEventTypes.length === 0 || checkedEventTypes.includes(event['Event type']);
        const matchesLocation = checkedLocations.length === 0 || checkedLocations.includes(event.Location);

        return matchesTags && matchesEventType && matchesLocation;
      });
    }

    function getCheckedValues(selector) {
      return Array.from(document.querySelectorAll(\`\${selector} input:checked\`)).map(input => input.value);
    }

    function renderEvents(eventList) {
      const container = document.getElementById('events-container');

      // Clear current events if starting from the beginning
      if (displayedEventCount === 0) {
        container.innerHTML = '';
      }

      const eventsToShow = eventList.slice(displayedEventCount, displayedEventCount + eventsPerPage);
      eventsToShow.forEach(event => {
        const {
          Name, Description, Location, 'Event type': EventType, Date,
          'Start time': StartTime, 'End time': EndTime, Tags, Thumbnail, URL
        } = event;

        container.innerHTML += \`
          <div class="event">
            <a href="\${URL}" target="_blank">
              <img src="\${Thumbnail || 'https://via.placeholder.com/150'}" alt="\${Name} Thumbnail">
            </a>
            <div class="event-content">
              <a href="\${URL}" target="_blank"><h3>\${Name}</h3></a>
              <div class="event-details">
                <p>Date: <span>\${Date}</span></p>
                <p>Time: <span>\${StartTime || ''} - \${EndTime || ''}</span></p>
                <p>Location: <span>\${Location}</span></p>
              </div>
              <p>\${Description}</p>
              <div class="link">
                <a href="\${URL}">Book your place</a>
                <span class="link-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                    </svg>
                  </span>
              </div>
              <div class="flags">
                <span class="flag">\${EventType}</span>
                \${Tags ? Tags.split(',').map(tag => \`<span class="flag">\${tag.trim()}</span>\`).join('') : ''}
              </div>
            </div>
          </div>
        \`;
      });

      displayedEventCount += eventsToShow.length;

      // Show or hide the "Show More" button
      const showMoreButton = document.getElementById('show-more-button');
      showMoreButton.style.display = displayedEventCount < eventList.length ? 'block' : 'none';
    }

    function showMoreEvents() {
      renderEvents(filteredEvents);
    }

    function toggleFilters() {
      const filtersContainer = document.getElementById('filters-container');
      filtersContainer.classList.toggle('hidden');

      const isVisible = !filtersContainer.classList.contains('hidden');
      document.getElementById('clear-filters-button').style.display = isVisible ? 'inline-block' : 'none';
    }

    function clearAllFilters() {
      document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(input => (input.checked = false));
      document.getElementById('search-input').value = '';
      filterAndRenderEvents();
    }

    function toggleClearFiltersButton() {
      const searchQuery = document.getElementById('search-input').value.trim();
      const activeFilters = document.querySelectorAll('#filters-container input:checked').length > 0;

      document.getElementById('clear-filters-button').style.display = searchQuery || activeFilters ? 'inline-block' : 'none';
    }

    // Attach global listeners
    document.getElementById('filter-toggle-button').addEventListener('click', toggleFilters);
    document.getElementById('clear-filters-button').addEventListener('click', clearAllFilters);
    document.getElementById('search-input').addEventListener('input', filterAndRenderEvents);
    document.getElementById('search-input').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default submission
        filterAndRenderEvents(); // Trigger search
        this.blur(); // Dismiss mobile keyboard
      }
    });
    document.getElementById('show-more-button').addEventListener('click', showMoreEvents);
  });
`;

function injectStyles(styles) {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function injectWidget() {
    const scriptTag = document.currentScript; // Reference to the current script tag
    const parent = scriptTag.parentElement;  // Parent element of the script tag
  
    // Create a container for the event embed
    const container = document.createElement('div');
    container.className = 'event-embed-container'; // Optional: Add a class for styling
    container.innerHTML = html;
    
    // Append the container inside the parent div
    parent.appendChild(container);
  
    // Inject the main logic script
    const script = document.createElement('script');
    script.textContent = js;
    parent.appendChild(script);
  
    // Inject PapaParse for CSV parsing
    const papaScript = document.createElement('script');
    papaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js';
    parent.appendChild(papaScript);
  }

injectStyles(css);
injectWidget();
})();
