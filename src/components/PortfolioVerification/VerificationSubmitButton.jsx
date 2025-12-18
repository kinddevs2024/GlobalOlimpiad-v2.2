import { useState } from "react";
import { useVerification } from "../../hooks/useVerification";
import { canSubmitForVerification } from "../../utils/verificationHelpers";
import "./VerificationSubmitButton.css";

const VerificationSubmitButton = ({
  item,
  sectionId,
  itemId,
  itemType,
  onSubmitted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { submitItemForVerification, loading } = useVerification();

  if (!canSubmitForVerification(item)) {
    return null;
  }

  const handleSubmit = async () => {
    if (!sectionId || !itemId || !itemType) {
      setSubmitError("Missing required information");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitItemForVerification(
        sectionId,
        itemId,
        itemType
      );

      if (result.success) {
        onSubmitted?.();
      } else {
        setSubmitError(result.error || "Failed to submit for verification");
      }
    } catch (error) {
      console.error("Error submitting for verification:", error);
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = item?.verification?.status || "unverified";
  const rejectionNote = status === "rejected" ? item?.verification?.note : null;

  return (
    <div className="portfolio-verification-submit">
      {rejectionNote && (
        <div className="verification-rejection-note">
          <strong>Rejection Reason:</strong> {rejectionNote}
        </div>
      )}
      <button
        className="verification-submit-button"
        onClick={handleSubmit}
        disabled={isSubmitting || loading}
        title={
          status === "rejected"
            ? "Re-submit for verification"
            : "Submit for verification"
        }
      >
        {isSubmitting || loading ? (
          <>
            <span className="submit-spinner">⏳</span>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span className="submit-icon">✓</span>
            <span>{status === "rejected" ? "Re-submit" : "Submit for Verification"}</span>
          </>
        )}
      </button>
      {submitError && (
        <div className="verification-submit-error">{submitError}</div>
      )}
    </div>
  );
};

export default VerificationSubmitButton;

