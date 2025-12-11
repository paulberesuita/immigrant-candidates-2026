// ===================================
// Navigation Functionality
// ===================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Candidate Filtering & Search
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const candidatesGrid = document.getElementById('candidates-grid');
const candidateCards = document.querySelectorAll('.candidate-card');
const noResults = document.getElementById('no-results');

let currentFilter = 'all';
let currentSearch = '';

// Filter button click handler
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update filter
        currentFilter = button.dataset.filter;
        filterCandidates();
    });
});

// Search input handler
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    filterCandidates();
});

// Filter candidates function
function filterCandidates() {
    let visibleCount = 0;

    candidateCards.forEach(card => {
        const category = card.dataset.category;
        const state = card.dataset.state;
        const name = card.dataset.name;

        // Check filter match
        const matchesFilter = currentFilter === 'all' || category === currentFilter;

        // Check search match
        const matchesSearch = currentSearch === '' ||
            name.includes(currentSearch) ||
            state.includes(currentSearch);

        // Show or hide card
        if (matchesFilter && matchesSearch) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'block';
        candidatesGrid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        candidatesGrid.style.display = 'grid';
    }
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Newsletter Form
// ===================================

const newsletterForm = document.getElementById('newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success
        newsletterForm.innerHTML = `
            <div class="form-success">
                <div class="success-icon">✓</div>
                <p>Thanks for subscribing! We'll keep you updated on Latino Leaders 2026.</p>
            </div>
        `;

        // Style the success message
        const successDiv = newsletterForm.querySelector('.form-success');
        successDiv.style.textAlign = 'center';

        const successIcon = successDiv.querySelector('.success-icon');
        successIcon.style.width = '50px';
        successIcon.style.height = '50px';
        successIcon.style.background = '#10B981';
        successIcon.style.borderRadius = '50%';
        successIcon.style.display = 'flex';
        successIcon.style.alignItems = 'center';
        successIcon.style.justifyContent = 'center';
        successIcon.style.margin = '0 auto 16px';
        successIcon.style.fontSize = '24px';
        successIcon.style.color = 'white';

        const successText = successDiv.querySelector('p');
        successText.style.color = 'rgba(255, 255, 255, 0.9)';
        successText.style.fontSize = '16px';
    }, 1500);
});

// ===================================
// Scroll Animations
// ===================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elements to animate
const animateElements = document.querySelectorAll('.candidate-card, .impact-card, .feature, .about-content');

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    observer.observe(el);
});

// Add animation class styles
const animStyle = document.createElement('style');
animStyle.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animStyle);

// ===================================
// Counter Animation for Impact Stats
// ===================================

const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };

    updateCounter();
};

const impactNumbers = document.querySelectorAll('.impact-number');
const numbersObserved = new Set();

const numbersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !numbersObserved.has(entry.target)) {
            numbersObserved.add(entry.target);
            const text = entry.target.textContent;

            // Parse different number formats
            if (text.includes('M+')) {
                const num = parseInt(text);
                entry.target.textContent = '0M+';
                animateCounter(entry.target, num, 'M+');
            } else if (text.includes('%')) {
                const num = parseInt(text);
                entry.target.textContent = '0%';
                animateCounter(entry.target, num, '%');
            } else if (text.includes('<')) {
                // Skip animation for "<10%" type values
            } else if (!isNaN(parseInt(text))) {
                const num = parseInt(text);
                entry.target.textContent = '0';
                animateCounter(entry.target, num, '');
            }
        }
    });
}, { threshold: 0.5 });

impactNumbers.forEach(num => numbersObserver.observe(num));

// ===================================
// Hero Stats Counter Animation
// ===================================

const heroStatNumbers = document.querySelectorAll('.hero-stat .stat-number');
const heroStatsObserved = new Set();

const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !heroStatsObserved.has(entry.target)) {
            heroStatsObserved.add(entry.target);
            const text = entry.target.textContent;

            if (text.includes('+')) {
                const num = parseInt(text);
                entry.target.textContent = '0+';
                animateCounter(entry.target, num, '+');
            } else if (!isNaN(parseInt(text))) {
                const num = parseInt(text);
                entry.target.textContent = '0';
                animateCounter(entry.target, num, '');
            }
        }
    });
}, { threshold: 0.5 });

heroStatNumbers.forEach(stat => heroStatsObserver.observe(stat));

// ===================================
// Card hover effects
// ===================================

candidateCards.forEach(card => {
    const photo = card.querySelector('.candidate-photo');

    card.addEventListener('mouseenter', () => {
        if (photo) {
            photo.style.transform = 'scale(1.05)';
            photo.style.transition = 'transform 0.3s ease';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (photo) {
            photo.style.transform = 'scale(1)';
        }
    });
});

// ===================================
// Social link click handler
// ===================================

document.querySelectorAll('.candidate-card .social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
        // In production, this would navigate to actual social profiles
        showNotification('Social profile link clicked! (Demo)');
    });
});

document.querySelectorAll('.btn-card').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Campaign website link clicked! (Demo)');
    });
});

// Simple notification system
function showNotification(message) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--secondary);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const notifStyle = document.createElement('style');
        notifStyle.id = 'notification-styles';
        notifStyle.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(notifStyle);
    }

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ===================================
// Initialize
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll check for navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Make cards visible with stagger
    setTimeout(() => {
        candidateCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 300);
});

// ===================================
// Keyboard navigation for filters
// ===================================

filterButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const nextButton = filterButtons[index + 1] || filterButtons[0];
            nextButton.focus();
        } else if (e.key === 'ArrowLeft') {
            const prevButton = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
            prevButton.focus();
        }
    });
});

// ===================================
// Search keyboard shortcuts
// ===================================

document.addEventListener('keydown', (e) => {
    // Press "/" to focus search
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }

    // Press "Escape" to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        currentSearch = '';
        filterCandidates();
        searchInput.blur();
    }
});
