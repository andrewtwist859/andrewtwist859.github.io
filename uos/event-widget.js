(function() {
    // Inject CSS
    const css = `
   .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
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
  
    // Inject HTML
    const html = `
      <div class="container">
        <h1>Event Listings</h1>
        <input type="search" id="search-input" placeholder="Search by title..." oninput="filterAndRenderEvents()">
        <div class="filter-toggle">
          <button id="filter-toggle-button" onclick="toggleFilters()">Filter Events</button>
          <button id="clear-filters-button" onclick="clearAllFilters()">Clear All Filters</button>
        </div>
        <div id="filters-container" class="hidden">
          <div id="tags-filter" class="filter-options"></div>
          <div id="event-type-filter" class="filter-options"></div>
          <div id="location-filter" class="filter-options"></div>
        </div>
        <div id="events-container"></div>
        <button id="show-more-button" style="display: none;">Show More Events</button>
      </div>
    `;
  
    // Inject JavaScript
    const js = `
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
        const query = document.getElementById('search-input').value.toLowerCase();
        filteredEvents = events.filter(event => event.Name.toLowerCase().includes(query));
        renderEvents(filteredEvents);
      }
  
      function renderEvents(eventList) {
        const container = document.getElementById('events-container');
        container.innerHTML = '';
        eventList.slice(0, displayedEventCount + eventsPerPage).forEach(event => {
          container.innerHTML += \`
            <div class="event">
              <h3>\${event.Name}</h3>
              <p>Date: \${event.Date}</p>
            </div>
          \`;
        });
      }
  
      function toggleFilters() {
        document.getElementById('filters-container').classList.toggle('hidden');
      }
  
      function clearAllFilters() {
        document.getElementById('search-input').value = '';
        filterAndRenderEvents();
      }
  
      fetchEvents();
    `;
  
    // Helper functions for injecting styles, HTML, and JS
    function injectStyles(styles) {
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  
    function injectWidget() {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
  
      const script = document.createElement('script');
      script.textContent = js;
      document.body.appendChild(script);
  
      const papaScript = document.createElement('script');
      papaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js';
      document.head.appendChild(papaScript);
    }
  
    // Inject everything
    injectStyles(css);
    injectWidget();
  })();
  