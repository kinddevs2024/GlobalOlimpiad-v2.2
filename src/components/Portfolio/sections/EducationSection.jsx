const EducationSection = ({ data, title }) => {
  const { education, items } = data || {};
  const educationList = education || items || [];

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        {educationList.length > 0 ? (
          <div className="portfolio-education-list">
            {educationList.map((edu, index) => (
              <div key={index} className="portfolio-education-item">
                <div className="portfolio-education-title">
                  {edu.degree || edu.title || "Education"}
                </div>
                <div className="portfolio-education-institution">
                  {edu.institution || edu.school || edu.university}
                </div>
                {edu.period && (
                  <div className="portfolio-education-period">{edu.period}</div>
                )}
                {(edu.startDate || edu.endDate) && (
                  <div className="portfolio-education-period">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No education information listed.</p>
        )}
      </div>
    </section>
  );
};

export default EducationSection;

