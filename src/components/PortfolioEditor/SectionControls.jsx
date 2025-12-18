import { useState } from "react";
import "./SectionControls.css";

const SectionControls = ({ section, onRemove, onDuplicate }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemoveClick = () => {
    if (showConfirm) {
      onRemove?.();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="portfolio-section-controls">
      <button
        className="portfolio-section-control-btn duplicate"
        onClick={() => onDuplicate?.()}
        title="Duplicate section"
        aria-label="Duplicate section"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span>Duplicate</span>
      </button>
      <button
        className={`portfolio-section-control-btn remove ${showConfirm ? "confirm" : ""}`}
        onClick={handleRemoveClick}
        title={showConfirm ? "Click again to confirm removal" : "Remove section"}
        aria-label="Remove section"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span>{showConfirm ? "Confirm?" : "Remove"}</span>
      </button>
    </div>
  );
};

export default SectionControls;

