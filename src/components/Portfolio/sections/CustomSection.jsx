import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import { useVerification } from "../../../hooks/useVerification";

const CustomSection = ({ data, title, style, isOwner = false, section }) => {
  const { content, html, text } = data || {};
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

  const handleContentUpdate = (newContent) => {
    if (editor && section) {
      editor.updateSection(section.id, {
        content: { ...section.content, text: newContent },
      });
    }
  };

  return (
    <section className="portfolio-section" style={style}>
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
        <div className="portfolio-custom-content">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div>
              {isOwner && editor ? (
                <InlineTextEditor
                  value={content || text || ""}
                  onSave={handleContentUpdate}
                  placeholder="Click to add custom content..."
                  multiline
                  tag="div"
                />
              ) : (
                content || text || "Custom content"
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomSection;

