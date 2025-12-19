# Latino Leaders 2026 - TODO List

Prioritized list of improvements for the project.

---

## Priority 1: Critical

These items are essential for a production-ready informational site.

- [ ] **Add database schema file** - Create `schema.sql` with the `candidates` table definition for reproducibility
- [ ] **Add seed data script** - Create a script or SQL file to populate the database with initial candidates
- [ ] **Add favicon and site icons** - Missing favicon.ico and apple-touch-icon
- [ ] **Add meta description** - SEO meta tag missing in `<head>`
- [ ] **Add Open Graph tags** - For proper social media sharing previews
- [ ] **Add Twitter Card tags** - For Twitter/X sharing previews

---

## Priority 2: High

Important for SEO, discoverability, and professional polish.

- [ ] **Create robots.txt** - Allow search engine crawling
- [ ] **Create sitemap.xml** - Help search engines index the site
- [ ] **Add custom 404 page** - Better UX for broken links
- [ ] **Implement newsletter backend** - Currently simulated; integrate with Mailchimp, ConvertKit, or similar
- [ ] **Add structured data (JSON-LD)** - Schema.org markup for candidates/organization
- [ ] **Restrict CORS in production** - Currently wide-open (`*`); should limit to your domain

---

## Priority 3: Medium

Developer experience and maintainability improvements.

- [ ] **Add ESLint configuration** - Enforce code quality and catch bugs
- [ ] **Add Prettier configuration** - Consistent code formatting
- [ ] **Add basic CI/CD pipeline** - GitHub Actions for linting and deployment
- [ ] **Create `.env.example`** - Document required environment variables
- [ ] **Add error tracking** - Integrate Sentry or similar for production error monitoring
- [ ] **Add basic unit tests** - Test critical functions like `escapeHTML`, `truncateText`

---

## Priority 4: Low

Nice-to-have features and enhancements.

- [ ] **Add pagination** - Currently loads all candidates at once; may need pagination at scale
- [ ] **Add sorting options** - Allow users to sort by name, state, party, etc.
- [ ] **Add social share buttons** - Let users share candidate profiles
- [ ] **Add "skip to content" link** - Accessibility improvement for keyboard users
- [ ] **Create Privacy Policy page** - Standard legal page for informational sites
- [ ] **Add service worker** - Offline support / PWA capabilities
- [ ] **Add web manifest** - PWA installability
- [ ] **Optimize images** - Add WebP format, srcset for responsive images
- [ ] **Add candidate submission form** - Allow candidates to request to be added

---

## Completed

- [x] Candidate grid with filtering and search
- [x] Candidate detail modal with full information
- [x] Mobile-responsive design
- [x] Accessible navigation and modal (focus trap, ARIA, keyboard nav)
- [x] API endpoint for fetching candidates
- [x] Skeleton loading states
- [x] Error handling with retry button
- [x] Counter animations for impact stats

---

## Notes

- This is primarily an **informational site**, so admin/authentication features are not needed
- The site uses Cloudflare Pages + D1, so improvements should stay within that ecosystem
- Focus on SEO and discoverability since the goal is voter education
