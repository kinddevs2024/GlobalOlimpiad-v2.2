# Portfolio Logo - Backend Requirements

## Overview

This document outlines the backend changes needed to support portfolio logo uploads and display.

## Frontend Implementation

The frontend now supports:
- **Logo Upload**: Students can upload a logo image for their portfolio
- **Logo Display**: Logo appears in the portfolio header (for multi-page layouts) or can be used elsewhere
- **Logo Management**: Students can remove or replace their portfolio logo

## Backend Requirements

### 1. Database Schema Update

Add a `logo` field to the portfolio document/table:

**MongoDB Example:**
```javascript
{
  _id: ObjectId,
  studentId: String,
  slug: String,
  layout: String,
  logo: String,  // NEW: URL to uploaded logo image
  theme: Object,
  hero: Object,
  sections: Array,
  // ... other fields
}
```

**PostgreSQL Example:**
```sql
ALTER TABLE portfolios 
ADD COLUMN logo VARCHAR(500);

-- Or if using JSONB:
-- The logo field will be stored in the JSONB column
```

### 2. API Endpoint: Upload Portfolio Logo

**Endpoint:** `POST /api/upload/portfolio-logo`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with field name `logo` containing the image file
- Authentication: Required (student must be authenticated)

**Request Example:**
```javascript
const formData = new FormData();
formData.append("logo", logoFile); // File object

fetch("/api/upload/portfolio-logo", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <token>"
  },
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "logoUrl": "https://example.com/uploads/portfolios/logo-1234567890.jpg",
  // OR
  "url": "https://example.com/uploads/portfolios/logo-1234567890.jpg",
  // OR
  "logo": "https://example.com/uploads/portfolios/logo-1234567890.jpg",
  // OR nested in data
  "data": {
    "logoUrl": "https://example.com/uploads/portfolios/logo-1234567890.jpg"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to upload logo. File too large or invalid format.",
  "error": "File size exceeds 2MB limit"
}
```

### 3. File Upload Requirements

**Supported Formats:**
- Image formats: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`
- Recommended: `png` or `svg` for logos (transparency support)

**File Size Limits:**
- Maximum file size: 2MB (recommended)
- Minimum dimensions: 100x100px (optional validation)
- Recommended dimensions: 200x50px to 400x100px (for header display)

**Storage:**
- Store uploaded files in: `/uploads/portfolios/logos/` or similar
- Generate unique filenames: `logo-{timestamp}-{random}.{ext}` or `{portfolioId}-logo.{ext}`
- Ensure files are publicly accessible via URL

**Security:**
- Validate file type (check MIME type, not just extension)
- Validate file size
- Sanitize filename
- Consider image processing/resizing on upload
- Store files outside web root if possible, serve via dedicated route

### 4. Portfolio CRUD Operations

**When Creating/Updating Portfolio:**

The frontend will send the `logo` field as a URL string (not the file):

```json
{
  "slug": "john-doe",
  "layout": "multi-page",
  "logo": "https://example.com/uploads/portfolios/logo-1234567890.jpg",
  "theme": { ... },
  "hero": { ... },
  "sections": [ ... ]
}
```

**Backend should:**
1. Accept `logo` as an optional string field
2. Validate that the URL is a valid logo URL (if provided)
3. Store the URL in the database
4. Return the logo URL when fetching portfolio

**Example Portfolio Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "studentId": "mj18efk150w8nn0bszd",
  "slug": "john-doe",
  "layout": "multi-page",
  "logo": "https://example.com/uploads/portfolios/logo-1234567890.jpg",
  "isPublic": true,
  "theme": { ... },
  "hero": {
    "title": "John Doe",
    "subtitle": "Software Developer",
    ...
  },
  "sections": [ ... ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 5. Logo URL Handling

**URL Formats Supported:**
- Absolute URLs: `https://example.com/uploads/logo.jpg`
- Relative URLs: `/uploads/portfolios/logo.jpg`
- API URLs: `/api/uploads/portfolios/logo.jpg`

**Frontend Behavior:**
- Frontend will use the logo URL as-is from the backend
- If URL is relative, frontend will prepend API base URL
- Logo is displayed in portfolio header for multi-page layouts

### 6. Logo Removal

**When logo is removed:**
- Frontend sends `logo: ""` or `logo: null`
- Backend should accept empty string or null
- Backend should update portfolio to remove logo field or set to empty string
- Optionally: Delete the logo file from storage (recommended for cleanup)

**Example Update Request:**
```json
{
  "logo": "",
  // ... other portfolio fields
}
```

### 7. Implementation Example (Node.js/Express)

```javascript
// Upload logo endpoint
app.post("/api/upload/portfolio-logo", authenticate, upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only images are allowed."
      });
    }

    // Validate file size (2MB max)
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 2MB limit"
      });
    }

    // Generate unique filename
    const filename = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${req.file.originalname.split('.').pop()}`;
    const filepath = path.join(__dirname, "uploads", "portfolios", "logos", filename);

    // Save file
    await fs.promises.writeFile(filepath, req.file.buffer);

    // Generate URL
    const logoUrl = `/api/uploads/portfolios/logos/${filename}`;

    res.json({
      success: true,
      logoUrl: logoUrl,
      url: logoUrl, // Alternative field name
      logo: logoUrl // Alternative field name
    });
  } catch (error) {
    console.error("Logo upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload logo"
    });
  }
});

// Serve uploaded logos
app.use("/api/uploads/portfolios/logos", express.static(path.join(__dirname, "uploads", "portfolios", "logos")));

// Update portfolio endpoint (include logo field)
app.put("/api/portfolio/:id", authenticate, async (req, res) => {
  try {
    const { logo, ...otherFields } = req.body;
    
    const updateData = {
      ...otherFields,
      updatedAt: new Date()
    };

    // Include logo if provided (even if empty string)
    if (logo !== undefined) {
      updateData.logo = logo || "";
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio"
    });
  }
});
```

### 8. Testing Checklist

- [ ] Logo upload endpoint accepts image files
- [ ] Logo upload rejects non-image files
- [ ] Logo upload enforces file size limits
- [ ] Logo URL is saved correctly in portfolio
- [ ] Logo is returned when fetching portfolio
- [ ] Logo can be removed (set to empty string)
- [ ] Logo is displayed correctly in frontend header
- [ ] Logo URLs are accessible (not 404)
- [ ] Multiple portfolios can have different logos
- [ ] Logo upload requires authentication
- [ ] Old logo files are cleaned up when replaced (optional)

### 9. Optional Enhancements

1. **Image Processing:**
   - Resize logo to standard dimensions on upload
   - Generate multiple sizes (thumbnail, medium, large)
   - Optimize image compression

2. **Logo Validation:**
   - Check image dimensions (min/max width/height)
   - Validate aspect ratio
   - Detect and prevent malicious files

3. **CDN Integration:**
   - Upload logos to CDN (Cloudinary, AWS S3, etc.)
   - Return CDN URLs instead of local paths

4. **Logo History:**
   - Keep previous logo versions
   - Allow reverting to previous logos

## Notes

1. **Backward Compatibility**: Existing portfolios without logos will have `logo: ""` or `logo: null`, which is handled gracefully by the frontend.

2. **Performance**: Consider caching logo URLs and using CDN for faster delivery.

3. **Security**: Always validate file types server-side, never trust client-side validation alone.

4. **Storage**: Plan for storage capacity as portfolios grow. Consider implementing cleanup policies for unused logos.

