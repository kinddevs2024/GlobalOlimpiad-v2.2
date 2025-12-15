import PortfolioRenderer from "../Portfolio/PortfolioRenderer";

const PortfolioPreview = ({ portfolio }) => {
  return (
    <div className="portfolio-preview">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <p>This is how your portfolio will look to visitors.</p>
      </div>
      <div className="preview-container">
        <PortfolioRenderer portfolio={portfolio} />
      </div>
    </div>
  );
};

export default PortfolioPreview;

