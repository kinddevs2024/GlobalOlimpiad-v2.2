const AboutSection = ({ data, title }) => {
  const { text, bio } = data || {};

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        <div className="portfolio-about">
          {text || bio || "No about information available."}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

