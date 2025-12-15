const ProjectsSection = ({ data, title }) => {
  const { projects, items } = data || {};
  const projectsList = projects || items || [];

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        {projectsList.length > 0 ? (
          <div className="portfolio-projects-grid">
            {projectsList.map((project, index) => (
              <div key={index} className="portfolio-project-card">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title || "Project"}
                    className="portfolio-project-image"
                  />
                )}
                <div className="portfolio-project-content">
                  <div className="portfolio-project-title">
                    {project.title || "Project"}
                  </div>
                  {project.description && (
                    <div className="portfolio-project-description">
                      {project.description}
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-project-link"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects listed.</p>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;

