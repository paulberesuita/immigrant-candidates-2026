// ===================================
// Candidate Page JavaScript
// ===================================

// Get slug from URL path: /candidate/slug-here
function getSlugFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/candidate\/([^\/]+)/);
    return match ? match[1] : null;
}

// Generate slug from candidate data (for share links)
function generateCandidateSlug(candidate) {
    if (!candidate || !candidate.name) return null;

    const namePart = candidate.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const statePart = (candidate.state || '').toLowerCase();
    return statePart ? `${namePart}-${statePart}` : namePart;
}

// Fetch candidate data from API
async function fetchCandidate(slug) {
    try {
        const response = await fetch(`/api/candidate/${slug}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch candidate');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching candidate:', error);
        return null;
    }
}

// Show loading state
function showLoading() {
    document.getElementById('candidate-loading').style.display = 'flex';
    document.getElementById('candidate-error').style.display = 'none';
    document.getElementById('candidate-content').style.display = 'none';
}

// Show error state
function showError() {
    document.getElementById('candidate-loading').style.display = 'none';
    document.getElementById('candidate-error').style.display = 'flex';
    document.getElementById('candidate-content').style.display = 'none';
}

// Show candidate content
function showContent() {
    document.getElementById('candidate-loading').style.display = 'none';
    document.getElementById('candidate-error').style.display = 'none';
    document.getElementById('candidate-content').style.display = 'block';
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Render the candidate page
function renderCandidate(candidate) {
    // Update page title
    document.title = `${candidate.name} | Latino Leaders 2026`;

    // Render hero section
    renderHero(candidate);

    // Render main content sections
    renderAboutSection(candidate);
    renderHeritageSection(candidate);
    renderCareerSection(candidate);
    renderIssuesSection(candidate);
    renderLegislationSection(candidate);
    renderEndorsementsSection(candidate);

    // Render sidebar
    renderQuickFacts(candidate);
    renderCommittees(candidate);
    renderSocialLinks(candidate);
    setupShareButton(candidate);

    showContent();
}

// Render hero section
function renderHero(candidate) {
    // Photo
    const photoContainer = document.getElementById('hero-photo');
    const initials = candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

    if (candidate.image_url && candidate.image_url.trim()) {
        photoContainer.innerHTML = `<img src="${escapeHTML(candidate.image_url)}" alt="${escapeHTML(candidate.name)}" class="hero-photo-img">`;
    } else {
        photoContainer.innerHTML = `<div class="hero-photo-placeholder">${initials}</div>`;
    }

    // Badges
    const badgesContainer = document.getElementById('hero-badges');
    let badges = [];

    // Office level badge
    let officeBadge = candidate.office_type || 'Candidate';
    if (candidate.office_level === 'federal') {
        officeBadge = 'U.S. Congress';
    } else if (candidate.office_level === 'state') {
        officeBadge = candidate.office_type || 'State Office';
    }
    badges.push(`<span class="hero-badge-office">${escapeHTML(officeBadge)}</span>`);

    // Party badge
    if (candidate.party) {
        const partyName = candidate.party === 'D' ? 'Democrat' : candidate.party === 'R' ? 'Republican' : 'Independent';
        badges.push(`<span class="hero-badge-party party-${candidate.party.toLowerCase()}">${partyName}</span>`);
    }

    // Incumbent badge
    if (candidate.is_incumbent) {
        badges.push(`<span class="hero-badge-incumbent">Incumbent</span>`);
    }

    badgesContainer.innerHTML = badges.join('');

    // Name
    document.getElementById('candidate-name').textContent = candidate.name || 'Unknown';

    // Position
    const position = candidate.district
        ? `${candidate.state}-${candidate.district} ${officeBadge}`
        : `${candidate.state} ${officeBadge}`;
    document.getElementById('candidate-position').textContent = position;

    // Meta info
    const metaContainer = document.getElementById('candidate-meta');
    let metaItems = [];
    if (candidate.age) metaItems.push(`<span>Age ${candidate.age}</span>`);
    if (candidate.heritage) metaItems.push(`<span>${escapeHTML(candidate.heritage)}</span>`);
    if (candidate.leadership_roles) metaItems.push(`<span>${escapeHTML(candidate.leadership_roles)}</span>`);
    metaContainer.innerHTML = metaItems.join('<span class="meta-separator">•</span>');

    // Action buttons
    const actionsContainer = document.getElementById('hero-actions');
    let actions = [];
    if (candidate.website) {
        actions.push(`<a href="${escapeHTML(candidate.website)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit Campaign Website</a>`);
    }
    actionsContainer.innerHTML = actions.join('');
}

// Render About section
function renderAboutSection(candidate) {
    const section = document.getElementById('section-about');
    const content = document.getElementById('about-content');

    if (candidate.background) {
        content.innerHTML = `<p>${escapeHTML(candidate.background)}</p>`;
        section.style.display = 'block';
    }
}

// Render Heritage section
function renderHeritageSection(candidate) {
    const section = document.getElementById('section-heritage');
    const content = document.getElementById('heritage-content');

    if (candidate.family_background) {
        content.innerHTML = `<p>${escapeHTML(candidate.family_background)}</p>`;
        section.style.display = 'block';
    }
}

// Render Career section
function renderCareerSection(candidate) {
    const section = document.getElementById('section-career');
    const content = document.getElementById('career-content');

    let careerHTML = '';

    if (candidate.career_before_politics) {
        careerHTML += `
            <div class="career-block">
                <h4>Before Politics</h4>
                <p>${escapeHTML(candidate.career_before_politics)}</p>
            </div>
        `;
    }

    if (candidate.education) {
        careerHTML += `
            <div class="career-block">
                <h4>Education</h4>
                <p>${escapeHTML(candidate.education)}</p>
            </div>
        `;
    }

    if (candidate.awards) {
        careerHTML += `
            <div class="career-block">
                <h4>Awards & Recognition</h4>
                <p>${escapeHTML(candidate.awards)}</p>
            </div>
        `;
    }

    if (careerHTML) {
        content.innerHTML = careerHTML;
        section.style.display = 'block';
    }
}

// Render Issues section
function renderIssuesSection(candidate) {
    const section = document.getElementById('section-issues');
    const content = document.getElementById('issues-content');

    if (candidate.key_issues) {
        const issues = candidate.key_issues.split(',').map(i => i.trim()).filter(Boolean);
        if (issues.length > 0) {
            content.innerHTML = issues.map(issue => `
                <div class="issue-card">
                    <span class="issue-icon">✦</span>
                    <span class="issue-text">${escapeHTML(issue)}</span>
                </div>
            `).join('');
            section.style.display = 'block';
        }
    }
}

// Render Legislation section
function renderLegislationSection(candidate) {
    const section = document.getElementById('section-legislation');
    const content = document.getElementById('legislation-content');

    if (candidate.notable_legislation) {
        let legislation = [];
        try {
            legislation = JSON.parse(candidate.notable_legislation);
        } catch (e) {
            // If not JSON, treat as comma-separated text
            legislation = candidate.notable_legislation.split(',').map(l => ({ title: l.trim() }));
        }

        if (legislation.length > 0) {
            content.innerHTML = legislation.map(bill => `
                <div class="legislation-item">
                    <h4 class="legislation-title">${escapeHTML(bill.title || bill)}</h4>
                    ${bill.description ? `<p class="legislation-desc">${escapeHTML(bill.description)}</p>` : ''}
                    ${bill.status ? `<span class="legislation-status">${escapeHTML(bill.status)}</span>` : ''}
                </div>
            `).join('');
            section.style.display = 'block';
        }
    }
}

// Render Endorsements section
function renderEndorsementsSection(candidate) {
    const section = document.getElementById('section-endorsements');
    const content = document.getElementById('endorsements-content');

    if (candidate.endorsements) {
        let endorsements = [];
        try {
            endorsements = JSON.parse(candidate.endorsements);
        } catch (e) {
            // If not JSON, split by comma or semicolon
            endorsements = candidate.endorsements.split(/[,;]/).map(e => e.trim()).filter(Boolean);
        }

        if (endorsements.length > 0) {
            content.innerHTML = endorsements.map(endorsement => {
                const name = typeof endorsement === 'string' ? endorsement : endorsement.name;
                const type = typeof endorsement === 'object' && endorsement.type ? endorsement.type : '';
                return `
                    <div class="endorsement-card">
                        <span class="endorsement-name">${escapeHTML(name)}</span>
                        ${type ? `<span class="endorsement-type">${escapeHTML(type)}</span>` : ''}
                    </div>
                `;
            }).join('');
            section.style.display = 'block';
        }
    }
}

// Render Quick Facts sidebar
function renderQuickFacts(candidate) {
    const list = document.getElementById('quick-facts-list');
    let facts = [];

    if (candidate.state) {
        facts.push(`<dt>State</dt><dd>${escapeHTML(candidate.state)}</dd>`);
    }
    if (candidate.district) {
        facts.push(`<dt>District</dt><dd>${escapeHTML(candidate.district)}</dd>`);
    }
    if (candidate.office_level) {
        facts.push(`<dt>Office Level</dt><dd class="text-capitalize">${escapeHTML(candidate.office_level)}</dd>`);
    }
    if (candidate.party) {
        const partyFull = candidate.party === 'D' ? 'Democratic' : candidate.party === 'R' ? 'Republican' : 'Independent';
        facts.push(`<dt>Party</dt><dd>${partyFull}</dd>`);
    }
    if (candidate.age) {
        facts.push(`<dt>Age</dt><dd>${candidate.age}</dd>`);
    }
    if (candidate.heritage) {
        facts.push(`<dt>Heritage</dt><dd>${escapeHTML(candidate.heritage)}</dd>`);
    }
    if (candidate.education) {
        facts.push(`<dt>Education</dt><dd>${escapeHTML(candidate.education)}</dd>`);
    }
    if (candidate.is_incumbent !== undefined) {
        facts.push(`<dt>Incumbent</dt><dd>${candidate.is_incumbent ? 'Yes' : 'No'}</dd>`);
    }

    list.innerHTML = facts.join('');
}

// Render Committees sidebar
function renderCommittees(candidate) {
    const card = document.getElementById('committees-card');
    const list = document.getElementById('committees-list');

    if (candidate.committees) {
        let committees = [];
        try {
            committees = JSON.parse(candidate.committees);
        } catch (e) {
            committees = candidate.committees.split(',').map(c => c.trim()).filter(Boolean);
        }

        if (committees.length > 0) {
            list.innerHTML = committees.map(committee => {
                const name = typeof committee === 'string' ? committee : committee.name;
                const role = typeof committee === 'object' && committee.role ? committee.role : '';
                return `
                    <li class="committee-item">
                        <span class="committee-name">${escapeHTML(name)}</span>
                        ${role ? `<span class="committee-role">${escapeHTML(role)}</span>` : ''}
                    </li>
                `;
            }).join('');
            card.style.display = 'block';
        }
    }
}

// Render Social Links
function renderSocialLinks(candidate) {
    const container = document.getElementById('social-links');
    const websiteBtn = document.getElementById('website-btn');

    let links = [];

    if (candidate.twitter) {
        const handle = candidate.twitter.replace('@', '');
        links.push(`
            <a href="https://twitter.com/${handle}" target="_blank" rel="noopener noreferrer" class="social-link-card" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                <span>Twitter</span>
            </a>
        `);
    }

    if (candidate.instagram) {
        const handle = candidate.instagram.replace('@', '');
        links.push(`
            <a href="https://instagram.com/${handle}" target="_blank" rel="noopener noreferrer" class="social-link-card" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>Instagram</span>
            </a>
        `);
    }

    if (candidate.tiktok) {
        const handle = candidate.tiktok.replace('@', '');
        links.push(`
            <a href="https://tiktok.com/@${handle}" target="_blank" rel="noopener noreferrer" class="social-link-card" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
                <span>TikTok</span>
            </a>
        `);
    }

    if (candidate.facebook) {
        links.push(`
            <a href="https://facebook.com/${candidate.facebook}" target="_blank" rel="noopener noreferrer" class="social-link-card" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <span>Facebook</span>
            </a>
        `);
    }

    if (links.length > 0) {
        container.innerHTML = links.join('');
    } else {
        container.innerHTML = '<p class="no-social">No social media links available.</p>';
    }

    // Website button
    if (candidate.website) {
        websiteBtn.href = candidate.website;
        websiteBtn.style.display = 'block';
    }
}

// Setup share button
function setupShareButton(candidate) {
    const shareBtn = document.getElementById('share-btn');

    shareBtn.addEventListener('click', () => {
        const url = window.location.href;

        navigator.clipboard.writeText(url).then(() => {
            const originalHTML = shareBtn.innerHTML;
            shareBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Link Copied!
            `;
            shareBtn.classList.add('copied');

            setTimeout(() => {
                shareBtn.innerHTML = originalHTML;
                shareBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });
}

// Mobile navigation toggle
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
}

// Initialize page
async function init() {
    setupNavigation();
    showLoading();

    const slug = getSlugFromUrl();

    if (!slug) {
        showError();
        return;
    }

    const candidate = await fetchCandidate(slug);

    if (!candidate) {
        showError();
        return;
    }

    renderCandidate(candidate);
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);
