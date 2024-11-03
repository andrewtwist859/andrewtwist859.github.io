 <script>
        const sliderContainer = document.getElementById('sliderContainer');
        const testimonials = document.querySelectorAll('.testimonial');
        let testimonialWidth = testimonials[0].offsetWidth + parseInt(window.getComputedStyle(testimonials[0]).marginRight); // Exact width including gap
        let currentIndex = 0;

        function updateTestimonialWidth() {
            testimonialWidth = testimonials[0].offsetWidth + parseInt(window.getComputedStyle(testimonials[0]).marginRight);
        }

        function moveSlide(direction) {
            // Update maxIndex based on the screen size (1 testimonial or 2 testimonials per view)
            const maxIndex = window.innerWidth <= 768 ? testimonials.length - 1 : testimonials.length - 2;
            currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));

            // Scroll the container to the appropriate position
            sliderContainer.scrollTo({
                left: currentIndex * testimonialWidth,
                behavior: 'smooth'
            });
        }

        // Update width and scroll settings on window resize
        window.addEventListener('resize', () => {
            updateTestimonialWidth();
        });

        // Sync `currentIndex` with manual scrolling for smooth behavior with arrows
        sliderContainer.addEventListener('scroll', () => {
            currentIndex = Math.round(sliderContainer.scrollLeft / testimonialWidth);
        });

        // Initialize testimonial width for responsive layout
        updateTestimonialWidth();
    </script>