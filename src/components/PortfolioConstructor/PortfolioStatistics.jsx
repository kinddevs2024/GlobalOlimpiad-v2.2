/**
 * Portfolio Statistics Component
 * Display portfolio views, analytics, and statistics
 */
const PortfolioStatistics = ({ portfolio }) => {
  const stats = portfolio.statistics || {
    views: 0,
    uniqueVisitors: 0,
    lastViewed: null,
    shares: 0,
    averageTimeOnPage: 0,
  };

  return (
    <div className="portfolio-statistics">
      <h3>Portfolio Statistics</h3>
      <p className="section-description">
        View analytics and statistics about your portfolio.
      </p>

      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
      }}>
        <div className="stat-card" style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
            {stats.views || 0}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Total Views
          </div>
        </div>

        <div className="stat-card" style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
            {stats.uniqueVisitors || 0}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Unique Visitors
          </div>
        </div>

        <div className="stat-card" style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
            {stats.shares || 0}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Shares
          </div>
        </div>

        <div className="stat-card" style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
            {stats.averageTimeOnPage ? `${Math.round(stats.averageTimeOnPage)}s` : '0s'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Avg. Time on Page
          </div>
        </div>
      </div>

      {stats.lastViewed && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}>
          <strong>Last Viewed:</strong>{' '}
          {new Date(stats.lastViewed).toLocaleString()}
        </div>
      )}

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        <strong>Note:</strong> Statistics are updated periodically. Some data may take time to appear.
      </div>
    </div>
  );
};

export default PortfolioStatistics;

