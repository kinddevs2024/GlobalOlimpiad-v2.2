import { useState } from "react";
import "./PortfolioVerificationModal.css";

const PortfolioVerificationModal = ({
  portfolio,
  action,
  onVerify,
  onReject,
  onClose,
}) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (action === "verify") {
      onVerify(portfolio._id, comment);
    } else if (action === "reject") {
      if (!comment.trim()) {
        alert("Please provide a reason for rejection");
        return;
      }
      onReject(portfolio._id, comment);
    }
  };

  return (
    <div className="verification-modal-overlay" onClick={onClose}>
      <div
        className="verification-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="verification-modal-header">
          <h3>
            {action === "verify" ? "Verify Portfolio" : "Reject Portfolio"}
          </h3>
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

          <div className="form-group">
            <label>
              {action === "verify"
                ? "Comment (optional):"
                : "Rejection Reason (required):"}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                action === "verify"
                  ? "Add a comment about this verification..."
                  : "Please provide a reason for rejection..."
              }
              rows="4"
              required={action === "reject"}
            />
          </div>
        </div>

        <div className="verification-modal-footer">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`button-primary ${action === "reject" ? "button-danger" : ""}`}
            onClick={handleSubmit}
          >
            {action === "verify" ? "Verify" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioVerificationModal;

