// app.js - Centralized JavaScript for Circle Spring Academy

// Initialize Alpine.js store
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        mobileMenuOpen: false,
        language: 'en',
        languageDropdownOpen: false,
        activeSection: 'home'
    });

    // Carousel functionality
    Alpine.data('carousel', () => ({
        activeSlide: 0,
        totalSlides: 3,
        interval: null,
        
        init() {
            this.interval = setInterval(() => {
                this.next();
            }, 5000);
        },
        
        next() {
            this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
        },
        
        prev() {
            this.activeSlide = (this.activeSlide - 1 + this.totalSlides) % this.totalSlides;
        },
        
        goToSlide(index) {
            this.activeSlide = index;
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.next();
            }, 5000);
        }
    }));

    // FAQ functionality
    Alpine.data('faq', () => ({
        openCategory: null,
        openFaq: null
    }));
});

// Common initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCurrentYear();
    initializeBackToTop();
    initializeSmoothScrolling();
    initializeScrollTracking();
});

// Set current year in footer
function initializeCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('#currentYear');
    
    yearElements.forEach(element => {
        if (element) {
            element.textContent = currentYear;
        }
    });
    
    // Fallback for footer copyright
    const footerParagraphs = document.querySelectorAll('footer p');
    footerParagraphs.forEach(p => {
        if (p.textContent.includes('©') && !p.textContent.includes(currentYear)) {
            p.innerHTML = p.innerHTML.replace('©', `© ${currentYear}`);
        }
    });
}

// Back to top button functionality
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) {
        // Create back to top button if it doesn't exist
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.className = 'fixed bottom-8 right-8 bg-deep-carmine hover:bg-vivid-burgundy text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition duration-300 opacity-0 invisible z-40';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
        
        setupBackToTopListener(backToTopBtn);
    } else {
        setupBackToTopListener(backToTop);
    }
}

function setupBackToTopListener(button) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.remove('opacity-0', 'invisible');
            button.classList.add('opacity-100', 'visible');
        } else {
            button.classList.remove('opacity-100', 'visible');
            button.classList.add('opacity-0', 'invisible');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (Alpine && Alpine.store('app')) {
                    Alpine.store('app').mobileMenuOpen = false;
                }
            }
        });
    });
}

// Scroll tracking for navigation
function initializeScrollTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSection = entry.target.getAttribute('id');
                if (Alpine && Alpine.store('app')) {
                    Alpine.store('app').activeSection = activeSection;
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Utility function for lazy loading images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}