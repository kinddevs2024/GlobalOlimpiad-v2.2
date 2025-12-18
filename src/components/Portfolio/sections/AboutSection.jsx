import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import { useVerification } from "../../../hooks/useVerification";

const AboutSection = ({ data, title, isOwner = false, section }) => {
  const { text, bio } = data || {};
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

  const handleTextUpdate = (newText) => {
    if (editor && section) {
      editor.updateSection(section.id, {
        content: { ...section.content, text: newText },
      });
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
        <div className="portfolio-about">
          {isOwner && editor ? (
            <InlineTextEditor
              value={text || bio || ""}
              onSave={handleTextUpdate}
              placeholder="Click to add about information..."
              multiline
              tag="div"
            />
          ) : (
            text || bio || "No about information available."
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

