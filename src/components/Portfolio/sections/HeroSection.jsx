const HeroSection = ({ data }) => {
  const { title, subtitle, image, ctaText, ctaLink } = data || {};

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
        {title && <h1 className="portfolio-hero-title">{title}</h1>}
        {subtitle && <p className="portfolio-hero-subtitle">{subtitle}</p>}
        {ctaText && ctaLink && ctaLink !== null && ctaLink !== "" && (
          <a href={ctaLink} className="portfolio-hero-cta">
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

