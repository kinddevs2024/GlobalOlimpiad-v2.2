import { memo } from "react";
import PortfolioStatusBadge from "../PortfolioStatusBadge/PortfolioStatusBadge";
import "./PortfolioTable.css";

const PortfolioTable = memo(({
  portfolios,
  onViewPortfolio,
  onUnlockContacts,
  contactsUnlocked = {},
}) => {
  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="empty-results">
        <p>No portfolios found</p>
      </div>
    );
  }

  return (
    <div className="results-table">
      <div className="table-header">
        <div className="table-cell">Student Name</div>
        <div className="table-cell">Portfolio Title</div>
        <div className="table-cell">Status</div>
        <div className="table-cell">ILS Level</div>
        <div className="table-cell">Olympiad Level</div>
        <div className="table-cell">Rating</div>
        <div className="table-cell">Actions</div>
      </div>
      <div className="table-body">
        {(Array.isArray(portfolios) ? portfolios : []).map((portfolio, index) => (
          <div key={portfolio._id || index} className="table-row">
            <div className="table-cell">
              {portfolio.studentName || portfolio.studentId || "Unknown"}
            </div>
            <div className="table-cell">
              {portfolio.title || portfolio.hero?.title || "Untitled Portfolio"}
            </div>
            <div className="table-cell">
              {portfolio.verificationStatus && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <PortfolioStatusBadge
                    status={portfolio.verificationStatus}
                    size="small"
                  />
                  <span style={{ textTransform: "capitalize" }}>
                    {portfolio.verificationStatus}
                  </span>
                </div>
              )}
            </div>
            <div className="table-cell">
              {portfolio.ilsLevel !== undefined ? portfolio.ilsLevel : "-"}
            </div>
            <div className="table-cell">
              {portfolio.olympiadLevel !== undefined ? portfolio.olympiadLevel : "-"}
            </div>
            <div className="table-cell">
              <span className="score-value">
                {portfolio.portfolioRating !== undefined ? portfolio.portfolioRating : "-"}
              </span>
            </div>
            <div className="table-cell">
              <div className="actions-cell">
                <button
                  className="button-small button-primary"
                  onClick={() => onViewPortfolio(portfolio)}
                >
                  View
                </button>
                {contactsUnlocked[portfolio._id] ? (
                  <div className="contact-info">
                    {portfolio.studentEmail && (
                      <div>Email: {portfolio.studentEmail}</div>
                    )}
                    {portfolio.studentPhone && (
                      <div>Phone: {portfolio.studentPhone}</div>
                    )}
                  </div>
                ) : (
                  <button
                    className="button-small button-secondary"
                    onClick={() => onUnlockContacts(portfolio)}
                  >
                    Unlock Contacts
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PortfolioTable.displayName = "PortfolioTable";

export default PortfolioTable;

