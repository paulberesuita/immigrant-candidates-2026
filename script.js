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

function renderCandidatesError(message) {
    if (!candidatesGrid) return;
    clearCandidatesGrid();

    const panel = document.createElement('div');
    panel.className = 'error-panel';
    panel.innerHTML = `
        <h3>Couldn’t load candidates</h3>
        <p>${escapeHTML(message || 'Please try again.')}</p>
        <button type="button" class="btn btn-primary" id="retry-load">Retry</button>
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

    // Parse key issues
    const issues = candidate.key_issues ? candidate.key_issues.split(',').map(i => i.trim()).slice(0, 3) : [];

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
            ${issues.length > 0 ? `<div class="candidate-issues">${issues.map(issue => `<span class="issue-tag">${issue}</span>`).join('')}</div>` : ''}
        </div>
        <div class="card-footer">
            <div class="social-links">
                ${socialLinks.join('')}
            </div>
            <button class="btn btn-primary btn-view-details" data-candidate-id="${candidate.id}">View Details</button>
        </div>
    `;
    
    // Add click handler to open modal
    const viewDetailsBtn = card.querySelector('.btn-view-details');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openCandidateModal(candidate, viewDetailsBtn);
        });
    }
    
    // Also make the card clickable (optional)
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't open modal if clicking on links or buttons
        if (!e.target.closest('a') && !e.target.closest('button')) {
            openCandidateModal(candidate, card);
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
// Candidate Modal
// ===================================

let currentCandidate = null;
let lastFocusedElement = null;
let modalTrapHandler = null;

function setupModalListeners() {
    const modal = document.getElementById('candidate-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalOverlay || !modalClose) return;
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', closeCandidateModal);
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', closeCandidateModal);
    
    // Close modal on ESC key (and keep in sync with focus trap)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCandidateModal();
        }
    });
}

function getFocusableElements(container) {
    if (!container) return [];
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ];
    return Array.from(container.querySelectorAll(focusableSelectors.join(',')))
        .filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
}

function attachModalFocusTrap(modal, modalContent) {
    if (!modal || !modalContent) return;

    if (modalTrapHandler) {
        modal.removeEventListener('keydown', modalTrapHandler);
    }

    modalTrapHandler = (e) => {
        if (e.key !== 'Tab') return;
        if (!modal.classList.contains('active')) return;

        const focusables = getFocusableElements(modalContent);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === modal) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    modal.addEventListener('keydown', modalTrapHandler);
}

function openCandidateModal(candidate, triggerElement) {
    currentCandidate = candidate;
    const modal = document.getElementById('candidate-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    
    if (!modal || !modalBody) return;

    lastFocusedElement = triggerElement || document.activeElement;
    
    // Build full candidate details HTML
    const modalHTML = buildModalContent(candidate);
    modalBody.innerHTML = modalHTML;

    // Wire aria-labelledby to the candidate name, for screen readers
    const titleEl = modalBody.querySelector('.modal-candidate-name');
    if (titleEl) {
        titleEl.id = 'candidate-modal-title';
        modal.setAttribute('aria-labelledby', 'candidate-modal-title');
    } else {
        modal.removeAttribute('aria-labelledby');
    }
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent body scrolling

    // Focus management + focus trap
    if (modalClose) modalClose.focus();
    attachModalFocusTrap(modal, modalContent);
}

function closeCandidateModal() {
    const modal = document.getElementById('candidate-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore body scrolling
    currentCandidate = null;

    // Remove focus trap listener
    if (modalTrapHandler) {
        modal.removeEventListener('keydown', modalTrapHandler);
        modalTrapHandler = null;
    }

    // Restore focus to the element that launched the modal (keyboard UX)
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
    lastFocusedElement = null;
}

function buildModalContent(candidate) {
    // Get initials for photo placeholder (fallback)
    const initials = candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
    
    // Build photo HTML
    const photoHTML = candidate.image_url && candidate.image_url.trim()
        ? `<img src="${candidate.image_url}" alt="${candidate.name || 'Candidate'}" class="modal-candidate-image">`
        : `<div class="modal-photo-placeholder">${initials}</div>`;
    
    // Format office type badge
    let badgeText = candidate.office_type || 'Candidate';
    if (candidate.office_level === 'federal') {
        badgeText = 'U.S. Congress';
    } else if (candidate.office_level === 'state') {
        badgeText = candidate.office_type || 'State Office';
    } else {
        badgeText = candidate.office_type || 'Local Office';
    }
    
    // Format position
    const position = candidate.district 
        ? `${candidate.state}-${candidate.district} ${badgeText}` 
        : `${candidate.state} ${badgeText}`;
    
    // Build party badge
    const partyBadge = candidate.party 
        ? `<span class="party-badge party-${candidate.party.toLowerCase()}">${candidate.party}</span>`
        : '';
    
    // Build status/incumbent indicator
    const statusIndicator = candidate.is_incumbent 
        ? `<span class="status-badge status-incumbent">Incumbent</span>`
        : (candidate.status ? `<span class="status-badge">${candidate.status}</span>` : '');
    
    // Build age/heritage info
    const ageInfo = candidate.age ? `<span>Age ${candidate.age}</span>` : '';
    const heritageInfo = candidate.heritage ? `<span>${candidate.heritage}</span>` : '';
    const metaInfo = [ageInfo, heritageInfo].filter(Boolean).join(' • ');
    
    // Parse all key issues (not just first 3)
    const allIssues = candidate.key_issues ? candidate.key_issues.split(',').map(i => i.trim()) : [];
    
    // Build social links
    const socialLinks = [];
    if (candidate.twitter) {
        const twitterHandle = candidate.twitter.replace('@', '');
        socialLinks.push(`<a href="https://twitter.com/${twitterHandle}" target="_blank" rel="noopener noreferrer" class="social-link modal-social-link" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>`);
    }
    if (candidate.instagram) {
        const instagramHandle = candidate.instagram.replace('@', '');
        socialLinks.push(`<a href="https://instagram.com/${instagramHandle}" target="_blank" rel="noopener noreferrer" class="social-link modal-social-link" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>`);
    }
    if (candidate.tiktok) {
        const tiktokHandle = candidate.tiktok.replace('@', '');
        socialLinks.push(`<a href="https://tiktok.com/@${tiktokHandle}" target="_blank" rel="noopener noreferrer" class="social-link modal-social-link" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg></a>`);
    }
    if (candidate.facebook) {
        socialLinks.push(`<a href="https://facebook.com/${candidate.facebook}" target="_blank" rel="noopener noreferrer" class="social-link modal-social-link" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>`);
    }
    
    return `
        <div class="modal-header">
            <div class="modal-photo-section">
                ${photoHTML}
                <div class="modal-badge">${badgeText}</div>
            </div>
            <div class="modal-title-section">
                <h2 class="modal-candidate-name">${candidate.name || 'Unknown'}</h2>
                ${partyBadge || statusIndicator ? `<div class="modal-badges-row">${partyBadge}${statusIndicator}</div>` : ''}
                ${metaInfo ? `<p class="modal-meta">${metaInfo}</p>` : ''}
            </div>
        </div>
        
        <div class="modal-body-content">
            <div class="modal-section">
                <h3 class="modal-section-title">Campaign Information</h3>
                <div class="modal-info-grid">
                    ${candidate.state ? `<div class="modal-info-item"><strong>State:</strong> ${candidate.state}</div>` : ''}
                    ${candidate.district ? `<div class="modal-info-item"><strong>District:</strong> ${candidate.district}</div>` : ''}
                    ${candidate.office_level ? `<div class="modal-info-item"><strong>Office Level:</strong> <span class="text-capitalize">${candidate.office_level}</span></div>` : ''}
                    ${candidate.office_type ? `<div class="modal-info-item"><strong>Office Type:</strong> ${candidate.office_type}</div>` : ''}
                    ${candidate.party ? `<div class="modal-info-item"><strong>Party:</strong> ${candidate.party === 'D' ? 'Democratic' : candidate.party === 'R' ? 'Republican' : 'Independent'}</div>` : ''}
                    ${candidate.is_incumbent !== undefined ? `<div class="modal-info-item"><strong>Incumbent:</strong> ${candidate.is_incumbent ? 'Yes' : 'No'}</div>` : ''}
                    ${candidate.status ? `<div class="modal-info-item"><strong>Status:</strong> ${candidate.status}</div>` : ''}
                </div>
            </div>
            
            ${candidate.background ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Background</h3>
                <p class="modal-text">${candidate.background}</p>
            </div>
            ` : ''}
            
            ${candidate.notable_info ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Notable Information</h3>
                <p class="modal-text">${candidate.notable_info}</p>
            </div>
            ` : ''}
            
            ${allIssues.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Key Issues</h3>
                <div class="modal-issues">
                    ${allIssues.map(issue => `<span class="modal-issue-tag">${issue}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${candidate.endorsements ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Endorsements</h3>
                <p class="modal-text">${candidate.endorsements}</p>
            </div>
            ` : ''}
            
            <div class="modal-section">
                <h3 class="modal-section-title">Connect</h3>
                <div class="modal-social-section">
                    ${socialLinks.length > 0 ? `<div class="modal-social-links">${socialLinks.join('')}</div>` : '<p class="modal-text">No social media links available.</p>'}
                    ${candidate.website ? `<a href="${candidate.website}" target="_blank" rel="noopener noreferrer" class="btn btn-primary modal-website-btn">Visit Campaign Website</a>` : ''}
                </div>
            </div>
        </div>
    `;
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
    
    // Modal event listeners
    setupModalListeners();
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
