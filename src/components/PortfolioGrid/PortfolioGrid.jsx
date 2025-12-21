import PortfolioStatusBadge from "../PortfolioStatusBadge/PortfolioStatusBadge";
import "./PortfolioGrid.css";

const PortfolioGrid = ({
  portfolios,
  onViewPortfolio,
  onUnlockContacts,
  contactsUnlocked = {},
}) => {
  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="portfolio-grid-empty">
        <div className="empty-icon">📋</div>
        <p>No portfolios found</p>
      </div>
    );
  }

  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return "N/A";
    return rating.toFixed(1);
  };

  return (
    <div className="portfolio-grid">
      {portfolios.map((portfolio, index) => (
        <div key={portfolio._id || index} className="portfolio-card">
          {/* Card Header */}
          <div className="portfolio-card-header">
            <div className="portfolio-card-title-section">
              <h3 className="portfolio-card-title">
                {portfolio.hero?.title || portfolio.title || "Untitled Portfolio"}
              </h3>
              <p className="portfolio-card-student">
                {portfolio.studentName || portfolio.studentId?.name || "Unknown Student"}
              </p>
            </div>
            {portfolio.verificationStatus && (
              <PortfolioStatusBadge
                status={portfolio.verificationStatus}
                size="small"
              />
            )}
          </div>

          {/* Card Metrics */}
          <div className="portfolio-card-metrics">
            <div className="portfolio-metric">
              <span className="metric-label">Rating</span>
              <span className="metric-value rating-value">
                {formatRating(portfolio.portfolioRating)}
              </span>
            </div>
            <div className="portfolio-metric">
              <span className="metric-label">ILS Level</span>
              <span className="metric-value">
                {portfolio.ilsLevel !== undefined ? portfolio.ilsLevel : "-"}
              </span>
            </div>
            <div className="portfolio-metric">
              <span className="metric-label">Status</span>
              <span className="metric-value status-value">
                {portfolio.verificationStatus || "unverified"}
              </span>
            </div>
          </div>

          {/* Card Actions */}
          <div className="portfolio-card-actions">
            <button
              className="portfolio-card-button portfolio-card-button-primary"
              onClick={() => onViewPortfolio(portfolio)}
            >
              View Portfolio
            </button>
            {contactsUnlocked[portfolio._id] ? (
              <div className="portfolio-card-contacts">
                {portfolio.studentEmail && (
                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <span className="contact-value">{portfolio.studentEmail}</span>
                  </div>
                )}
                {portfolio.studentPhone && (
                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <span className="contact-value">{portfolio.studentPhone}</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="portfolio-card-button portfolio-card-button-secondary"
                onClick={() => onUnlockContacts(portfolio)}
              >
                Unlock Contacts
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;

