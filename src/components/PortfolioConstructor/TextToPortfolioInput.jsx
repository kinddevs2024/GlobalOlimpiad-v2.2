import { useState } from "react";
import { portfolioAPI } from "../../services/portfolioAPI";
import { parseTextPreview, validateTextInput } from "../../utils/textToPortfolioParser";
import { DEFAULT_THEME, getThemeByName } from "../../utils/portfolioThemes";

const TextToPortfolioInput = ({ onGenerate, onClose }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    setError(null);

    // Generate preview as user types
    if (value.length > 10) {
      const previewData = parseTextPreview(value);
      setPreview(previewData);
    } else {
      setPreview(null);
    }
  };

  const handleGenerate = async () => {
    const validation = validateTextInput(text);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send to backend for generation
      const response = await portfolioAPI.generateFromText(text);
      const generatedPortfolio = response.data;

      // If backend returns a valid portfolio, use it
      if (generatedPortfolio) {
        onGenerate(generatedPortfolio);
      } else {
        // Fallback: generate client-side
        const previewData = parseTextPreview(text);
        const theme = getThemeByName(previewData.theme);
        
        // Apply color preference if mentioned
        if (previewData.color) {
          const colorMap = {
            blue: "#0066FF",
            red: "#FF4444",
            green: "#00CC66",
            white: "#FFFFFF",
            black: "#000000",
            purple: "#9933FF",
            orange: "#FF8800",
            yellow: "#FFCC00",
          };
          if (colorMap[previewData.color]) {
            theme.colors.accent = colorMap[previewData.color];
          }
        }

        const generatedPortfolio = {
          title: "My Portfolio",
          slug: "my-portfolio",
          visibility: "public",
          layout: previewData.layout,
          theme: theme,
          hero: {
            title: "Welcome to My Portfolio",
            subtitle: "Student & Olympiad Participant",
            image: "",
            ctaText: "",
            ctaLink: "",
          },
          sections: previewData.sections.map((sectionType, index) => ({
            id: `${sectionType}-${index}`,
            type: sectionType,
            enabled: true,
            order: index,
            title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
            content: getDefaultContent(sectionType),
            style: {},
          })),
          animations: {
            enabled: true,
            type: "fade",
          },
        };

        onGenerate(generatedPortfolio);
      }
    } catch (err) {
      console.error("Error generating portfolio:", err);
      setError("Failed to generate portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = (type) => {
    const defaults = {
      about: { text: "Tell your story here..." },
      skills: { skills: [] },
      achievements: { achievements: [] },
      projects: { projects: [] },
      certificates: { certificates: [] },
      interests: { interests: [] },
      education: { education: [] },
      custom: { content: "" },
    };
    return defaults[type] || {};
  };

  return (
    <div className="text-to-portfolio-input">
      <div className="input-header">
        <h4>Generate Portfolio from Text</h4>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <p className="input-description">
        Describe your portfolio in plain text. For example: "I want a single page
        minimal white portfolio with blue accents. Start with achievements, then
        skills, then projects."
      </p>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Describe your portfolio design..."
        rows={6}
        className="text-input"
      />
      {preview && (
        <div className="preview-info">
          <strong>Preview:</strong>
          <ul>
            <li>Layout: {preview.layout}</li>
            <li>Theme: {preview.theme}</li>
            {preview.color && <li>Color: {preview.color}</li>}
            <li>Sections: {preview.sections.join(", ")}</li>
          </ul>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="input-actions">
        <button className="button-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="button-primary"
          onClick={handleGenerate}
          disabled={loading || text.trim().length < 10}
        >
          {loading ? "Generating..." : "Generate Portfolio"}
        </button>
      </div>
    </div>
  );
};

export default TextToPortfolioInput;

