import ImageUpload from './ImageUpload';

/**
 * Background Settings Component
 * Configure portfolio background images and colors
 */
const BackgroundSettings = ({ portfolio, onChange }) => {
  const background = portfolio.background || {
    type: 'color', // 'color' | 'image' | 'gradient'
    color: '#FFFFFF',
    image: '',
    imagePosition: 'center',
    imageSize: 'cover',
    imageRepeat: 'no-repeat',
    gradient: {
      type: 'linear',
      colors: ['#FFFFFF', '#F0F0F0'],
      direction: 'to bottom',
    },
  };

  const handleBackgroundChange = (field, value) => {
    onChange({
      background: {
        ...background,
        [field]: value,
      },
    });
  };

  const handleGradientChange = (field, value) => {
    onChange({
      background: {
        ...background,
        gradient: {
          ...background.gradient,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="background-settings">
      <h3>Background Settings</h3>
      <p className="section-description">
        Customize the background of your portfolio.
      </p>

      <div className="form-group">
        <label>Background Type</label>
        <select
          value={background.type || 'color'}
          onChange={(e) => handleBackgroundChange('type', e.target.value)}
        >
          <option value="color">Solid Color</option>
          <option value="image">Image</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>

      {background.type === 'color' && (
        <div className="form-group">
          <label>Background Color</label>
          <input
            type="color"
            value={background.color || '#FFFFFF'}
            onChange={(e) => handleBackgroundChange('color', e.target.value)}
            style={{
              width: '100%',
              height: '50px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
        </div>
      )}

      {background.type === 'image' && (
        <>
          <div className="form-group">
            <ImageUpload
              label="Background Image"
              value={background.image || ''}
              onChange={(url) => handleBackgroundChange('image', url)}
              recommendedSize="1920x1080"
              maxSize={10 * 1024 * 1024}
            />
          </div>

          <div className="form-group">
            <label>Image Position</label>
            <select
              value={background.imagePosition || 'center'}
              onChange={(e) => handleBackgroundChange('imagePosition', e.target.value)}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image Size</label>
            <select
              value={background.imageSize || 'cover'}
              onChange={(e) => handleBackgroundChange('imageSize', e.target.value)}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image Repeat</label>
            <select
              value={background.imageRepeat || 'no-repeat'}
              onChange={(e) => handleBackgroundChange('imageRepeat', e.target.value)}
            >
              <option value="no-repeat">No Repeat</option>
              <option value="repeat">Repeat</option>
              <option value="repeat-x">Repeat X</option>
              <option value="repeat-y">Repeat Y</option>
            </select>
          </div>
        </>
      )}

      {background.type === 'gradient' && (
        <>
          <div className="form-group">
            <label>Gradient Type</label>
            <select
              value={background.gradient?.type || 'linear'}
              onChange={(e) => handleGradientChange('type', e.target.value)}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gradient Direction (for linear)</label>
            <select
              value={background.gradient?.direction || 'to bottom'}
              onChange={(e) => handleGradientChange('direction', e.target.value)}
            >
              <option value="to bottom">Top to Bottom</option>
              <option value="to top">Bottom to Top</option>
              <option value="to right">Left to Right</option>
              <option value="to left">Right to Left</option>
              <option value="to bottom right">Top Left to Bottom Right</option>
              <option value="to top left">Bottom Right to Top Left</option>
            </select>
          </div>

          <div className="form-group">
            <label>Color 1</label>
            <input
              type="color"
              value={background.gradient?.colors?.[0] || '#FFFFFF'}
              onChange={(e) => {
                const colors = [...(background.gradient?.colors || ['#FFFFFF', '#F0F0F0'])];
                colors[0] = e.target.value;
                handleGradientChange('colors', colors);
              }}
              style={{
                width: '100%',
                height: '50px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>

          <div className="form-group">
            <label>Color 2</label>
            <input
              type="color"
              value={background.gradient?.colors?.[1] || '#F0F0F0'}
              onChange={(e) => {
                const colors = [...(background.gradient?.colors || ['#FFFFFF', '#F0F0F0'])];
                colors[1] = e.target.value;
                handleGradientChange('colors', colors);
              }}
              style={{
                width: '100%',
                height: '50px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BackgroundSettings;

