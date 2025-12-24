/**
 * Font Settings Component
 * Advanced font customization beyond theme presets
 */
const FontSettings = ({ portfolio, onChange }) => {
  const fonts = portfolio.fonts || {
    headingFont: '',
    bodyFont: '',
    customFonts: [],
    fontWeights: {
      heading: '700',
      body: '400',
    },
    letterSpacing: {
      heading: '0',
      body: '0',
    },
    lineHeight: {
      heading: '1.2',
      body: '1.6',
    },
  };

  const handleFontChange = (field, value) => {
    onChange({
      fonts: {
        ...fonts,
        [field]: value,
      },
    });
  };

  const handleFontWeightChange = (type, value) => {
    onChange({
      fonts: {
        ...fonts,
        fontWeights: {
          ...fonts.fontWeights,
          [type]: value,
        },
      },
    });
  };

  const handleSpacingChange = (type, field, value) => {
    onChange({
      fonts: {
        ...fonts,
        [type]: {
          ...fonts[type],
          [field]: value,
        },
      },
    });
  };

  const webFonts = [
    { value: '', label: 'Default (System Font)' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  ];

  return (
    <div className="font-settings">
      <h3>Font Settings</h3>
      <p className="section-description">
        Customize typography beyond theme presets.
      </p>

      <div className="form-group">
        <label>Heading Font</label>
        <select
          value={fonts.headingFont || ''}
          onChange={(e) => handleFontChange('headingFont', e.target.value)}
        >
          {webFonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <small>Font family for headings (h1, h2, h3)</small>
      </div>

      <div className="form-group">
        <label>Body Font</label>
        <select
          value={fonts.bodyFont || ''}
          onChange={(e) => handleFontChange('bodyFont', e.target.value)}
        >
          {webFonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <small>Font family for body text</small>
      </div>

      <div className="form-group">
        <label>Heading Font Weight</label>
        <select
          value={fonts.fontWeights?.heading || '700'}
          onChange={(e) => handleFontWeightChange('heading', e.target.value)}
        >
          <option value="100">Thin (100)</option>
          <option value="200">Extra Light (200)</option>
          <option value="300">Light (300)</option>
          <option value="400">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi Bold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Body Font Weight</label>
        <select
          value={fonts.fontWeights?.body || '400'}
          onChange={(e) => handleFontWeightChange('body', e.target.value)}
        >
          <option value="100">Thin (100)</option>
          <option value="200">Extra Light (200)</option>
          <option value="300">Light (300)</option>
          <option value="400">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi Bold (600)</option>
          <option value="700">Bold (700)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Heading Letter Spacing</label>
        <input
          type="text"
          value={fonts.letterSpacing?.heading || '0'}
          onChange={(e) => handleSpacingChange('letterSpacing', 'heading', e.target.value)}
          placeholder="0"
        />
        <small>CSS letter-spacing value (e.g., 0, 0.5px, -0.5px)</small>
      </div>

      <div className="form-group">
        <label>Body Letter Spacing</label>
        <input
          type="text"
          value={fonts.letterSpacing?.body || '0'}
          onChange={(e) => handleSpacingChange('letterSpacing', 'body', e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label>Heading Line Height</label>
        <input
          type="text"
          value={fonts.lineHeight?.heading || '1.2'}
          onChange={(e) => handleSpacingChange('lineHeight', 'heading', e.target.value)}
          placeholder="1.2"
        />
        <small>Line height multiplier (e.g., 1.2, 1.5)</small>
      </div>

      <div className="form-group">
        <label>Body Line Height</label>
        <input
          type="text"
          value={fonts.lineHeight?.body || '1.6'}
          onChange={(e) => handleSpacingChange('lineHeight', 'body', e.target.value)}
          placeholder="1.6"
        />
      </div>

      <div className="form-group">
        <label>Custom Google Fonts URL</label>
        <input
          type="text"
          value={fonts.googleFontsUrl || ''}
          onChange={(e) => handleFontChange('googleFontsUrl', e.target.value)}
          placeholder="https://fonts.googleapis.com/css2?family=..."
        />
        <small>
          Paste a Google Fonts URL to load custom fonts. Fonts will be available in the dropdowns above.
        </small>
      </div>
    </div>
  );
};

export default FontSettings;

