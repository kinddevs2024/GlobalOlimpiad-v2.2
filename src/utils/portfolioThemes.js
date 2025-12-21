// Predefined theme presets
export const THEME_PRESETS = {
  minimal: {
    name: "Minimal",
    colors: {
      primary: "#000000",
      secondary: "#666666",
      background: "#FFFFFF",
      text: "#000000",
      accent: "#0066FF",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingSize: "2.5rem",
      bodySize: "1rem",
    },
    spacing: "normal",
  },
  modern: {
    name: "Modern",
    colors: {
      primary: "#1A1A1A",
      secondary: "#4A4A4A",
      background: "#FAFAFA",
      text: "#1A1A1A",
      accent: "#6366F1",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingSize: "3rem",
      bodySize: "1.125rem",
    },
    spacing: "spacious",
  },
  dark: {
    name: "Dark",
    colors: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
      background: "#0A0A0A",
      text: "#FFFFFF",
      accent: "#00D9FF",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingSize: "2.75rem",
      bodySize: "1rem",
    },
    spacing: "normal",
  },
  colorful: {
    name: "Colorful",
    colors: {
      primary: "#1A1A1A",
      secondary: "#666666",
      background: "#FFFFFF",
      text: "#1A1A1A",
      accent: "#FF6B6B",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingSize: "2.5rem",
      bodySize: "1rem",
    },
    spacing: "normal",
  },
  professional: {
    name: "Professional",
    colors: {
      primary: "#1E293B",
      secondary: "#64748B",
      background: "#FFFFFF",
      text: "#1E293B",
      accent: "#3B82F6",
    },
    typography: {
      fontFamily: "Georgia, serif",
      headingSize: "2.5rem",
      bodySize: "1.125rem",
    },
    spacing: "spacious",
  },
  light: {
    name: "Light",
    colors: {
      primary: "#1A1A1A",
      secondary: "#6B7280",
      background: "#FFFFFF",
      text: "#111827",
      accent: "#2563EB",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingSize: "2.5rem",
      bodySize: "1rem",
    },
    spacing: "normal",
  },
  "dark-mode": {
    name: "Dark Mode",
    colors: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
      background: "#111827",
      text: "#F9FAFB",
      accent: "#60A5FA",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingSize: "2.75rem",
      bodySize: "1rem",
    },
    spacing: "normal",
  },
};

// Default theme
export const DEFAULT_THEME = THEME_PRESETS.minimal;

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  if (!hex) return "0, 102, 255"; // Default blue
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 102, 255";
};

// Apply theme to CSS variables
export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Set portfolio-specific color variables (these don't override user's Settings theme)
  // Portfolio content uses these, but page background uses user's Settings theme
  root.style.setProperty("--portfolio-primary", theme.colors.primary);
  root.style.setProperty("--portfolio-secondary", theme.colors.secondary);
  root.style.setProperty("--portfolio-background", theme.colors.background);
  root.style.setProperty("--portfolio-text", theme.colors.text);
  root.style.setProperty("--portfolio-accent", theme.colors.accent);
  
  // Set RGB values for rgba() usage
  root.style.setProperty("--portfolio-accent-rgb", hexToRgb(theme.colors.accent));
  root.style.setProperty("--portfolio-primary-rgb", hexToRgb(theme.colors.primary));
  
  // Set typography variables
  root.style.setProperty("--portfolio-font-family", theme.typography.fontFamily);
  root.style.setProperty("--portfolio-heading-size", theme.typography.headingSize);
  root.style.setProperty("--portfolio-body-size", theme.typography.bodySize);
  
  // Set spacing
  const spacingMap = {
    compact: "1rem",
    normal: "2rem",
    spacious: "3rem",
  };
  root.style.setProperty("--portfolio-spacing", spacingMap[theme.spacing] || spacingMap.normal);
  
  // IMPORTANT: Do NOT override user's Settings theme variables (--bg-primary, --text-primary, etc.)
  // Those are managed by ThemeContext and should remain unchanged
};

// Get theme by name (handles both lowercase keys and capitalized names)
export const getThemeByName = (name) => {
  // First try exact match (lowercase key)
  if (THEME_PRESETS[name]) {
    return THEME_PRESETS[name];
  }
  // Try to find by capitalized name
  const found = Object.entries(THEME_PRESETS).find(([key, preset]) => 
    preset.name === name || key.toLowerCase() === name?.toLowerCase()
  );
  return found ? found[1] : DEFAULT_THEME;
};

// Normalize theme to ensure all required fields exist
// Handles both frontend format { colors, typography, spacing } and backend format { colors, fonts, styles }
export const normalizeTheme = (theme) => {
  if (!theme) {
    return { ...DEFAULT_THEME, name: "minimal" };
  }

  // If theme has backend format (fonts, styles), convert it first
  let frontendTheme = theme;
  if (theme.fonts || theme.styles) {
    frontendTheme = {
      name: theme.name,
      colors: theme.colors || {},
      typography: {
        fontFamily: theme.fonts?.body || theme.fonts?.heading || "Inter, system-ui, sans-serif",
        headingSize: theme.styles?.headingSize || "2.5rem",
        bodySize: theme.styles?.bodySize || "1rem",
      },
      spacing: theme.styles?.spacing || "normal",
    };
  }

  // Determine the preset key from theme name
  let presetKey = "minimal";
  if (frontendTheme.name) {
    // Check if name matches a preset key
    if (THEME_PRESETS[frontendTheme.name]) {
      presetKey = frontendTheme.name;
    } else {
      // Try to find by preset name (capitalized)
      const found = Object.entries(THEME_PRESETS).find(([key, preset]) => 
        preset.name === frontendTheme.name
      );
      if (found) {
        presetKey = found[0];
      }
    }
  }

  const preset = THEME_PRESETS[presetKey] || DEFAULT_THEME;

  // Merge theme with preset defaults
  const normalized = {
    name: presetKey, // Always use lowercase key as name
    colors: {
      ...preset.colors,
      ...frontendTheme.colors,
    },
    typography: {
      ...preset.typography,
      ...frontendTheme.typography,
    },
    spacing: frontendTheme.spacing || preset.spacing || "normal",
    // Preserve containerWidth if it exists (for layout control)
    containerWidth: frontendTheme.containerWidth || theme.containerWidth || "medium",
  };

  return normalized;
};

// Merge custom theme with preset
export const mergeTheme = (presetName, customColors = {}) => {
  const preset = getThemeByName(presetName);
  return {
    ...preset,
    name: presetName.toLowerCase(), // Ensure lowercase key
    colors: {
      ...preset.colors,
      ...customColors,
    },
  };
};

