import { useState, useEffect } from "react";
import { THEME_PRESETS, getThemeByName, normalizeTheme } from "../../utils/portfolioThemes";

const ThemeCustomizer = ({ theme, onChange }) => {
  // Determine selected preset based on theme name or by matching colors
  const getPresetFromTheme = (currentTheme) => {
    if (!currentTheme) return "minimal";
    
    // If theme has a name, try to match it
    if (currentTheme.name) {
      // Check if name is a preset key (lowercase)
      if (THEME_PRESETS[currentTheme.name]) {
        return currentTheme.name;
      }
      // Check if name matches a preset's display name (capitalized)
      const found = Object.entries(THEME_PRESETS).find(([key, preset]) => 
        preset.name === currentTheme.name
      );
      if (found) {
        return found[0]; // Return the lowercase key
      }
    }
    
    // Otherwise, try to match by colors
    for (const [key, preset] of Object.entries(THEME_PRESETS)) {
      if (
        preset.colors.primary === currentTheme.colors?.primary &&
        preset.colors.accent === currentTheme.colors?.accent &&
        preset.colors.background === currentTheme.colors?.background
      ) {
        return key;
      }
    }
    
    return "minimal";
  };

  const [selectedPreset, setSelectedPreset] = useState(() => getPresetFromTheme(theme));

  // Update selected preset when theme changes
  useEffect(() => {
    if (theme) {
      const preset = getPresetFromTheme(theme);
      setSelectedPreset(preset);
    }
  }, [theme]);

  const handlePresetChange = (presetName) => {
    const preset = getThemeByName(presetName);
    // Normalize the preset to ensure it has the correct structure and lowercase key as name
    const normalizedPreset = normalizeTheme({
      ...preset,
      name: presetName, // Use lowercase key (e.g., "minimal", "dark")
    });
    setSelectedPreset(presetName);
    onChange(normalizedPreset);
  };

  const handleColorChange = (colorKey, value) => {
    onChange({
      ...theme,
      name: theme?.name || "custom", // Mark as custom if colors are changed
      colors: {
        ...theme?.colors,
        [colorKey]: value,
      },
    });
  };

  const handleTypographyChange = (key, value) => {
    onChange({
      ...theme,
      name: theme?.name || "custom", // Mark as custom if typography is changed
      typography: {
        ...theme?.typography,
        [key]: value,
      },
    });
  };

  const handleSpacingChange = (spacing) => {
    onChange({
      ...theme,
      name: theme?.name || "custom", // Mark as custom if spacing is changed
      spacing,
    });
  };

  return (
    <div className="theme-customizer">
      <h3>Theme Customization</h3>
      <p className="section-description">
        Customize the colors, typography, and spacing of your portfolio.
      </p>

      <div className="theme-section">
        <h4>Theme Presets</h4>
        <div className="preset-grid">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => (
            <div
              key={key}
              className={`preset-card ${selectedPreset === key ? "selected" : ""}`}
              onClick={() => handlePresetChange(key)}
            >
              <div
                className="preset-preview"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors.primary} 0%, ${preset.colors.accent} 100%)`,
                }}
              ></div>
              <span>{preset.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="theme-section">
        <h4>Colors</h4>
        <div className="color-inputs">
          <div className="color-input-group">
            <label>Primary</label>
            <input
              type="color"
              value={theme?.colors?.primary || "#000000"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
            />
            <input
              type="text"
              value={theme?.colors?.primary || "#000000"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
            />
          </div>
          <div className="color-input-group">
            <label>Secondary</label>
            <input
              type="color"
              value={theme?.colors?.secondary || "#666666"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
            />
            <input
              type="text"
              value={theme?.colors?.secondary || "#666666"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
            />
          </div>
          <div className="color-input-group">
            <label>Background</label>
            <input
              type="color"
              value={theme?.colors?.background || "#FFFFFF"}
              onChange={(e) => handleColorChange("background", e.target.value)}
            />
            <input
              type="text"
              value={theme?.colors?.background || "#FFFFFF"}
              onChange={(e) => handleColorChange("background", e.target.value)}
            />
          </div>
          <div className="color-input-group">
            <label>Text</label>
            <input
              type="color"
              value={theme?.colors?.text || "#000000"}
              onChange={(e) => handleColorChange("text", e.target.value)}
            />
            <input
              type="text"
              value={theme?.colors?.text || "#000000"}
              onChange={(e) => handleColorChange("text", e.target.value)}
            />
          </div>
          <div className="color-input-group">
            <label>Accent</label>
            <input
              type="color"
              value={theme?.colors?.accent || "#0066FF"}
              onChange={(e) => handleColorChange("accent", e.target.value)}
            />
            <input
              type="text"
              value={theme?.colors?.accent || "#0066FF"}
              onChange={(e) => handleColorChange("accent", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="theme-section">
        <h4>Typography</h4>
        <div className="form-group">
          <label>Font Family</label>
          <select
            value={theme?.typography?.fontFamily || "Inter, system-ui, sans-serif"}
            onChange={(e) => handleTypographyChange("fontFamily", e.target.value)}
          >
            <option value="Inter, system-ui, sans-serif">Inter (Sans-serif)</option>
            <option value="Georgia, serif">Georgia (Serif)</option>
            <option value="'Courier New', monospace">Courier New (Monospace)</option>
            <option value="Arial, sans-serif">Arial</option>
          </select>
        </div>
        <div className="form-group">
          <label>Heading Size</label>
          <input
            type="text"
            value={theme?.typography?.headingSize || "2.5rem"}
            onChange={(e) => handleTypographyChange("headingSize", e.target.value)}
            placeholder="2.5rem"
          />
        </div>
        <div className="form-group">
          <label>Body Size</label>
          <input
            type="text"
            value={theme?.typography?.bodySize || "1rem"}
            onChange={(e) => handleTypographyChange("bodySize", e.target.value)}
            placeholder="1rem"
          />
        </div>
      </div>

      <div className="theme-section">
        <h4>Spacing</h4>
        <div className="spacing-options">
          <button
            className={`spacing-button ${theme?.spacing === "compact" ? "active" : ""}`}
            onClick={() => handleSpacingChange("compact")}
          >
            Compact
          </button>
          <button
            className={`spacing-button ${theme?.spacing === "normal" ? "active" : ""}`}
            onClick={() => handleSpacingChange("normal")}
          >
            Normal
          </button>
          <button
            className={`spacing-button ${theme?.spacing === "spacious" ? "active" : ""}`}
            onClick={() => handleSpacingChange("spacious")}
          >
            Spacious
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;

