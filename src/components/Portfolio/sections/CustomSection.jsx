const CustomSection = ({ data, title, style }) => {
  const { content, html, text } = data || {};

  return (
    <section className="portfolio-section" style={style}>
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        <div className="portfolio-custom-content">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div>{content || text || "Custom content"}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomSection;

