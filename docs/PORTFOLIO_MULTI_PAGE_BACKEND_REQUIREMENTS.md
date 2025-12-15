# Portfolio Multi-Page Layout - Backend Requirements

## Overview

This document outlines the backend changes needed to support multi-page portfolio layouts with navigation headers.

## Current Frontend Implementation

The frontend now supports:

- **Single-page layout**: All sections on one scrollable page (existing)
- **Multi-page layout**: Each section on a separate route with navigation header (new)

### URL Structure

- Home page: `/portfolio/:slug`
- Section pages: `/portfolio/:slug/:sectionId`

Example:

- `/portfolio/john-doe` - Home page (shows hero + all sections)
- `/portfolio/john-doe/about` - About section page
- `/portfolio/john-doe/skills` - Skills section page
- `/portfolio/john-doe/projects` - Projects section page

## Backend Requirements

### 1. Section Slug/ID Support

**Current Section Structure:**

```json
{
  "sections": [
    {
      "id": "about-1",
      "type": "about",
      "title": "About Me",
      "enabled": true,
      "order": 0,
      "content": { ... }
    }
  ]
}
```

**Required Addition:**
Add an optional `slug` field to each section for custom routing:

```json
{
  "sections": [
    {
      "id": "about-1",
      "slug": "about",  // NEW: Optional custom slug for routing
      "type": "about",
      "title": "About Me",
      "enabled": true,
      "order": 0,
      "content": { ... }
    }
  ]
}
```

**Slug Generation Rules:**

- If `slug` is provided, use it for routing
- If `slug` is not provided, generate from `id` (e.g., "about-1" → "about")
- If `id` is not available, use `type` as fallback
- Slugs should be URL-safe (lowercase, alphanumeric, hyphens only)

### 2. Database Schema Update

**MongoDB Example:**

```javascript
{
  sections: [
    {
      id: String, // Required: Unique identifier
      slug: String, // Optional: Custom URL slug (e.g., "about", "my-skills")
      type: String, // Required: Section type (about, skills, projects, etc.)
      title: String, // Required: Display title
      enabled: Boolean, // Required: Whether section is visible
      order: Number, // Required: Display order
      content: Object, // Required: Section content
      // ... other fields
    },
  ];
}
```

**PostgreSQL Example:**

```sql
-- If using JSONB for sections
ALTER TABLE portfolios
ALTER COLUMN sections TYPE JSONB;

-- Example section structure in JSONB:
-- {
--   "id": "about-1",
--   "slug": "about",
--   "type": "about",
--   "title": "About Me",
--   "enabled": true,
--   "order": 0,
--   "content": {...}
-- }
```

### 3. API Endpoints

**No new endpoints required!** The existing endpoints work:

- `GET /api/portfolio/:slug` - Returns full portfolio (works for both layouts)
- `GET /api/portfolio/:slug/:sectionId` - **Optional**: If you want to optimize, you can add this endpoint to return only a specific section

**Current Endpoint Behavior:**
The frontend will:

1. Fetch the full portfolio using `GET /api/portfolio/:slug`
2. Filter sections client-side based on `sectionId` in the URL
3. Display only the matching section for multi-page layouts

**Optional Optimization:**
If you want to optimize bandwidth, you can add:

```
GET /api/portfolio/:slug/:sectionId
```

This would return only the requested section data instead of the full portfolio.

### 4. Data Validation

**When saving portfolio (POST/PUT `/api/portfolio`):**

1. **Validate section slugs:**

   - Must be unique within the portfolio
   - Must be URL-safe (lowercase, alphanumeric, hyphens only)
   - Must not conflict with reserved routes (e.g., "home", "index")

2. **Auto-generate slugs if missing:**

   ```javascript
   // Pseudo-code
   sections.forEach((section, index) => {
     if (!section.slug) {
       // Generate from id or type
       section.slug = section.id
         ? section.id.split("-")[0] // "about-1" → "about"
         : section.type; // "about" → "about"
     }

     // Ensure uniqueness
     let baseSlug = section.slug;
     let counter = 1;
     while (
       sections.some((s) => s.slug === section.slug && s.id !== section.id)
     ) {
       section.slug = `${baseSlug}-${counter}`;
       counter++;
     }
   });
   ```

3. **Normalize slugs:**
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Ensure it starts with a letter or number

### 5. Migration Guide

**For existing portfolios:**

1. **Add slug field to existing sections:**

   ```javascript
   // Migration script example
   db.portfolios.find({}).forEach((portfolio) => {
     portfolio.sections = portfolio.sections.map((section, index) => {
       if (!section.slug) {
         // Generate slug from id or type
         section.slug = section.id
           ? section.id.split("-")[0].toLowerCase()
           : section.type.toLowerCase();
       }
       return section;
     });
     db.portfolios.save(portfolio);
   });
   ```

2. **Ensure uniqueness:**
   - Check for duplicate slugs within each portfolio
   - Append numbers if duplicates exist (e.g., "about", "about-2")

### 6. Example Portfolio Data

**Complete portfolio with multi-page support:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "studentId": "mj18efk150w8nn0bszd",
  "slug": "john-doe",
  "layout": "multi-page",
  "isPublic": true,
  "theme": { ... },
  "hero": {
    "title": "John Doe",
    "subtitle": "Software Developer",
    "image": "https://example.com/photo.jpg",
    "ctaText": "View My Work",
    "ctaLink": "#projects"
  },
  "sections": [
    {
      "id": "about-1",
      "slug": "about",
      "type": "about",
      "title": "About Me",
      "enabled": true,
      "order": 0,
      "content": {
        "text": "I am a software developer..."
      }
    },
    {
      "id": "skills-1",
      "slug": "skills",
      "type": "skills",
      "title": "Skills",
      "enabled": true,
      "order": 1,
      "content": {
        "skills": [...]
      }
    },
    {
      "id": "projects-1",
      "slug": "my-projects",
      "type": "projects",
      "title": "Projects",
      "enabled": true,
      "order": 2,
      "content": {
        "projects": [...]
      }
    }
  ],
  "certificates": [],
  "animations": {
    "enabled": true,
    "type": "fade"
  }
}
```

## Frontend Behavior

### Single-Page Layout

- URL: `/portfolio/:slug`
- Shows: Hero + All sections on one page
- No header navigation

### Multi-Page Layout

- Home URL: `/portfolio/:slug`

  - Shows: Hero + All sections (or just hero, depending on design)
  - Header shows: Logo + Navigation links to all sections

- Section URL: `/portfolio/:slug/:sectionId`
  - Shows: Header + Only the requested section
  - Header shows: Logo + Navigation links (current section highlighted)

## Testing Checklist

- [ ] Portfolio with `layout: "single-page"` works as before
- [ ] Portfolio with `layout: "multi-page"` shows header
- [ ] Navigation links work correctly
- [ ] Section slugs are unique within a portfolio
- [ ] Missing slugs are auto-generated
- [ ] Invalid slugs are rejected/cleaned
- [ ] Existing portfolios migrate correctly
- [ ] Section pages load correctly
- [ ] Home page shows hero + all sections (or just hero)
- [ ] 404 handling for non-existent sections

## Notes

1. **Backward Compatibility**: The frontend will work even if `slug` is not provided - it will generate slugs from `id` or `type`.

2. **Performance**: For large portfolios, consider caching section data or implementing the optional `/api/portfolio/:slug/:sectionId` endpoint.

3. **SEO**: Section slugs should be SEO-friendly and descriptive.

4. **Reserved Routes**: Consider reserving certain slugs (e.g., "home", "index", "admin") to avoid conflicts.
