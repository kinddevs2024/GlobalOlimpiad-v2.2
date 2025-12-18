import InlineTextEditor from "../../PortfolioEditor/InlineTextEditor";
import { usePortfolioEditor } from "../../../hooks/usePortfolioEditor";

const HeroSection = ({ data, isOwner = false, portfolio }) => {
  const { title, subtitle, image, ctaText, ctaLink } = data || {};
  const editor = isOwner ? usePortfolioEditor() : null;

  const handleTitleUpdate = (newTitle) => {
    if (editor) {
      editor.updatePortfolio({
        hero: { ...data, title: newTitle },
      });
    }
  };

  const handleSubtitleUpdate = (newSubtitle) => {
    if (editor) {
      editor.updatePortfolio({
        hero: { ...data, subtitle: newSubtitle },
      });
    }
  };

  const handleCtaTextUpdate = (newCtaText) => {
    if (editor) {
      editor.updatePortfolio({
        hero: { ...data, ctaText: newCtaText },
      });
    }
  };

  return (
    <section className="portfolio-hero">
      <div className="portfolio-hero-content">
        {image && (
          <img
            src={image}
            alt={title || "Portfolio Hero"}
            className="portfolio-hero-image"
          />
        )}
        {title && (
          <h1 className="portfolio-hero-title">
            {isOwner && editor ? (
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
            {isOwner && editor ? (
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
        {ctaText && ctaLink && ctaLink !== null && ctaLink !== "" && (
          <a href={ctaLink} className="portfolio-hero-cta">
            {isOwner && editor ? (
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
    </section>
  );
};

export default HeroSection;

