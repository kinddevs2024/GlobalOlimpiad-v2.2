import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import { useVerification } from "../../../hooks/useVerification";

const InterestsSection = ({ data, title, isOwner = false, section }) => {
  const { interests, items } = data || {};
  const interestsList = interests || items || [];
  const editor = isOwner ? usePortfolioEditor() : null;
  
  // Get verification status
  let sectionVerificationStatus = "unverified";
  try {
    const { verificationStatuses } = useVerification();
    sectionVerificationStatus = verificationStatuses?.sections?.[section?.id]?.status || "unverified";
  } catch (e) {
    // Verification context not available, default to unverified
    sectionVerificationStatus = "unverified";
  }

  const handleTitleUpdate = (newTitle) => {
    if (editor && section) {
      editor.updateSection(section.id, { title: newTitle });
    }
  };

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <h2 className="portfolio-section-title" style={{ marginBottom: 0 }}>
              {isOwner && editor ? (
                <InlineTextEditor
                  value={title}
                  onSave={handleTitleUpdate}
                  placeholder="Section title..."
                  tag="span"
                />
              ) : (
                title
              )}
            </h2>
            <VerificationBadge
              status={sectionVerificationStatus}
              level="section"
              showTooltip={true}
            />
          </div>
        )}
        {interestsList.length > 0 ? (
          <div className="portfolio-interests-list">
            {interestsList.map((interest, index) => (
              <div key={index} className="portfolio-interest-tag">
                {typeof interest === "string" ? interest : interest.name || interest.label}
              </div>
            ))}
          </div>
        ) : (
          <p>No interests listed.</p>
        )}
      </div>
    </section>
  );
};

export default InterestsSection;

