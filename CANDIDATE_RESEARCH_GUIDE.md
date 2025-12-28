# Candidate Research Guide

This guide documents the process for expanding candidate profiles with thorough, impactful information. Follow this process to maintain consistency across all candidate updates.

---

## Overview

We are updating candidate records in the D1 database with expanded biographical information. Each candidate should have rich, well-researched data that tells their story and highlights their qualifications.

### Completed Candidates (IDs 1-5)
- [x] ID 1: Maxwell Alejandro Frost (FL-10, U.S. House)
- [x] ID 2: Manny Rutinel (CO-08, U.S. House)
- [x] ID 3: Randy Villegas (CA-22, U.S. House)
- [x] ID 4: Nico Parra (GA HD-109, State House)
- [x] ID 5: Fabian Doñate (NV SD-10, State Senate)

### Remaining Candidates
Query the database to see remaining candidates:
```bash
CLOUDFLARE_ACCOUNT_ID=aecf43481a3bb6be96221f961bcfcfb7 npx wrangler d1 execute young-latino-candidates --command "SELECT id, name, state, office_type FROM candidates WHERE id > 5 ORDER BY id" --remote --json
```

---

## Database Fields to Populate

For each candidate, research and update these fields:

| Field | Description | Format |
|-------|-------------|--------|
| `background` | Detailed bio (2-4 sentences) covering origin story, defining moments, path to politics | Plain text |
| `education` | All degrees, institutions, years | Plain text, semicolon-separated |
| `leadership_roles` | Current leadership positions | Plain text, semicolon-separated |
| `committees` | Committee assignments with roles | JSON array: `[{"name": "...", "role": "..."}]` |
| `notable_legislation` | Key bills/initiatives | JSON array: `[{"title": "...", "description": "...", "status": "..."}]` |
| `career_before_politics` | Professional background | Plain text, semicolon-separated |
| `family_background` | Heritage, immigrant story, family | Plain text |
| `awards` | Recognition, honors, "firsts" | Plain text, semicolon-separated |
| `endorsements` | Key endorsers | JSON array: `[{"name": "...", "type": "..."}]` |
| `key_issues` | Policy priorities | Plain text, comma-separated |

### Endorsement Types
Use these categories for endorsement `type` field:
- `Political` - elected officials, party organizations, PACs
- `Labor` - unions (AFL-CIO, SEIU, UAW, teachers unions, etc.)
- `Environmental` - conservation/climate groups
- `Advocacy` - issue-based organizations (Planned Parenthood, Equality orgs, etc.)

---

## Research Process

### Step 1: Get Current Data
First, query what data already exists for the candidate:
```bash
CLOUDFLARE_ACCOUNT_ID=aecf43481a3bb6be96221f961bcfcfb7 npx wrangler d1 execute young-latino-candidates --command "SELECT * FROM candidates WHERE id = [ID]" --remote --json
```

### Step 2: Research Sources
Search for information in this order:

1. **Official Sources**
   - Campaign website (usually has bio, issues, endorsements)
   - Official government page (if incumbent)
   - Congress.gov / state legislature website

2. **Biographical Info**
   - Wikipedia
   - Ballotpedia
   - LinkedIn

3. **News & Interviews**
   - Local news profiles
   - National coverage (if notable candidate)
   - Video interviews for personal stories

4. **Endorsements & Legislation**
   - Campaign endorsements page
   - GovTrack / OpenStates for legislation
   - Union and organization announcements

### Step 3: Key Research Queries
Use these search patterns (replace [NAME] with candidate name):

```
[NAME] biography education background
[NAME] family immigrant heritage personal story
[NAME] legislation bills sponsored [YEAR]
[NAME] endorsements unions organizations
[NAME] committees assignments
[NAME] awards recognition achievements
[NAME] campaign issues platform
```

---

## Migration File Format

Create one SQL file per candidate in `/migrations/` folder:

**Filename pattern:** `XXX_update_[firstname]_[lastname].sql`

**Template:**
```sql
-- Migration: Update [Full Name]'s record with expanded information
-- Run with: wrangler d1 execute young-latino-candidates --file=./migrations/XXX_update_[name].sql --remote

UPDATE candidates
SET
    -- Background (detailed bio)
    background = '[2-4 sentence bio with personal story, defining moments, path to politics]',

    -- Education
    education = '[Degree from Institution (Year); next degree...]',

    -- Leadership roles
    leadership_roles = '[Current Position 1; Current Position 2]',

    -- Committees (JSON format)
    committees = '[{"name": "Committee Name", "role": "Role"}]',

    -- Notable legislation (JSON format)
    notable_legislation = '[{"title": "Bill Name", "description": "What it does", "status": "Passed/Introduced/etc"}]',

    -- Career before politics
    career_before_politics = '[Job 1; Job 2; Job 3]',

    -- Family background
    family_background = '[Heritage, immigrant story, family details]',

    -- Awards
    awards = '[Award 1; Award 2; Award 3]',

    -- Endorsements (JSON format)
    endorsements = '[{"name": "Endorser Name", "type": "Political/Labor/Environmental/Advocacy"}]',

    -- Key issues (if updating)
    key_issues = '[Issue 1, Issue 2, Issue 3]'

WHERE id = [ID];
```

### SQL Escaping Rules
- Single quotes in text must be escaped as two single quotes: `''`
  - Example: `Biden''s campaign` not `Biden's campaign`
- Keep JSON valid - use double quotes inside JSON strings

---

## Execute Migration

After creating the migration file:

```bash
CLOUDFLARE_ACCOUNT_ID=aecf43481a3bb6be96221f961bcfcfb7 npx wrangler d1 execute young-latino-candidates --file=./migrations/XXX_update_[name].sql --remote
```

### Verify Success
```bash
CLOUDFLARE_ACCOUNT_ID=aecf43481a3bb6be96221f961bcfcfb7 npx wrangler d1 execute young-latino-candidates --command "SELECT id, name, education, awards FROM candidates WHERE id = [ID]" --remote --json
```

---

## Example: Completed Migration (Fabian Doñate)

See `migrations/003_update_fabian_donate.sql` for a complete example of the expected output quality.

Key elements that made it impactful:
- **Personal story:** Translating diabetes diagnosis for his Spanish-speaking father
- **Specific achievements:** Youngest state senator in Nevada history at 24
- **Detailed education:** Degrees with years and institutions
- **Legislation with context:** What each bill does and its status
- **Structured endorsements:** Categorized by type (Labor, Environmental, Political)

---

## Workflow Summary

1. **Work in batches of 5 candidates** to maintain focus and quality
2. **Query current data** to see what's already there
3. **Research thoroughly** using official sources first
4. **Create migration file** following the template
5. **Execute migration** against remote D1 database
6. **Verify the update** worked correctly
7. **Move to next batch**

---

## Git Workflow Reminder

Per `collaborator.md`:
- Commit changes to the `brenda` branch (for Brenda) or your own branch
- Do NOT push directly to `main`
- Do NOT merge without permission

```bash
git checkout [your-branch]
git pull
# make changes
git add .
git commit -m "feat: add expanded info for [candidate names]"
git push
```

---

## Questions?

If unclear on any candidate's information or how to format something, refer to the completed migrations in `/migrations/` folder (003-007) as examples.
