// ===================================
// Service Worker Registration
// ===================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

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
// Load Candidates from API
// ===================================

let allCandidates = [];
const candidatesGrid = document.getElementById('candidates-grid');
const loadingMessage = document.getElementById('loading-message');
const noResults = document.getElementById('no-results');

function clearCandidatesGrid() {
    if (!candidatesGrid) return;
    candidatesGrid.innerHTML = '';
    candidatesGrid.style.display = 'grid';
    candidatesGrid.style.gridTemplateColumns = '';
}

function renderSkeletonCandidates(count = 6) {
    if (!candidatesGrid) return;
    clearCandidatesGrid();

    const skeletons = Array.from({ length: count }, () => {
        const card = document.createElement('article');
        card.className = 'candidate-card skeleton';
        card.setAttribute('aria-hidden', 'true');
        card.innerHTML = `
            <div class="card-header">
                <div class="candidate-photo">
                    <div class="skeleton-shimmer skeleton-photo"></div>
                </div>
                <div class="candidate-badge">
                    <div class="skeleton-shimmer skeleton-badge"></div>
                </div>
            </div>
            <div class="card-body">
                <div class="skeleton-shimmer skeleton-line medium" style="margin-bottom: 10px;"></div>
                <div class="skeleton-shimmer skeleton-line short" style="margin-bottom: 14px;"></div>
                <div class="skeleton-shimmer skeleton-line" style="margin-bottom: 10px;"></div>
                <div class="skeleton-shimmer skeleton-line" style="margin-bottom: 10px;"></div>
                <div class="skeleton-tags">
                    <div class="skeleton-shimmer skeleton-tag"></div>
                    <div class="skeleton-shimmer skeleton-tag"></div>
                    <div class="skeleton-shimmer skeleton-tag"></div>
                </div>
            </div>
            <div class="card-footer skeleton-footer">
                <div class="skeleton-shimmer skeleton-button"></div>
            </div>
        `;
        return card;
    });

    skeletons.forEach((s) => candidatesGrid.appendChild(s));
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
}

function getFriendlyErrorMessage(error) {
    const message = error?.message || error || '';

    // Offline or network errors
    if (message.includes('offline') || message.includes('Failed to fetch') || message.includes('NetworkError')) {
        return {
            title: "You're offline",
            message: "It looks like you've lost your internet connection. Please check your connection and try again."
        };
    }

    // Server errors
    if (message.includes('500') || message.includes('503') || message.includes('502')) {
        return {
            title: "Something went wrong",
            message: "We're having trouble loading the candidates right now. Please try again in a moment."
        };
    }

    // Not found
    if (message.includes('404')) {
        return {
            title: "Candidates not found",
            message: "We couldn't find the candidate data. Please try again later."
        };
    }

    // Default friendly message
    return {
        title: "Unable to load candidates",
        message: "Something unexpected happened. Please try again."
    };
}

function renderCandidatesError(error) {
    if (!candidatesGrid) return;
    clearCandidatesGrid();

    const { title, message } = getFriendlyErrorMessage(error);

    const panel = document.createElement('div');
    panel.className = 'error-panel';
    panel.innerHTML = `
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(message)}</p>
        <button type="button" class="btn btn-primary" id="retry-load">Try Again</button>
    `;
    candidatesGrid.appendChild(panel);

    const retryButton = document.getElementById('retry-load');
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            renderSkeletonCandidates(6);
            loadCandidates();
        });
    }
}

function escapeHTML(value) {
    if (value == null) return '';
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// ===================================
// Slug Generation for Candidate URLs
// ===================================

/**
 * Generate a URL-friendly slug from candidate name and state
 * e.g., "Fabian Doñate" + "NV" -> "fabian-donate-nv"
 */
function generateCandidateSlug(candidate) {
    if (!candidate || !candidate.name) return null;

    const namePart = candidate.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-'); // Replace spaces with hyphens

    const statePart = (candidate.state || '').toLowerCase();

    return statePart ? `${namePart}-${statePart}` : namePart;
}

/**
 * Navigate to candidate full page
 */
function navigateToCandidatePage(candidate) {
    const slug = generateCandidateSlug(candidate);
    if (slug) {
        window.location.href = `/candidate/${slug}`;
    }
}

// Fetch candidates from API
async function loadCandidates() {
    try {
        const response = await fetch('/api/candidates');
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('API Error:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle case where API returns an error object
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Ensure we have an array
        allCandidates = Array.isArray(data) ? data : (data.results || []);
        renderCandidates(allCandidates);
    } catch (error) {
        console.error('Error loading candidates:', error);
        renderCandidatesError(error?.message || 'Unknown error');
    }
}

// Render candidate cards
function renderCandidates(candidates) {
    // Clear any existing content first
    clearCandidatesGrid();

    // Update count display
    updateCandidatesCount(candidates.length, candidates.length);

    if (candidates.length === 0) {
        noResults.style.display = 'block';
        candidatesGrid.style.display = 'none';
        return;
    }
    
    // Ensure grid is displayed - CSS will handle the columns
    candidatesGrid.style.display = 'grid';
    // Clear any inline grid template columns to let CSS take over
    candidatesGrid.style.gridTemplateColumns = '';
    noResults.style.display = 'none';
    
    // Render all candidate cards
    candidates.forEach(candidate => {
        const card = createCandidateCard(candidate);
        candidatesGrid.appendChild(card);
    });
    
    // Re-initialize filter/search after rendering
    initializeFilters();
    
    // Animate cards in
    setTimeout(() => {
        const cards = document.querySelectorAll('.candidate-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 100);
}

// Update grid on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (allCandidates.length > 0) {
            renderCandidates(allCandidates);
        }
    }, 250);
});

// Truncate text helper
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Create a candidate card element
function createCandidateCard(candidate) {
    const card = document.createElement('article');
    card.className = 'candidate-card';
    card.setAttribute('data-category', (candidate.office_level || 'local').toLowerCase());
    card.setAttribute('data-state', (candidate.state || '').toLowerCase());
    card.setAttribute('data-name', (candidate.name || '').toLowerCase());

    // Get initials for photo placeholder (fallback)
    const initials = candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

    // Build photo HTML - use image_url if available, otherwise show initials placeholder
    const photoHTML = candidate.image_url && candidate.image_url.trim()
        ? `<img src="${candidate.image_url}" alt="${candidate.name || 'Candidate'}" class="candidate-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        : '';
    const placeholderHTML = `<span class="photo-placeholder" ${candidate.image_url && candidate.image_url.trim() ? 'style="display: none;"' : ''}>${initials}</span>`;

    // Format office type badge
    let badgeText = candidate.office_type || 'Candidate';
    if (candidate.office_level === 'federal') {
        badgeText = 'U.S. Congress';
    } else if (candidate.office_level === 'state') {
        badgeText = candidate.office_type || 'State Office';
    } else {
        badgeText = candidate.office_type || 'Local Office';
    }

    // Format district display - remove state prefix if it's duplicated in district
    let districtDisplay = candidate.district || '';
    if (districtDisplay && candidate.state) {
        // Remove state prefix from district (e.g., "NV SD-10" becomes "SD-10" when state is "NV")
        districtDisplay = districtDisplay.replace(new RegExp(`^${candidate.state}\\s*`, 'i'), '');
    }

    // Format location with state
    const location = candidate.state || 'Unknown';
    
    // Build party badge
    const partyBadge = candidate.party 
        ? `<span class="party-badge party-${candidate.party.toLowerCase()}">${candidate.party}</span>`
        : '';
    
    // Build status/incumbent indicator
    const statusIndicator = candidate.is_incumbent 
        ? `<span class="status-badge status-incumbent">Incumbent</span>`
        : (candidate.status ? `<span class="status-badge">${candidate.status}</span>` : '');
    
    // Build age/heritage info
    const ageInfo = candidate.age ? `<span class="candidate-age">Age ${candidate.age}</span>` : '';
    const heritageInfo = candidate.heritage ? `<span class="candidate-heritage">${candidate.heritage}</span>` : '';
    const metaInfo = [ageInfo, heritageInfo].filter(Boolean).join(' • ');
    
    // Build social links
    const socialLinks = [];
    if (candidate.twitter) {
        const twitterHandle = candidate.twitter.replace('@', '');
        socialLinks.push(`<a href="https://twitter.com/${twitterHandle}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>`);
    }
    if (candidate.instagram) {
        const instagramHandle = candidate.instagram.replace('@', '');
        socialLinks.push(`<a href="https://instagram.com/${instagramHandle}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>`);
    }
    if (candidate.tiktok) {
        const tiktokHandle = candidate.tiktok.replace('@', '');
        socialLinks.push(`<a href="https://tiktok.com/@${tiktokHandle}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg></a>`);
    }
    if (candidate.facebook) {
        socialLinks.push(`<a href="https://facebook.com/${candidate.facebook}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>`);
    }
    
    // Website button
    const websiteBtn = candidate.website 
        ? `<a href="${candidate.website}" target="_blank" rel="noopener noreferrer" class="btn btn-card">Visit Website</a>`
        : '';
    
    // Truncate bio for consistent card heights (max 120 chars)
    const bioText = truncateText(candidate.background || candidate.notable_info || '', 120) || 'Candidate information coming soon.';

    card.innerHTML = `
        <div class="card-header">
            <div class="candidate-photo">
                ${photoHTML}
                ${placeholderHTML}
            </div>
            <div class="candidate-badge">${badgeText}</div>
        </div>
        <div class="card-body">
            <div class="candidate-header-info">
                <h3 class="candidate-name">${candidate.name || 'Unknown'}</h3>
                <div class="candidate-badges-row">
                    ${partyBadge}
                    ${statusIndicator}
                </div>
            </div>
            <p class="candidate-position">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${location}${districtDisplay ? ` • ${districtDisplay}` : ''}
            </p>
            ${metaInfo ? `<p class="candidate-meta">${metaInfo}</p>` : ''}
            <p class="candidate-bio">${bioText}</p>
        </div>
        <div class="card-footer">
            <div class="social-links">
                ${socialLinks.join('')}
            </div>
            <button class="btn btn-primary btn-view-details" data-candidate-id="${candidate.id}">View Details</button>
        </div>
    `;
    
    // Add click handler to navigate to full page
    const viewDetailsBtn = card.querySelector('.btn-view-details');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateToCandidatePage(candidate);
        });
    }

    // Also make the card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on links or buttons
        if (!e.target.closest('a') && !e.target.closest('button')) {
            navigateToCandidatePage(candidate);
        }
    });

    return card;
}

// ===================================
// Candidate Filtering & Search
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');

let currentFilter = 'all';
let currentSearch = '';

let candidateCards = [];

// Update candidates count display
function updateCandidatesCount(visibleCount, totalCount) {
    const countElement = document.getElementById('candidates-count');
    if (!countElement) return;

    if (visibleCount === totalCount) {
        countElement.textContent = `${totalCount} candidates`;
    } else {
        countElement.textContent = `${visibleCount} of ${totalCount}`;
    }
}

function initializeFilters() {
    // Re-query candidate cards after they're rendered
    candidateCards = document.querySelectorAll('.candidate-card');
}

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
    const candidateCards = document.querySelectorAll('.candidate-card');
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

    // Update the count display
    updateCandidatesCount(visibleCount, allCandidates.length);

    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'block';
        candidatesGrid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        candidatesGrid.style.display = 'grid';
        // Ensure grid template columns are maintained
        candidatesGrid.style.gridTemplateColumns = '';
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

newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            // Show success
            newsletterForm.innerHTML = `
                <div class="form-success">
                    <div class="success-icon">✓</div>
                    <p>${data.message || 'Thanks for subscribing! We\'ll keep you updated on Latino Leaders 2026.'}</p>
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
        } else {
            // Show friendly error
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            showSubscribeError(emailInput, data.error || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Subscribe error:', error);
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Friendly offline message
        const message = navigator.onLine === false || error.message?.includes('fetch')
            ? "You appear to be offline. Please check your connection and try again."
            : "Something went wrong. Please try again.";
        showSubscribeError(emailInput, message);
    }
});

function showSubscribeError(inputElement, message) {
    // Remove any existing error
    const existingError = inputElement.parentElement.querySelector('.subscribe-error');
    if (existingError) existingError.remove();

    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'subscribe-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#F97066';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '8px';
    errorDiv.style.textAlign = 'center';

    inputElement.parentElement.appendChild(errorDiv);

    // Remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

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

// Elements to animate (candidate cards are now loaded dynamically)
const animateElements = document.querySelectorAll('.impact-card, .feature, .about-content');

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
            } else if (text.includes('M') && !text.includes('M+')) {
                // Handle "M" without "+" (e.g., "36M")
                const num = parseInt(text);
                entry.target.textContent = '0M';
                animateCounter(entry.target, num, 'M');
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
// Card hover effects (re-initialized after cards load)
// ===================================

function initializeCardHovers() {
    const candidateCards = document.querySelectorAll('.candidate-card');
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
}

// Initialize card hovers after candidates load
setTimeout(initializeCardHovers, 1000);

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

    // Load candidates from API
    renderSkeletonCandidates(6);
    loadCandidates();
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
