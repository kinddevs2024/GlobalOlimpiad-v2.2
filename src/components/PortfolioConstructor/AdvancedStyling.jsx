/**
 * Advanced Styling Component
 * Allows users to customize spacing, borders, shadows, and animations
 */
const AdvancedStyling = ({ portfolio, onChange }) => {
  const styling = portfolio.styling || {
    spacing: {
      sectionPadding: '3rem',
      sectionGap: '2rem',
      contentPadding: '1.5rem',
    },
    borders: {
      borderRadius: '8px',
      borderWidth: '0px',
      borderColor: 'transparent',
    },
    shadows: {
      enabled: false,
      blur: '10px',
      spread: '0px',
      color: 'rgba(0, 0, 0, 0.1)',
    },
    animations: {
      scrollReveal: false,
      hoverEffects: true,
      transitionSpeed: '0.3s',
    },
  };

  const handleStylingChange = (category, field, value) => {
    onChange({
      styling: {
        ...styling,
        [category]: {
          ...styling[category],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="advanced-styling">
      <h3>Advanced Styling</h3>
      <p className="section-description">
        Fine-tune the appearance of your portfolio with advanced styling options.
      </p>

      <div className="styling-section">
        <h4>Spacing</h4>
        <div className="form-group">
          <label>
            Section Padding
            <input
              type="text"
              value={styling.spacing?.sectionPadding || '3rem'}
              onChange={(e) => handleStylingChange('spacing', 'sectionPadding', e.target.value)}
              placeholder="3rem"
            />
            <small>Padding inside each section (e.g., 3rem, 48px)</small>
          </label>
        </div>

        <div className="form-group">
          <label>
            Section Gap
            <input
              type="text"
              value={styling.spacing?.sectionGap || '2rem'}
              onChange={(e) => handleStylingChange('spacing', 'sectionGap', e.target.value)}
              placeholder="2rem"
            />
            <small>Space between sections</small>
          </label>
        </div>

        <div className="form-group">
          <label>
            Content Padding
            <input
              type="text"
              value={styling.spacing?.contentPadding || '1.5rem'}
              onChange={(e) => handleStylingChange('spacing', 'contentPadding', e.target.value)}
              placeholder="1.5rem"
            />
            <small>Padding inside content areas</small>
          </label>
        </div>
      </div>

      <div className="styling-section" style={{ marginTop: '2rem' }}>
        <h4>Borders</h4>
        <div className="form-group">
          <label>
            Border Radius
            <input
              type="text"
              value={styling.borders?.borderRadius || '8px'}
              onChange={(e) => handleStylingChange('borders', 'borderRadius', e.target.value)}
              placeholder="8px"
            />
            <small>Rounded corners (e.g., 8px, 0.5rem)</small>
          </label>
        </div>

        <div className="form-group">
          <label>
            Border Width
            <input
              type="text"
              value={styling.borders?.borderWidth || '0px'}
              onChange={(e) => handleStylingChange('borders', 'borderWidth', e.target.value)}
              placeholder="0px"
            />
            <small>Border thickness (0px to disable)</small>
          </label>
        </div>

        <div className="form-group">
          <label>
            Border Color
            <input
              type="color"
              value={styling.borders?.borderColor || '#000000'}
              onChange={(e) => handleStylingChange('borders', 'borderColor', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="styling-section" style={{ marginTop: '2rem' }}>
        <h4>Shadows</h4>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={styling.shadows?.enabled || false}
              onChange={(e) => handleStylingChange('shadows', 'enabled', e.target.checked)}
            />
            Enable Shadows
          </label>
        </div>

        {styling.shadows?.enabled && (
          <>
            <div className="form-group">
              <label>
                Blur
                <input
                  type="text"
                  value={styling.shadows?.blur || '10px'}
                  onChange={(e) => handleStylingChange('shadows', 'blur', e.target.value)}
                  placeholder="10px"
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Spread
                <input
                  type="text"
                  value={styling.shadows?.spread || '0px'}
                  onChange={(e) => handleStylingChange('shadows', 'spread', e.target.value)}
                  placeholder="0px"
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Shadow Color
                <input
                  type="text"
                  value={styling.shadows?.color || 'rgba(0, 0, 0, 0.1)'}
                  onChange={(e) => handleStylingChange('shadows', 'color', e.target.value)}
                  placeholder="rgba(0, 0, 0, 0.1)"
                />
                <small>Use rgba() format, e.g., rgba(0, 0, 0, 0.1)</small>
              </label>
            </div>
          </>
        )}
      </div>

      <div className="styling-section" style={{ marginTop: '2rem' }}>
        <h4>Animations</h4>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={styling.animations?.scrollReveal || false}
              onChange={(e) => handleStylingChange('animations', 'scrollReveal', e.target.checked)}
            />
            Scroll Reveal Animations
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={styling.animations?.hoverEffects !== false}
              onChange={(e) => handleStylingChange('animations', 'hoverEffects', e.target.checked)}
            />
            Hover Effects
          </label>
        </div>

        <div className="form-group">
          <label>
            Transition Speed
            <select
              value={styling.animations?.transitionSpeed || '0.3s'}
              onChange={(e) => handleStylingChange('animations', 'transitionSpeed', e.target.value)}
            >
              <option value="0.1s">Fast (0.1s)</option>
              <option value="0.3s">Normal (0.3s)</option>
              <option value="0.5s">Slow (0.5s)</option>
              <option value="0.8s">Very Slow (0.8s)</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStyling;

