import "./UnlockContactsModal.css";

const UnlockContactsModal = ({ portfolio, onConfirm, onClose }) => {
  return (
    <div className="verification-modal-overlay" onClick={onClose}>
      <div
        className="verification-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="verification-modal-header">
          <h3>Unlock Student Contacts</h3>
          <button
            className="verification-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="verification-modal-body">
          <div className="portfolio-info">
            <p>
              <strong>Portfolio:</strong> {portfolio.title || portfolio.hero?.title || "Untitled"}
            </p>
            <p>
              <strong>Student:</strong> {portfolio.studentName || portfolio.studentId || "Unknown"}
            </p>
          </div>

          <div className="unlock-info">
            <p>
              Unlock access to this student's contact information. Payment will be
              processed automatically by the system.
            </p>
          </div>
        </div>

        <div className="verification-modal-footer">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={onConfirm}>
            Unlock Contacts
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnlockContactsModal;

