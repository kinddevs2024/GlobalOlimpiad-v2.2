import { useState } from "react";
import "./VerificationStatusModal.css";

const VerificationStatusModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const verification = item.verification || {};
  const status = verification.status || "unverified";

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <div className="verification-modal-overlay" onClick={onClose}>
      <div
        className="verification-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="verification-modal-header">
          <h3>Verification Status</h3>
          <button
            className="verification-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="verification-modal-body">
          <div className="verification-status-info">
            <div className="status-row">
              <span className="status-label">Status:</span>
              <span className={`status-value status-${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {verification.verifiedBy && (
              <div className="status-row">
                <span className="status-label">Verified By:</span>
                <span className="status-value">{verification.verifiedBy}</span>
              </div>
            )}

            {verification.verifiedAt && (
              <div className="status-row">
                <span className="status-label">Verified At:</span>
                <span className="status-value">
                  {formatDate(verification.verifiedAt)}
                </span>
              </div>
            )}

            {verification.submittedAt && (
              <div className="status-row">
                <span className="status-label">Submitted At:</span>
                <span className="status-value">
                  {formatDate(verification.submittedAt)}
                </span>
              </div>
            )}

            {verification.note && (
              <div className="status-row">
                <span className="status-label">Note:</span>
                <span className="status-value">{verification.note}</span>
              </div>
            )}
          </div>
        </div>

        <div className="verification-modal-footer">
          <button className="verification-modal-ok" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatusModal;

