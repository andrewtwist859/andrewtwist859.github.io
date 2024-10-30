 function toggleSectionPanel(event, panelId) {
    event.preventDefault();
    const panel = document.getElementById('section-dropdown-panel');
    const content = document.getElementById('section-panel-content');
    
    // If the clicked panel is already active, close it
    if (panel.classList.contains('active') && content.innerHTML === panelData[panelId]) {
      panel.classList.remove('active');
      content.innerHTML = '';
      return;
    }
    
    // Update the panel content and show the panel
    content.innerHTML = panelData[panelId];
    panel.classList.add('active');
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const panel = document.getElementById('section-dropdown-panel');
    const isClickInsideNavbar = event.target.closest('.section-navbar-container');
    const isClickInsidePanel = event.target.closest('.section-dropdown-panel');
    
    if (!isClickInsideNavbar && !isClickInsidePanel) {
      panel.classList.remove('active');
      document.getElementById('section-panel-content').innerHTML = ''; // Clear content
    }
  });