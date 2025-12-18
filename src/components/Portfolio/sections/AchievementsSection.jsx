import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import VerificationSubmitButton from "../../PortfolioVerification/VerificationSubmitButton";
import VerificationStatusModal from "../../PortfolioVerification/VerificationStatusModal";
import { useVerification } from "../../../hooks/useVerification";
import { getItemVerificationStatus } from "../../../utils/verificationHelpers";
import { useState } from "react";

const AchievementsSection = ({ data, title, isOwner = false, section }) => {
  const { achievements, items } = data || {};
  const achievementsList = achievements || items || [];
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
        {achievementsList.length > 0 ? (
          <div className="portfolio-achievements-list">
            {achievementsList.map((achievement, index) => {
              const itemStatus = getItemVerificationStatus(achievement);
              const itemId = achievement._id || achievement.id || `achievement-${index}`;
              return (
                <div key={index} className="portfolio-achievement-item" style={{ position: "relative" }}>
                  {itemStatus && itemStatus !== "unverified" && (
                    <div 
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10, cursor: "pointer" }}
                      onClick={() => {
                        setSelectedItem(achievement);
                        setShowModal(true);
                      }}
                    >
                      <VerificationBadge
                        status={itemStatus}
                        level="item"
                        verifiedBy={achievement.verification?.verifiedBy}
                        verifiedAt={achievement.verification?.verifiedAt}
                        note={achievement.verification?.note}
                        showTooltip={true}
                      />
                    </div>
                  )}
                  <div className="portfolio-achievement-title">
                    {achievement.title || achievement.name || "Achievement"}
                  </div>
                  {achievement.description && (
                    <div className="portfolio-achievement-description">
                      {achievement.description}
                    </div>
                  )}
                  <div className="portfolio-achievement-meta">
                    {achievement.date && <span>Date: {achievement.date}</span>}
                    {achievement.olympiad && (
                      <span>Olympiad: {achievement.olympiad}</span>
                    )}
                    {achievement.rank && <span>Rank: {achievement.rank}</span>}
                    {achievement.score && <span>Score: {achievement.score}</span>}
                  </div>
                  {isOwner && (
                    <VerificationSubmitButton
                      item={achievement}
                      sectionId={section?.id}
                      itemId={itemId}
                      itemType="achievement"
                      onSubmitted={handleVerificationSubmitted}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No achievements listed.</p>
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

export default AchievementsSection;

