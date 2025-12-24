/**
 * Custom Code Settings Component
 * Allows users to add custom CSS and JavaScript
 */
const CustomCodeSettings = ({ portfolio, onChange }) => {
  const customCode = portfolio.customCode || {
    css: '',
    javascript: '',
  };

  const handleCodeChange = (type, value) => {
    onChange({
      customCode: {
        ...customCode,
        [type]: value,
      },
    });
  };

  return (
    <div className="custom-code-settings">
      <h3>Custom Code</h3>
      <p className="section-description">
        Add custom CSS and JavaScript to further customize your portfolio.
        <strong style={{ display: 'block', marginTop: '0.5rem', color: 'var(--warning)' }}>
          ⚠️ Warning: Only add code you trust. Incorrect code may break your portfolio.
        </strong>
      </p>

      <div className="form-group">
        <label>
          Custom CSS
          <textarea
            value={customCode.css || ''}
            onChange={(e) => handleCodeChange('css', e.target.value)}
            placeholder="/* Your custom CSS here */"
            rows={12}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          />
          <small>CSS will be injected into your portfolio page</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Custom JavaScript
          <textarea
            value={customCode.javascript || ''}
            onChange={(e) => handleCodeChange('javascript', e.target.value)}
            placeholder="// Your custom JavaScript here"
            rows={12}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          />
          <small>JavaScript will be executed on your portfolio page</small>
        </label>
      </div>
    </div>
  );
};

export default CustomCodeSettings;

