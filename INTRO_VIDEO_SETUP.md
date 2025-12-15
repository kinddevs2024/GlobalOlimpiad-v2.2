# Intro Video Setup Instructions

## Video Files Location

The intro video component is now implemented and will automatically show after user registration. The component detects internet speed and selects the appropriate video quality:

- **Slow connection (2G/slow-2G)**: Uses `intro_480.mp4` (480p)
- **Medium connection (3G)**: Uses `intro_720.mp4` (720p)
- **Fast connection (4G+)**: Uses `intro.mp4` (original quality)

## Important: Move Video Files

Currently, your video files are in `src/public/`. For Vite to serve them correctly, they need to be in a **root-level `public/` folder**.

### Steps to Fix:

1. Create a `public` folder at the root of your project (same level as `package.json`)
2. Move the three video files from `src/public/` to the root `public/` folder:
   - `intro.mp4`
   - `intro_720.mp4`
   - `intro_480.mp4`

### Quick PowerShell Command (run from project root):

```powershell
New-Item -ItemType Directory -Force -Path "public"
Copy-Item "src\public\*.mp4" "public\" -Force
```

Or manually:

1. Create folder: `public` (at root level)
2. Copy files: `src/public/intro*.mp4` → `public/`

## How It Works

1. After successful registration (email/password or Google), the intro video will automatically play
2. The component detects connection speed using the Network Information API
3. If the API is unavailable, it falls back to a speed test
4. Users can skip the video using the "Skip" button
5. After the video ends or is skipped, users are redirected to `/complete-profile`
6. The intro is only shown once per user (stored in localStorage)

## Testing

To test the intro video:

1. Register a new user account
2. The intro video should play automatically
3. Try the "Skip" button to test skipping
4. Clear localStorage (`localStorage.removeItem('introWatched')`) to see it again



