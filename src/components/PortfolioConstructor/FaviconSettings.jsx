import ImageUpload from './ImageUpload';

/**
 * Favicon Settings Component
 * Upload and configure favicon for portfolio
 */
const FaviconSettings = ({ portfolio, onChange }) => {
  const favicon = portfolio.favicon || '';

  return (
    <div className="favicon-settings">
      <h3>Favicon & Site Icon</h3>
      <p className="section-description">
        Upload a favicon that appears in browser tabs and bookmarks.
      </p>

      <div className="form-group">
        <ImageUpload
          label="Favicon"
          value={favicon}
          onChange={(url) => onChange({ favicon: url })}
          recommendedSize="32x32 or 16x16"
          aspectRatio="1/1"
          maxSize={1 * 1024 * 1024} // 1MB
        />
        <small>
          Recommended formats: ICO, PNG. Size: 16x16, 32x32, or 48x48 pixels.
        </small>
      </div>

      {favicon && (
        <div style={{ marginTop: '1rem' }}>
          <label>Preview</label>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}
          >
            <img
              src={favicon}
              alt="Favicon preview"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '4px',
                backgroundColor: 'white',
              }}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              This is how your favicon will appear in browser tabs
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaviconSettings;

