import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import VerificationSubmitButton from "../../PortfolioVerification/VerificationSubmitButton";
import { useVerification } from "../../../hooks/useVerification";
import { getItemVerificationStatus } from "../../../utils/verificationHelpers";
import { useState } from "react";

const SkillsSection = ({ data, title, isOwner = false, section }) => {
  const { skills, items } = data || {};
  const skillsList = skills || items || [];
  const editor = isOwner ? usePortfolioEditor() : null;
  
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
        {skillsList.length > 0 ? (
          <div className="portfolio-skills-grid">
            {skillsList.map((skill, index) => {
              const skillObj = typeof skill === "string" ? { name: skill } : skill;
              const itemStatus = getItemVerificationStatus(skillObj);
              const itemId = skillObj._id || skillObj.id || `skill-${index}`;
              return (
                <div key={index} className="portfolio-skill-tag" style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{typeof skill === "string" ? skill : skill.name || skill.label}</span>
                  {itemStatus && itemStatus !== "unverified" && (
                    <VerificationBadge
                      status={itemStatus}
                      level="item"
                      verifiedBy={skillObj.verification?.verifiedBy}
                      verifiedAt={skillObj.verification?.verifiedAt}
                      showTooltip={true}
                      className="inline-badge"
                    />
                  )}
                  {isOwner && (
                    <VerificationSubmitButton
                      item={skillObj}
                      sectionId={section?.id}
                      itemId={itemId}
                      itemType="skill"
                      onSubmitted={handleVerificationSubmitted}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No skills listed.</p>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;

