const InterestsSection = ({ data, title }) => {
  const { interests, items } = data || {};
  const interestsList = interests || items || [];

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        {interestsList.length > 0 ? (
          <div className="portfolio-interests-list">
            {interestsList.map((interest, index) => (
              <div key={index} className="portfolio-interest-tag">
                {typeof interest === "string" ? interest : interest.name || interest.label}
              </div>
            ))}
          </div>
        ) : (
          <p>No interests listed.</p>
        )}
      </div>
    </section>
  );
};

export default InterestsSection;

