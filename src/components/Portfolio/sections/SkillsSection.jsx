const SkillsSection = ({ data, title }) => {
  const { skills, items } = data || {};
  const skillsList = skills || items || [];

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        {skillsList.length > 0 ? (
          <div className="portfolio-skills-grid">
            {skillsList.map((skill, index) => (
              <div key={index} className="portfolio-skill-tag">
                {typeof skill === "string" ? skill : skill.name || skill.label}
              </div>
            ))}
          </div>
        ) : (
          <p>No skills listed.</p>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;

