# Latino Leaders 2026 - TODO List

---

## Inbox

- [ ] Restrict CORS in production - Currently wide-open (`*`); should limit to your domain
- [ ] Add pagination - Currently loads all candidates at once; may need pagination at scale
- [ ] Add sorting options - Allow users to sort by name, state, party, etc.
- [ ] Add social share buttons - Let users share candidate profiles
- [ ] Add "skip to content" link - Accessibility improvement for keyboard users
- [ ] Create Privacy Policy page - Standard legal page for informational sites
- [ ] Add web manifest - PWA installability
- [ ] Optimize images - Add WebP format, srcset for responsive images
- [ ] Add candidate submission form - Allow candidates to request to be added
- [ ] Add Spanish language support - Translate site content for Spanish-speaking users

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
- [x] Migrated from Tailwind build to plain CSS
- [x] Added Plausible analytics (privacy-friendly)
- [x] Added SVG favicon (Phosphor star icon)
- [x] Email subscription with D1 database + Resend welcome emails
- [x] Add meta description
- [x] Add Open Graph tags
- [x] Add Twitter Card tags
- [x] Create robots.txt
- [x] Create sitemap.xml
- [x] Add custom 404 page
- [x] Add structured data (JSON-LD)
- [x] Add service worker for offline support
