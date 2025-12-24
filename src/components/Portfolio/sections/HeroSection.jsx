import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";

const HeroSection = ({ data, isOwner = false, portfolio }) => {
  // Safely extract hero data with defaults
  const heroData = data || {};
  const title = heroData.title || null;
  const subtitle = heroData.subtitle || null;
  const description = heroData.description || null;
  const image = heroData.image || null;
  const avatar = heroData.avatar || null;
  const ctaText = heroData.ctaText || null;
  const ctaLink = heroData.ctaLink || null;
  
  // Get editor safely
  let editor = null;
  try {
    editor = isOwner ? usePortfolioEditor() : null;
  } catch (e) {
    // Not in editor context, that's fine
    editor = null;
  }

  const handleTitleUpdate = (newTitle) => {
    if (editor && editor.updatePortfolio) {
      editor.updatePortfolio({
        hero: { ...heroData, title: newTitle },
      });
    }
  };

  const handleSubtitleUpdate = (newSubtitle) => {
    if (editor && editor.updatePortfolio) {
      editor.updatePortfolio({
        hero: { ...heroData, subtitle: newSubtitle },
      });
    }
  };

  const handleCtaTextUpdate = (newCtaText) => {
    if (editor && editor.updatePortfolio) {
      editor.updatePortfolio({
        hero: { ...heroData, ctaText: newCtaText },
      });
    }
  };

  // Helper to get full image URL (handle relative paths)
  const getImageUrl = (url) => {
    if (!url) return '';
    // If it's already a full URL, return as-is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    // If it starts with /, it's an absolute path from the API
    if (url.startsWith('/')) {
      // Get API base URL - use Vite env variable if available, otherwise use current origin
      let apiBaseUrl = window.location.origin;
      try {
        // Try Vite environment variable first
        if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
          apiBaseUrl = import.meta.env.VITE_API_URL;
        }
      } catch (e) {
        // If import.meta is not available, use window.location.origin (already set)
      }
      return `${apiBaseUrl}${url}`;
    }
    // Otherwise return as-is (might be a relative path)
    return url;
  };

  // Don't render if there's no content at all
  if (!title && !subtitle && !description && !image && !avatar && !ctaText) {
    return null;
  }

  return (
    <section className="portfolio-hero">
      <div className="portfolio-hero-content">
        {image && (
          <div className="portfolio-hero-background">
            <img
              src={getImageUrl(image)}
              alt={title || "Portfolio Hero Background"}
              className="portfolio-hero-image"
              onError={(e) => {
                console.error('Failed to load hero image:', image);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="portfolio-hero-text-content">
          {avatar && (
            <div className="portfolio-hero-avatar">
              <img
                src={getImageUrl(avatar)}
                alt={title || "Portfolio Avatar"}
                className="portfolio-hero-avatar-img"
                onError={(e) => {
                  console.error('Failed to load avatar:', avatar);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          {title && (
            <h1 className="portfolio-hero-title">
              {isOwner && editor && editor.updatePortfolio ? (
                <InlineTextEditor
                  value={title}
                  onSave={handleTitleUpdate}
                  placeholder="Hero title..."
                  tag="span"
                />
              ) : (
                title
              )}
            </h1>
          )}
          {subtitle && (
            <p className="portfolio-hero-subtitle">
              {isOwner && editor && editor.updatePortfolio ? (
                <InlineTextEditor
                  value={subtitle}
                  onSave={handleSubtitleUpdate}
                  placeholder="Hero subtitle..."
                  tag="span"
                />
              ) : (
                subtitle
              )}
            </p>
          )}
          {description && (
            <p className="portfolio-hero-description">
              {description}
            </p>
          )}
          {ctaText && ctaLink && ctaLink !== null && ctaLink !== "" && (
            <a href={ctaLink} className="portfolio-hero-cta">
              {isOwner && editor && editor.updatePortfolio ? (
                <InlineTextEditor
                  value={ctaText}
                  onSave={handleCtaTextUpdate}
                  placeholder="CTA text..."
                  tag="span"
                />
              ) : (
                ctaText
              )}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

