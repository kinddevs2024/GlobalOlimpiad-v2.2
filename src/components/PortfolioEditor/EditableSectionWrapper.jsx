import { useState } from "react";
import "./EditableSectionWrapper.css";

const EditableSectionWrapper = ({
  section,
  isOwner,
  children,
  onUpdate,
  onRemove,
  onDuplicate,
  onReorder,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);

  if (!isOwner) {
    // Render without editor UI for non-owners
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowControls(false);
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this section?")) {
      onRemove?.(section.id);
    }
  };

  return (
    <div
      className={`portfolio-editable-section ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-section-id={section.id}
    >
      {/* Hover outline - only visible to owner */}
      {isHovered && (
        <div className="portfolio-editable-section-outline" />
      )}

      {/* Section Controls - appear on hover */}
      {isHovered && (
        <div className="portfolio-editable-section-controls">
          <button
            className="portfolio-section-control-btn"
            onClick={() => onDuplicate?.(section.id)}
            title="Duplicate section"
            aria-label="Duplicate section"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            className="portfolio-section-control-btn"
            onClick={handleRemove}
            title="Remove section"
            aria-label="Remove section"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* Drag Handle - appear on hover */}
      {isHovered && (
        <div className="portfolio-editable-section-drag-handle" title="Drag to reorder">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
      )}

      {/* Section Content */}
      <div className="portfolio-editable-section-content">
        {children}
      </div>
    </div>
  );
};

export default EditableSectionWrapper;

