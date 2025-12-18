import "./PortfolioStatusBadge.css";

const PortfolioStatusBadge = ({ status, size = "medium" }) => {
  if (!status) return null;

  const statusConfig = {
    unverified: {
      color: "var(--text-tertiary)",
      label: "Unverified",
    },
    pending: {
      color: "var(--warning)",
      label: "Pending",
    },
    verified: {
      color: "var(--success)",
      label: "Verified",
    },
    rejected: {
      color: "var(--error)",
      label: "Rejected",
    },
  };

  const config = statusConfig[status] || statusConfig.unverified;

  return (
    <span
      className={`portfolio-status-badge portfolio-status-badge-${status} portfolio-status-badge-${size}`}
      style={{ backgroundColor: config.color }}
      title={config.label}
      aria-label={config.label}
    />
  );
};

export default PortfolioStatusBadge;

