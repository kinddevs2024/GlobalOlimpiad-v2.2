const AchievementsSection = ({ data, title }) => {
  const { achievements, items } = data || {};
  const achievementsList = achievements || items || [];

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        {achievementsList.length > 0 ? (
          <div className="portfolio-achievements-list">
            {achievementsList.map((achievement, index) => (
              <div key={index} className="portfolio-achievement-item">
                <div className="portfolio-achievement-title">
                  {achievement.title || achievement.name || "Achievement"}
                </div>
                {achievement.description && (
                  <div className="portfolio-achievement-description">
                    {achievement.description}
                  </div>
                )}
                <div className="portfolio-achievement-meta">
                  {achievement.date && <span>Date: {achievement.date}</span>}
                  {achievement.olympiad && (
                    <span>Olympiad: {achievement.olympiad}</span>
                  )}
                  {achievement.rank && <span>Rank: {achievement.rank}</span>}
                  {achievement.score && <span>Score: {achievement.score}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No achievements listed.</p>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;

