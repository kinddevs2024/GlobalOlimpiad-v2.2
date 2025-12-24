/**
 * Social Links Settings Component
 * Allows users to add social media and external links
 */
const SocialLinksSettings = ({ portfolio, onChange }) => {
  const socialLinks = portfolio.socialLinks || [];

  const addSocialLink = () => {
    onChange({
      socialLinks: [
        ...socialLinks,
        {
          platform: 'custom',
          label: '',
          url: '',
          icon: '',
        },
      ],
    });
  };

  const updateSocialLink = (index, updates) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], ...updates };
    onChange({ socialLinks: updated });
  };

  const removeSocialLink = (index) => {
    onChange({
      socialLinks: socialLinks.filter((_, i) => i !== index),
    });
  };

  const platforms = [
    { value: 'github', label: 'GitHub', icon: '💻' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'facebook', label: 'Facebook', icon: '👥' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'telegram', label: 'Telegram', icon: '✈️' },
    { value: 'discord', label: 'Discord', icon: '💬' },
    { value: 'website', label: 'Website', icon: '🌐' },
    { value: 'custom', label: 'Custom', icon: '🔗' },
  ];

  return (
    <div className="social-links-settings">
      <h3>Social Links</h3>
      <p className="section-description">
        Add links to your social media profiles and external websites.
      </p>

      <div className="social-links-list">
        {socialLinks.map((link, index) => (
          <div key={index} className="social-link-item">
            <div className="form-row">
              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label>Platform</label>
                <select
                  value={link.platform || 'custom'}
                  onChange={(e) => updateSocialLink(index, { platform: e.target.value })}
                >
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              {link.platform === 'custom' && (
                <div className="form-group" style={{ flex: '1' }}>
                  <label>Label</label>
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => updateSocialLink(index, { label: e.target.value })}
                    placeholder="Link label"
                  />
                </div>
              )}

              <div className="form-group" style={{ flex: '1' }}>
                <label>URL</label>
                <input
                  type="text"
                  value={link.url || ''}
                  onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="button-remove"
                style={{
                  marginTop: '1.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {socialLinks.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No social links added yet. Click "Add Link" to get started.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={addSocialLink}
        className="button-add"
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        + Add Social Link
      </button>
    </div>
  );
};

export default SocialLinksSettings;

