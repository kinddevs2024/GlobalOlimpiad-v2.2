import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";
import VerificationBadge from "../../PortfolioVerification/VerificationBadge";
import VerificationSubmitButton from "../../PortfolioVerification/VerificationSubmitButton";
import VerificationStatusModal from "../../PortfolioVerification/VerificationStatusModal";
import { useVerification } from "../../../hooks/useVerification";
import { getItemVerificationStatus } from "../../../utils/verificationHelpers";
import { useState } from "react";

const CertificatesSection = ({ data, title, isOwner = false, section }) => {
  const { certificates, items } = data || {};
  const certificatesList = certificates || items || [];
  const editor = isOwner ? usePortfolioEditor() : null;
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Get verification status
  let sectionVerificationStatus = null;
  try {
    const { verificationStatuses, refreshVerificationStatus } = useVerification();
    sectionVerificationStatus = verificationStatuses?.sections?.[section?.id]?.status || null;
  } catch (e) {
    // Verification context not available
  }
  
  const handleVerificationSubmitted = () => {
    if (editor) {
      refreshVerificationStatus?.();
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
        {certificatesList.length > 0 ? (
          <div className="portfolio-certificates-grid">
            {certificatesList.map((certificate, index) => {
              const itemStatus = getItemVerificationStatus(certificate);
              const itemId = certificate._id || certificate.id || `cert-${index}`;
              return (
                <div key={index} className="portfolio-certificate-item" style={{ position: "relative" }}>
                  {itemStatus && itemStatus !== "unverified" && (
                    <div 
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10, cursor: "pointer" }}
                      onClick={() => {
                        setSelectedItem(certificate);
                        setShowModal(true);
                      }}
                    >
                      <VerificationBadge
                        status={itemStatus}
                        level="item"
                        verifiedBy={certificate.verification?.verifiedBy}
                        verifiedAt={certificate.verification?.verifiedAt}
                        note={certificate.verification?.note}
                        showTooltip={true}
                      />
                    </div>
                  )}
                  {certificate.image && (
                    <img
                      src={certificate.image}
                      alt={certificate.title || "Certificate"}
                      className="portfolio-certificate-image"
                    />
                  )}
                  {certificate.title && (
                    <div className="portfolio-certificate-title">
                      {certificate.title}
                    </div>
                  )}
                  {isOwner && (
                    <VerificationSubmitButton
                      item={certificate}
                      sectionId={section?.id}
                      itemId={itemId}
                      itemType="certificate"
                      onSubmitted={handleVerificationSubmitted}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No certificates listed.</p>
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

export default CertificatesSection;

