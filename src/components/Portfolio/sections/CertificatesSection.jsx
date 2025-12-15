const CertificatesSection = ({ data, title }) => {
  const { certificates, items } = data || {};
  const certificatesList = certificates || items || [];

  return (
    <section className="portfolio-section">
      <div className="portfolio-section-content">
        {title && <h2 className="portfolio-section-title">{title}</h2>}
        {certificatesList.length > 0 ? (
          <div className="portfolio-certificates-grid">
            {certificatesList.map((certificate, index) => (
              <div key={index} className="portfolio-certificate-item">
                {certificate.image && (
                  <img
                    src={certificate.image}
                    alt={certificate.title || "Certificate"}
                    className="portfolio-certificate-image"
                  />
                )}
                {certificate.title && (
                  <div className="portfolio-certificate-title">
                    {certificate.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No certificates listed.</p>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;

