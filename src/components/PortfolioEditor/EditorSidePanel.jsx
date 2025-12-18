import { useState, useEffect } from "react";
import { usePortfolioEditor } from "../../hooks/usePortfolioEditor";
import SectionAdder from "./SectionAdder";
import StyleControls from "./StyleControls";
import "./EditorSidePanel.css";

const EditorSidePanel = ({ isOpen, onToggle, position = "right" }) => {
  const {
    portfolio,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveError,
    savePortfolio,
  } = usePortfolioEditor();

  const [localPosition, setLocalPosition] = useState(
    localStorage.getItem("portfolio-editor-panel-position") || position
  );

  useEffect(() => {
    localStorage.setItem("portfolio-editor-panel-position", localPosition);
  }, [localPosition]);

  const formatLastSaved = () => {
    if (!lastSaved) return "Never";
    const now = new Date();
    const diff = now - lastSaved;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  const togglePosition = () => {
    setLocalPosition((prev) => (prev === "left" ? "right" : "left"));
  };

  if (!isOpen) {
    return (
      <button
        className="portfolio-editor-panel-toggle"
        onClick={onToggle}
        aria-label="Open editor panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`portfolio-editor-panel ${localPosition}`}>
      <div className="portfolio-editor-panel-header">
        <h3>Portfolio Editor</h3>
        <div className="portfolio-editor-panel-actions">
          <button
            className="portfolio-editor-panel-position-toggle"
            onClick={togglePosition}
            aria-label={`Move panel to ${localPosition === "left" ? "right" : "left"}`}
            title={`Move to ${localPosition === "left" ? "right" : "left"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {localPosition === "left" ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
          <button
            className="portfolio-editor-panel-close"
            onClick={onToggle}
            aria-label="Close editor panel"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="portfolio-editor-panel-content">
        {/* Save Status */}
        <div className="portfolio-editor-save-status">
          {isSaving ? (
            <div className="save-status saving">
              <span className="save-status-icon">⏳</span>
              <span>Saving...</span>
            </div>
          ) : saveError ? (
            <div className="save-status error">
              <span className="save-status-icon">⚠️</span>
              <span>Error: {saveError}</span>
            </div>
          ) : hasUnsavedChanges ? (
            <div className="save-status unsaved">
              <span className="save-status-icon">●</span>
              <span>Unsaved changes</span>
            </div>
          ) : (
            <div className="save-status saved">
              <span className="save-status-icon">✓</span>
              <span>Saved {formatLastSaved()}</span>
            </div>
          )}
        </div>

        {/* Manual Save Button - appears when there are unsaved changes */}
        {hasUnsavedChanges && !isSaving && (
          <button
            className="portfolio-editor-save-button"
            onClick={() => {
              if (portfolio) {
                savePortfolio(portfolio);
              }
            }}
            disabled={isSaving}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Save Changes</span>
          </button>
        )}

        {/* Section Management */}
        <div className="portfolio-editor-section">
          <h4>Section Management</h4>
          <SectionAdder />
          <div className="portfolio-editor-sections-list">
            {portfolio?.sections
              ?.filter((s) => s.enabled !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section) => (
                <div key={section.id} className="portfolio-editor-section-item">
                  <span className="section-item-icon">
                    {section.type === "about" && "📝"}
                    {section.type === "skills" && "💼"}
                    {section.type === "achievements" && "🏆"}
                    {section.type === "projects" && "🚀"}
                    {section.type === "certificates" && "📜"}
                    {section.type === "education" && "🎓"}
                    {section.type === "interests" && "❤️"}
                    {section.type === "custom" && "✨"}
                  </span>
                  <span className="section-item-title">{section.title || section.type}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Style Customization */}
        <div className="portfolio-editor-section">
          <h4>Style Customization</h4>
          <StyleControls />
        </div>
      </div>
    </div>
  );
};

export default EditorSidePanel;

