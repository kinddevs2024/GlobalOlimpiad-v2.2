import { useState } from "react";
import {
  getVerificationLabel,
  getVerificationColor,
  getVerificationIcon,
} from "../../utils/verificationHelpers";
import "./VerificationBadge.css";

const VerificationBadge = ({
  status,
  level = "item",
  verifiedBy,
  verifiedAt,
  note,
  showTooltip = true,
  className = "",
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);

  // For item level, don't show badge if unverified (to reduce clutter)
  // For portfolio/section level, always show badge
  if (!status) {
    if (level === "portfolio" || level === "section") {
      status = "unverified";
    } else {
      return null;
    }
  }

  const label = getVerificationLabel(status);
  const color = getVerificationColor(status);
  const icon = getVerificationIcon(status);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const tooltipContent = () => {
    if (!showTooltip) return null;

    let content = label;

    if (verifiedBy) {
      content += `\nVerified by: ${verifiedBy}`;
    }

    if (verifiedAt) {
      content += `\nVerified on: ${formatDate(verifiedAt)}`;
    }

    if (note) {
      content += `\n${note}`;
    }

    if (level === "portfolio") {
      content += "\n\nThis portfolio has been verified by our team.";
    } else if (level === "section") {
      content += "\n\nThis section contains verified information.";
    } else {
      content += "\n\nThis item has been verified for authenticity.";
    }

    return content;
  };

  return (
    <div
      className={`portfolio-verification-badge ${color} ${level}-level ${className}`}
      onMouseEnter={() => showTooltip && setShowTooltipState(true)}
      onMouseLeave={() => setShowTooltipState(false)}
      role="status"
      aria-label={label}
    >
      <span className="verification-icon">{icon}</span>
      <span className="verification-label">{label}</span>

      {showTooltipState && tooltipContent() && (
        <div className="verification-tooltip">
          {tooltipContent().split("\n").map((line, index) => (
            <div key={index}>{line || "\u00A0"}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationBadge;

