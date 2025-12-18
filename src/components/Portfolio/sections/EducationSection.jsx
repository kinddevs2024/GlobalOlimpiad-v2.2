import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import VerificationSubmitButton from "../../PortfolioVerification/VerificationSubmitButton";
import VerificationStatusModal from "../../PortfolioVerification/VerificationStatusModal";
import { useVerification } from "../../../hooks/useVerification";
import { getItemVerificationStatus } from "../../../utils/verificationHelpers";
import { useState } from "react";

const EducationSection = ({ data, title, isOwner = false, section }) => {
  const { education, items } = data || {};
  const educationList = education || items || [];
  const editor = isOwner ? usePortfolioEditor() : null;
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Get verification status
  let sectionVerificationStatus = "unverified";
  let refreshVerificationStatus = null;
  try {
    const verification = useVerification();
    sectionVerificationStatus = verification.verificationStatuses?.sections?.[section?.id]?.status || "unverified";
    refreshVerificationStatus = verification.refreshVerificationStatus;
  } catch (e) {
    // Verification context not available, default to unverified
    sectionVerificationStatus = "unverified";
  }
  
  const handleVerificationSubmitted = () => {
    if (refreshVerificationStatus) {
      refreshVerificationStatus();
    }
  };

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
        {educationList.length > 0 ? (
          <div className="portfolio-education-list">
            {educationList.map((edu, index) => {
              const itemStatus = getItemVerificationStatus(edu);
              const itemId = edu._id || edu.id || `education-${index}`;
              return (
                <div key={index} className="portfolio-education-item" style={{ position: "relative" }}>
                  {itemStatus && itemStatus !== "unverified" && (
                    <div 
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10, cursor: "pointer" }}
                      onClick={() => {
                        setSelectedItem(edu);
                        setShowModal(true);
                      }}
                    >
                      <VerificationBadge
                        status={itemStatus}
                        level="item"
                        verifiedBy={edu.verification?.verifiedBy}
                        verifiedAt={edu.verification?.verifiedAt}
                        note={edu.verification?.note}
                        showTooltip={true}
                      />
                    </div>
                  )}
                  <div className="portfolio-education-title">
                    {edu.degree || edu.title || "Education"}
                  </div>
                  <div className="portfolio-education-institution">
                    {edu.institution || edu.school || edu.university}
                  </div>
                  {edu.period && (
                    <div className="portfolio-education-period">{edu.period}</div>
                  )}
                  {(edu.startDate || edu.endDate) && (
                    <div className="portfolio-education-period">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </div>
                  )}
                  {isOwner && (
                    <VerificationSubmitButton
                      item={edu}
                      sectionId={section?.id}
                      itemId={itemId}
                      itemType="education"
                      onSubmitted={handleVerificationSubmitted}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No education information listed.</p>
        )}
      </div>
      
      {showModal && selectedItem && (
        <VerificationStatusModal
          item={selectedItem}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </section>
  );
};

export default EducationSection;

