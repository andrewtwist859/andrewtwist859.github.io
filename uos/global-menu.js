function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  const navItem = document.querySelector(`[onclick="togglePanel('${panelId}')"]`); // Find nav-item
  const isPanelOpen = panel.classList.contains('show');

  // Close any open panels and reset nav-item classes
  document.querySelectorAll('.mega-menu-panel').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('menu-open'));

  // Toggle the clicked panel and rotate icon if opening
  if (!isPanelOpen) {
    panel.classList.add('show');
    navItem.classList.add('menu-open'); // Add rotation class
  }
}

  let currentPanel = 'main-mobile-panel';
  const navHistory = [];

  function toggleMobileMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');

    if (overlay.style.display === 'flex') {
      overlay.style.display = 'none';
      navHistory.length = 0;
      currentPanel = 'main-mobile-panel';
      document.querySelectorAll('.mobile-submenu-panel').forEach(panel => panel.classList.remove('show', 'back'));
      document.getElementById('main-mobile-panel').classList.add('show');
    } else {
      overlay.style.display = 'flex';
      document.getElementById('main-mobile-panel').classList.add('show');
    }
  }

  function openSubmenu(panelId) {
    if (currentPanel) {
      navHistory.push(currentPanel);
      document.getElementById(currentPanel).classList.remove('show', 'back');
    }
    
    document.getElementById(panelId).classList.add('show');
    currentPanel = panelId;
  }

  function closeSubmenu() {
    if (navHistory.length > 0) {
      document.getElementById(currentPanel).classList.remove('show');
      document.getElementById(currentPanel).classList.add('back'); // Slide out to the left
      
      currentPanel = navHistory.pop();
      document.getElementById(currentPanel).classList.add('show'); // Show previous panel
    } else {
      document.getElementById('main-mobile-panel').style.left = '0';
      currentPanel = 'main-mobile-panel';
    }
  };
  </script>
  <script>
    // Function to toggle a specific mega menu panel
    function togglePanel(panelId) {
      const panel = document.getElementById(panelId);
      const isPanelOpen = panel.classList.contains('show');
  
      // Close any open panels
      document.querySelectorAll('.mega-menu-panel').forEach(p => p.classList.remove('show'));
  
      // Toggle the clicked panel
      if (!isPanelOpen) {
        panel.classList.add('show');
      }
    }
  
    // Event listener to close mega menu if click is outside
    document.addEventListener('click', function(event) {
      const isClickInside = event.target.closest('.navbar') || event.target.closest('.mega-menu-panel');
  
      // If click is outside the navbar and mega menu, close all panels
      if (!isClickInside) {
        document.querySelectorAll('.mega-menu-panel').forEach(panel => panel.classList.remove('show'));
      }
    });