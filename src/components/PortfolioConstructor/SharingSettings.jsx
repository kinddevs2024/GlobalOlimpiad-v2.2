/**
 * Sharing Settings Component
 * Configure how portfolio is shared and embedded
 */
const SharingSettings = ({ portfolio, onChange }) => {
  const sharing = portfolio.sharing || {
    allowEmbedding: false,
    showShareButtons: true,
    customShareMessage: '',
    enableQRCode: true,
  };

  const portfolioUrl = `${window.location.origin}/portfolio/${portfolio.slug || 'my-portfolio'}`;

  const handleSharingChange = (field, value) => {
    onChange({
      sharing: {
        ...sharing,
        [field]: value,
      },
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="sharing-settings">
      <h3>Sharing Settings</h3>
      <p className="section-description">
        Configure how your portfolio can be shared and embedded.
      </p>

      <div className="form-group">
        <label>Portfolio URL</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={portfolioUrl}
            readOnly
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          />
          <button
            type="button"
            onClick={() => copyToClipboard(portfolioUrl)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={sharing.showShareButtons !== false}
            onChange={(e) => handleSharingChange('showShareButtons', e.target.checked)}
          />
          Show Share Buttons
        </label>
        <small>Display social media share buttons on your portfolio</small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={sharing.allowEmbedding || false}
            onChange={(e) => handleSharingChange('allowEmbedding', e.target.checked)}
          />
          Allow Embedding
        </label>
        <small>Allow others to embed your portfolio in iframes</small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={sharing.enableQRCode !== false}
            onChange={(e) => handleSharingChange('enableQRCode', e.target.checked)}
          />
          Enable QR Code
        </label>
        <small>Generate QR code for easy mobile sharing</small>
      </div>

      <div className="form-group">
        <label>Custom Share Message</label>
        <textarea
          value={sharing.customShareMessage || ''}
          onChange={(e) => handleSharingChange('customShareMessage', e.target.value)}
          placeholder="Check out my portfolio!"
          rows={3}
        />
        <small>Custom message when sharing on social media</small>
      </div>

      {sharing.enableQRCode && (
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>QR Code</label>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            display: 'inline-block',
            textAlign: 'center',
          }}>
            <img
              id="qr-code-image"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(portfolioUrl)}`}
              alt="QR Code"
              style={{
                width: '200px',
                height: '200px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                display: 'block',
                margin: '0 auto',
              }}
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Scan to view portfolio
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  // Fetch the QR code image
                  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(portfolioUrl)}`;
                  const response = await fetch(qrCodeUrl);
                  const blob = await response.blob();
                  
                  // Create a download link
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `portfolio-qr-code-${portfolio.slug || 'portfolio'}.png`;
                  document.body.appendChild(link);
                  link.click();
                  
                  // Cleanup
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Error downloading QR code:', error);
                  alert('Failed to download QR code. Please try again.');
                }
              }}
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              📥 Download QR Code (PNG)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharingSettings;

