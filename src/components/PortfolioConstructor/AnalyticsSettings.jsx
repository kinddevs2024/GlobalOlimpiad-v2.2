/**
 * Analytics Settings Component
 * Allows users to configure analytics and tracking
 */
const AnalyticsSettings = ({ portfolio, onChange }) => {
  const analytics = portfolio.analytics || {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    customTrackingCode: '',
    enableViewTracking: true,
  };

  const handleAnalyticsChange = (field, value) => {
    onChange({
      analytics: {
        ...analytics,
        [field]: value,
      },
    });
  };

  return (
    <div className="analytics-settings">
      <h3>Analytics & Tracking</h3>
      <p className="section-description">
        Configure analytics to track visitors and understand how people interact with your portfolio.
      </p>

      <div className="form-group">
        <label>
          Google Analytics ID
          <input
            type="text"
            value={analytics.googleAnalyticsId || ''}
            onChange={(e) => handleAnalyticsChange('googleAnalyticsId', e.target.value)}
            placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
          />
          <small>Your Google Analytics measurement ID</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Google Tag Manager ID
          <input
            type="text"
            value={analytics.googleTagManagerId || ''}
            onChange={(e) => handleAnalyticsChange('googleTagManagerId', e.target.value)}
            placeholder="GTM-XXXXXXX"
          />
          <small>Your Google Tag Manager container ID</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Custom Tracking Code
          <textarea
            value={analytics.customTrackingCode || ''}
            onChange={(e) => handleAnalyticsChange('customTrackingCode', e.target.value)}
            placeholder="<!-- Your custom tracking code here -->"
            rows={6}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          />
          <small>Add any custom tracking scripts (e.g., Facebook Pixel, custom analytics)</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={analytics.enableViewTracking !== false}
            onChange={(e) => handleAnalyticsChange('enableViewTracking', e.target.checked)}
          />
          Enable View Tracking
        </label>
        <small>Track when visitors view your portfolio (privacy-friendly, no personal data)</small>
      </div>
    </div>
  );
};

export default AnalyticsSettings;

