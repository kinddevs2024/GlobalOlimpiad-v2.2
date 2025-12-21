import { usePortfolioEditor } from "../../hooks/usePortfolioEditor";
import "./StyleControls.css";

const StyleControls = () => {
  const { portfolio, updatePortfolio } = usePortfolioEditor();

  if (!portfolio || !portfolio.theme) {
    return <div>No theme available</div>;
  }

  const theme = portfolio.theme;
  const colors = theme.colors || {};
  const typography = theme.typography || {};

  const handleColorChange = (colorKey, value) => {
    updatePortfolio({
      theme: {
        ...theme,
        colors: {
          ...colors,
          [colorKey]: value,
        },
      },
    });
  };

  const handleFontSizeChange = (type, value) => {
    updatePortfolio({
      theme: {
        ...theme,
        typography: {
          ...typography,
          [type === "heading" ? "headingSize" : "bodySize"]: value,
        },
      },
    });
  };

  const handleSpacingChange = (value) => {
    updatePortfolio({
      theme: {
        ...theme,
        spacing: value,
      },
    });
  };

  const handleContainerWidthChange = (value) => {
    updatePortfolio({
      theme: {
        ...theme,
        containerWidth: value,
      },
    });
  };

  const containerWidth = theme.containerWidth || "medium";

  return (
    <div className="portfolio-style-controls">
      <div className="style-control-group">
        <label className="style-control-label">Accent Color</label>
        <div className="style-control-input-group">
          <input
            type="color"
            value={colors.accent || "#0066FF"}
            onChange={(e) => handleColorChange("accent", e.target.value)}
            className="style-control-color-input"
          />
          <input
            type="text"
            value={colors.accent || "#0066FF"}
            onChange={(e) => handleColorChange("accent", e.target.value)}
            className="style-control-color-text"
            placeholder="#0066FF"
          />
        </div>
      </div>

      <div className="style-control-group">
        <label className="style-control-label">Primary Color</label>
        <div className="style-control-input-group">
          <input
            type="color"
            value={colors.primary || "#000000"}
            onChange={(e) => handleColorChange("primary", e.target.value)}
            className="style-control-color-input"
          />
          <input
            type="text"
            value={colors.primary || "#000000"}
            onChange={(e) => handleColorChange("primary", e.target.value)}
            className="style-control-color-text"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="style-control-group">
        <label className="style-control-label">Heading Size</label>
        <input
          type="range"
          min="1.5"
          max="4"
          step="0.1"
          value={parseFloat(typography.headingSize?.replace("rem", "") || "2.5")}
          onChange={(e) => handleFontSizeChange("heading", `${e.target.value}rem`)}
          className="style-control-range"
        />
        <span className="style-control-value">
          {typography.headingSize || "2.5rem"}
        </span>
      </div>

      <div className="style-control-group">
        <label className="style-control-label">Body Size</label>
        <input
          type="range"
          min="0.8"
          max="1.5"
          step="0.05"
          value={parseFloat(typography.bodySize?.replace("rem", "") || "1")}
          onChange={(e) => handleFontSizeChange("body", `${e.target.value}rem`)}
          className="style-control-range"
        />
        <span className="style-control-value">
          {typography.bodySize || "1rem"}
        </span>
      </div>

      <div className="style-control-group">
        <label className="style-control-label">Section Spacing</label>
        <select
          value={theme.spacing || "normal"}
          onChange={(e) => handleSpacingChange(e.target.value)}
          className="style-control-select"
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="spacious">Spacious</option>
        </select>
      </div>

      <div className="style-control-group">
        <label className="style-control-label">Container Width</label>
        <select
          value={containerWidth}
          onChange={(e) => handleContainerWidthChange(e.target.value)}
          className="style-control-select"
        >
          <option value="narrow">Narrow (800px)</option>
          <option value="medium">Medium (1200px)</option>
          <option value="wide">Wide (1600px)</option>
          <option value="full">Full Width</option>
        </select>
      </div>
    </div>
  );
};

export default StyleControls;

