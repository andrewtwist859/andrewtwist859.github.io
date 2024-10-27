window.addEventListener('scroll', () => {
  const banner = document.getElementById('banner');
  if (window.scrollY > 100) { // adjust scroll threshold as needed
    banner.classList.add('sticky');
  } else {
    banner.classList.remove('sticky');
  }
});
