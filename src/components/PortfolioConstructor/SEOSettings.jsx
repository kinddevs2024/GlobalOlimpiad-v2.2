/**
 * SEO Settings Component
 * Allows users to configure SEO metadata for their portfolio
 */
const SEOSettings = ({ portfolio, onChange }) => {
  const seoData = portfolio.seo || {
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary',
  };

  const handleSEOChange = (field, value) => {
    onChange({
      seo: {
        ...seoData,
        [field]: value,
      },
    });
  };

  return (
    <div className="seo-settings">
      <h3>SEO & Meta Settings</h3>
      <p className="section-description">
        Improve your portfolio's visibility in search engines and social media.
      </p>

      <div className="form-group">
        <label>
          Meta Description
          <textarea
            value={seoData.metaDescription || ''}
            onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
            placeholder="A brief description of your portfolio (150-160 characters recommended)"
            rows={3}
            maxLength={160}
          />
          <small>{seoData.metaDescription?.length || 0}/160 characters</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Meta Keywords
          <input
            type="text"
            value={seoData.metaKeywords || ''}
            onChange={(e) => handleSEOChange('metaKeywords', e.target.value)}
            placeholder="portfolio, student, developer, olympiad (comma-separated)"
          />
          <small>Separate keywords with commas</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Open Graph Title
          <input
            type="text"
            value={seoData.ogTitle || ''}
            onChange={(e) => handleSEOChange('ogTitle', e.target.value)}
            placeholder="Title for social media sharing (defaults to portfolio title)"
          />
          <small>Title shown when sharing on Facebook, LinkedIn, etc.</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Open Graph Description
          <textarea
            value={seoData.ogDescription || ''}
            onChange={(e) => handleSEOChange('ogDescription', e.target.value)}
            placeholder="Description for social media sharing"
            rows={3}
          />
          <small>Description shown when sharing on social media</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Open Graph Image URL
          <input
            type="text"
            value={seoData.ogImage || ''}
            onChange={(e) => handleSEOChange('ogImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <small>Image shown when sharing on social media (1200x630px recommended)</small>
        </label>
      </div>

      <div className="form-group">
        <label>
          Twitter Card Type
          <select
            value={seoData.twitterCard || 'summary'}
            onChange={(e) => handleSEOChange('twitterCard', e.target.value)}
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary with Large Image</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default SEOSettings;

