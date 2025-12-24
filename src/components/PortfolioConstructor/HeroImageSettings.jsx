import { useState } from 'react';
import ImageUpload from './ImageUpload';

/**
 * Hero Image Settings Component
 * Enhanced hero section with image upload
 */
const HeroImageSettings = ({ portfolio, onChange }) => {
  const hero = portfolio.hero || {};

  const handleHeroChange = (field, value) => {
    onChange({
      hero: {
        ...hero,
        [field]: value,
      },
    });
  };

  return (
    <div className="hero-image-settings">
      <h3>Hero Section</h3>
      <p className="section-description">
        Customize your portfolio's hero section - the first thing visitors see.
      </p>

      <div className="form-group">
        <label>Hero Title</label>
        <input
          type="text"
          value={hero.title || ''}
          onChange={(e) => handleHeroChange('title', e.target.value)}
          placeholder="Welcome to My Portfolio"
        />
      </div>

      <div className="form-group">
        <label>Hero Subtitle</label>
        <input
          type="text"
          value={hero.subtitle || ''}
          onChange={(e) => handleHeroChange('subtitle', e.target.value)}
          placeholder="Student & Olympiad Participant"
        />
      </div>

      <div className="form-group">
        <label>Hero Description</label>
        <textarea
          value={hero.description || ''}
          onChange={(e) => handleHeroChange('description', e.target.value)}
          placeholder="A brief description about yourself"
          rows={4}
        />
      </div>

      <div className="form-group">
        <ImageUpload
          label="Hero Background Image"
          value={hero.image || ''}
          onChange={(url) => handleHeroChange('image', url)}
          recommendedSize="1920x1080"
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </div>

      <div className="form-group">
        <ImageUpload
          label="Profile Avatar"
          value={hero.avatar || ''}
          onChange={(url) => handleHeroChange('avatar', url)}
          recommendedSize="400x400"
          aspectRatio="1/1"
        />
      </div>

      <div className="form-group">
        <label>CTA Button Text</label>
        <input
          type="text"
          value={hero.ctaText || ''}
          onChange={(e) => handleHeroChange('ctaText', e.target.value)}
          placeholder="Get in Touch"
        />
      </div>

      <div className="form-group">
        <label>CTA Button Link</label>
        <input
          type="text"
          value={hero.ctaLink || ''}
          onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

export default HeroImageSettings;

