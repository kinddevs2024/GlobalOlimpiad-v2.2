const LayoutSelector = ({ layout, onChange }) => {
  return (
    <div className="layout-selector">
      <h3>Choose Layout</h3>
      <p className="section-description">
        Select how your portfolio sections are displayed.
      </p>
      <div className="layout-options">
        <div
          className={`layout-option ${layout === "single-page" ? "selected" : ""}`}
          onClick={() => onChange("single-page")}
        >
          <div className="layout-preview single-page-preview">
            <div className="preview-section"></div>
            <div className="preview-section"></div>
            <div className="preview-section"></div>
          </div>
          <h4>Single Page</h4>
          <p>All sections on one scrollable page</p>
        </div>
        <div
          className={`layout-option ${layout === "multi-page" ? "selected" : ""}`}
          onClick={() => onChange("multi-page")}
        >
          <div className="layout-preview multi-page-preview">
            <div className="preview-page"></div>
            <div className="preview-page"></div>
            <div className="preview-page"></div>
          </div>
          <h4>Multi Page</h4>
          <p>Each section on a separate route</p>
        </div>
      </div>
    </div>
  );
};

export default LayoutSelector;

