import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import VerificationSubmitButton from "../../PortfolioVerification/VerificationSubmitButton";
import VerificationStatusModal from "../../PortfolioVerification/VerificationStatusModal";
import { useVerification } from "../../../hooks/useVerification";
import { getItemVerificationStatus } from "../../../utils/verificationHelpers";
import { useState } from "react";

const ProjectsSection = ({ data, title, isOwner = false, section }) => {
  const { projects, items } = data || {};
  const projectsList = projects || items || [];
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
        {projectsList.length > 0 ? (
          <div className="portfolio-projects-grid">
            {projectsList.map((project, index) => {
              const itemStatus = getItemVerificationStatus(project);
              const itemId = project._id || project.id || `project-${index}`;
              return (
                <div key={index} className="portfolio-project-card" style={{ position: "relative" }}>
                  {itemStatus && itemStatus !== "unverified" && (
                    <div 
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10, cursor: "pointer" }}
                      onClick={() => {
                        setSelectedItem(project);
                        setShowModal(true);
                      }}
                    >
                      <VerificationBadge
                        status={itemStatus}
                        level="item"
                        verifiedBy={project.verification?.verifiedBy}
                        verifiedAt={project.verification?.verifiedAt}
                        note={project.verification?.note}
                        showTooltip={true}
                      />
                    </div>
                  )}
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title || "Project"}
                      className="portfolio-project-image"
                    />
                  )}
                  <div className="portfolio-project-content">
                    <div className="portfolio-project-title">
                      {project.title || "Project"}
                    </div>
                    {project.description && (
                      <div className="portfolio-project-description">
                        {project.description}
                      </div>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-project-link"
                      >
                        View Project →
                      </a>
                    )}
                    {isOwner && (
                      <VerificationSubmitButton
                        item={project}
                        sectionId={section?.id}
                        itemId={itemId}
                        itemType="project"
                        onSubmitted={handleVerificationSubmitted}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No projects listed.</p>
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

export default ProjectsSection;

