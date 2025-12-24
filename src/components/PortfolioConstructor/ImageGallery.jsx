import ImageUpload from './ImageUpload';

/**
 * Image Gallery Component
 * Manage a gallery of images for portfolio
 */
const ImageGallery = ({ portfolio, onChange }) => {
  const gallery = portfolio.imageGallery || [];

  const addImage = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return;
    }

    const currentGallery = portfolio.imageGallery || [];
    const newImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: imageUrl,
      title: '',
      description: '',
      order: currentGallery.length,
    };

    const updatedGallery = [...currentGallery, newImage];
    onChange({ imageGallery: updatedGallery });
  };

  const updateImage = (index, updates) => {
    const currentGallery = portfolio.imageGallery || [];
    const updated = [...currentGallery];
    updated[index] = { ...updated[index], ...updates };
    onChange({ imageGallery: updated });
  };

  const removeImage = (index) => {
    const currentGallery = portfolio.imageGallery || [];
    onChange({
      imageGallery: currentGallery.filter((_, i) => i !== index),
    });
  };

  const moveImage = (index, direction) => {
    const currentGallery = portfolio.imageGallery || [];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentGallery.length) return;

    const updated = [...currentGallery];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange({ imageGallery: updated });
  };

  return (
    <div className="image-gallery">
      <h3>Image Gallery</h3>
      <p className="section-description">
        Create a gallery of images to showcase your work, projects, or achievements.
      </p>

      <div className="form-group">
        <label>Add New Image</label>
        <ImageUpload
          label=""
          value=""
          onChange={addImage}
          recommendedSize="1200x800"
          maxSize={10 * 1024 * 1024}
        />
      </div>

      <div className="gallery-grid" style={{ marginTop: '2rem' }}>
        {gallery.map((image, index) => (
          <div
            key={image.id || index}
            className="gallery-item"
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '75%',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '0.5rem',
              }}
            >
              <img
                src={image.url}
                alt={image.title || 'Gallery image'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={image.title || ''}
                onChange={(e) => updateImage(index, { title: e.target.value })}
                placeholder="Image title"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <textarea
                value={image.description || ''}
                onChange={(e) => updateImage(index, { description: e.target.value })}
                placeholder="Image description"
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    opacity: index === 0 ? 0.5 : 1,
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === gallery.length - 1}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    cursor: index === gallery.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    marginLeft: '0.25rem',
                    opacity: index === gallery.length - 1 ? 0.5 : 1,
                  }}
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {gallery.length === 0 && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            padding: '3rem',
          }}
        >
          No images in gallery yet. Upload an image to get started!
        </p>
      )}
    </div>
  );
};

export default ImageGallery;
