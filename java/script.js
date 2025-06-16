// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero slider functionality
const heroSlides = document.querySelectorAll('.hero-slide');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;
let isTransitioning = false;

function showSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Remove active class from all slides and indicators
    heroSlides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    heroSlides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentSlide = index;
    
    // Reset transition flag after animation
    setTimeout(() => {
        isTransitioning = false;
    }, 1000);
}

function nextSlide() {
    let next = currentSlide + 1;
    if (next >= heroSlides.length) {
        next = 0;
    }
    showSlide(next);
}

function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) {
        prev = heroSlides.length - 1;
    }
    showSlide(prev);
}

// Event listeners for controls
prevButton.addEventListener('click', () => {
    clearInterval(slideInterval);
    prevSlide();
    startSlideInterval();
});

nextButton.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    startSlideInterval();
});

// Event listeners for indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        startSlideInterval();
    });
});

// Start automatic slideshow
function startSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

// Initialize the slider
showSlide(0);
startSlideInterval();

// Pause slideshow when hovering over controls
const sliderControls = document.querySelectorAll('.slider-control, .indicator');
sliderControls.forEach(control => {
    control.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    control.addEventListener('mouseleave', () => {
        startSlideInterval();
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        
        // Disable submit button and show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
        
        // Send form data to server
        fetch('process_contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                alert(data.message);
                this.reset();
            } else {
                // Show error message
                alert(data.error || 'An error occurred. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        })
        .finally(() => {
            // Re-enable submit button and restore original text
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
}

// Project cards animation
const projectCards = document.querySelectorAll('.project-item');
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    observer.observe(card);
});

// Mobile menu toggle
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
            navbarCollapse.classList.remove('show');
        }
    });
}

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    // Add loading placeholder
    if (!img.complete) {
        img.classList.add('loading');
    }
});

// Project filtering
const projectFilters = document.querySelectorAll('.project-filters button');
const projectItems = document.querySelectorAll('.project-item');

projectFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        projectFilters.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked filter
        filter.classList.add('active');
        
        const filterValue = filter.getAttribute('data-filter');
        
        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('show');
                }, 100);
            } else {
                item.classList.remove('show');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Initialize project items
projectItems.forEach(item => {
    item.classList.add('show');
});

// Project modal handling
const projectModals = document.querySelectorAll('.modal');
projectModals.forEach(modal => {
    modal.addEventListener('show.bs.modal', function () {
        const modalBody = this.querySelector('.modal-body');
        modalBody.style.opacity = '0';
        setTimeout(() => {
            modalBody.style.opacity = '1';
        }, 100);
    });
});

// Auto-close mobile navbar after clicking a link
// (Bootstrap 5)
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function () {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navbarCollapse).hide();
        }
    });
});
