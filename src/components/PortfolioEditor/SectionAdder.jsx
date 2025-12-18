import { useState } from "react";
import { usePortfolioEditor } from "../../hooks/usePortfolioEditor";
import "./SectionAdder.css";

const SECTION_TYPES = [
  { type: "about", label: "About", icon: "📝" },
  { type: "skills", label: "Skills", icon: "💼" },
  { type: "achievements", label: "Achievements", icon: "🏆" },
  { type: "projects", label: "Projects", icon: "🚀" },
  { type: "certificates", label: "Certificates", icon: "📜" },
  { type: "education", label: "Education", icon: "🎓" },
  { type: "interests", label: "Interests", icon: "❤️" },
  { type: "custom", label: "Custom", icon: "✨" },
];

const SectionAdder = ({ onSectionAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addSection, portfolio } = usePortfolioEditor();

  const handleAddSection = (type) => {
    const currentSectionsCount = portfolio?.sections?.length || 0;
    addSection(type, currentSectionsCount);
    setIsOpen(false);
    onSectionAdded?.();
  };

  return (
    <div className="portfolio-section-adder">
      <button
        className="portfolio-section-adder-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Add new section"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Add Section</span>
      </button>

      {isOpen && (
        <>
          <div
            className="portfolio-section-adder-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="portfolio-section-adder-menu">
            <h4>Select Section Type</h4>
            <div className="portfolio-section-adder-grid">
              {SECTION_TYPES.map((sectionType) => (
                <button
                  key={sectionType.type}
                  className="portfolio-section-adder-option"
                  onClick={() => handleAddSection(sectionType.type)}
                >
                  <span className="section-type-icon">{sectionType.icon}</span>
                  <span className="section-type-label">{sectionType.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SectionAdder;

