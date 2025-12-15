import { useEffect } from "react";
import { applyTheme } from "../../utils/portfolioThemes";

/**
 * Theme Provider Component
 * Applies portfolio theme to CSS variables
 * Portfolio content uses its own theme, but page wrapper uses user's Settings theme
 */
const PortfolioThemeProvider = ({ theme, children }) => {
  useEffect(() => {
    if (theme) {
      // Apply portfolio theme to portfolio-specific CSS variables
      // This only affects the portfolio content, not the page wrapper
      applyTheme(theme);
    }
  }, [theme]);

  return <>{children}</>;
};

export default PortfolioThemeProvider;

