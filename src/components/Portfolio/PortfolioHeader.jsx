import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../context/TranslationContext";
import VerificationBadge from "../PortfolioVerification/VerificationBadge";
import { useVerification } from "../../hooks/useVerification";
import "../../styles/portfolio.css";

/**
 * Portfolio Header Component
 * Navigation header for multi-page portfolios
 */
const PortfolioHeader = ({ portfolio, hero }) => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { sections = [], layout, theme } = portfolio || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { targetLanguage, changeLanguage, availableLanguages } = useTranslation();
  
  // Get verification status
  let verificationStatus = null;
  try {
    const { verificationStatuses } = useVerification();
    verificationStatus = verificationStatuses?.portfolio?.status || null;
  } catch (e) {
    // Verification context not available, that's fine
  }

  // Get portfolio theme colors (RGB values are set by applyTheme in ThemeProvider)
  const portfolioAccent = theme?.colors?.accent || "#0066ff";
  const portfolioBackground = theme?.colors?.background || "#0a1a0a";
  const portfolioText = theme?.colors?.text || "#ffffff";

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Only show header for multi-page layouts
  if (layout !== "multi-page") {
    return null;
  }

  // Get enabled sections sorted by order
  const enabledSections = sections
    .filter((section) => section.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Generate section slug from section ID or type
  const getSectionSlug = (section) => {
    // Use section.slug if provided, otherwise generate from id or type
    if (section.slug) return section.slug;
    if (section.id) {
      // Extract slug from id (e.g., "about-1" -> "about")
      return section.id.split("-")[0];
    }
    return section.type;
  };

  // Check if current route matches a section
  const isActiveSection = (section) => {
    const sectionSlug = getSectionSlug(section);
    const currentPath = location.pathname;
    
    // Home route (just /portfolio/:slug)
    if (section.type === "hero" || section.order === 0) {
      return currentPath === `/portfolio/${slug}` || currentPath === `/portfolio/${slug}/`;
    }
    
    // Section route
    return currentPath === `/portfolio/${slug}/${sectionSlug}`;
  };

  // Get home link (portfolio root)
  const homeLink = `/portfolio/${slug}`;
  const hasHero = hero && (hero.title || hero.subtitle || hero.image);
  const portfolioLogo = portfolio?.logo;

  // Animation variants for mobile menu - smoother and more polished
  const menuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    closed: {
      opacity: 0,
      x: -30,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const headerVariants = {
    closed: {
      opacity: 0,
      y: -20,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.05,
      },
    },
  };

  const hamburgerVariants = {
    closed: {
      rotate: 0,
      scale: 1,
    },
    open: {
      rotate: 180,
      scale: 1.1,
    },
  };

  const line1Variants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: 45,
      y: 8,
    },
  };

  const line2Variants = {
    closed: {
      opacity: 1,
    },
    open: {
      opacity: 0,
    },
  };

  const line3Variants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: -45,
      y: -8,
    },
  };

  return (
    <header className="portfolio-header">
      <div className="portfolio-header-container">
        {/* Logo/Home Link */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to={homeLink} className="portfolio-header-logo">
            {portfolioLogo ? (
              <img
                src={portfolioLogo}
                alt={hero?.title || "Portfolio"}
                className="portfolio-header-logo-image"
              />
            ) : (
              <span>{hero?.title || "Portfolio"}</span>
            )}
          </Link>
          {/* Portfolio-level verification badge - always show */}
          <VerificationBadge
            status={verificationStatus || "unverified"}
            level="portfolio"
            showTooltip={true}
          />
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="portfolio-header-nav desktop-nav">
          {/* Home link (if hero exists) */}
          {hasHero && (
            <Link
              to={homeLink}
              className={`portfolio-header-link ${
                location.pathname === homeLink || location.pathname === `${homeLink}/`
                  ? "active"
                  : ""
              }`}
            >
              Home
            </Link>
          )}

          {/* Section Links */}
          {enabledSections.map((section) => {
            const sectionSlug = getSectionSlug(section);
            const sectionLink = `/portfolio/${slug}/${sectionSlug}`;
            const isActive = isActiveSection(section);

            return (
              <Link
                key={section.id || section.type}
                to={sectionLink}
                className={`portfolio-header-link ${isActive ? "active" : ""}`}
              >
                {section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <motion.button
          className="portfolio-header-mobile-toggle"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          variants={hamburgerVariants}
          animate={mobileMenuOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        >
          <motion.span variants={line1Variants} animate={mobileMenuOpen ? "open" : "closed"} />
          <motion.span variants={line2Variants} animate={mobileMenuOpen ? "open" : "closed"} />
          <motion.span variants={line3Variants} animate={mobileMenuOpen ? "open" : "closed"} />
        </motion.button>
      </div>

      {/* Mobile Navigation Menu with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              className="portfolio-header-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.nav
              className="portfolio-header-nav mobile-nav"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                "--portfolio-accent-color": portfolioAccent,
                "--portfolio-bg-color": portfolioBackground,
                "--portfolio-text-color": portfolioText,
              }}
            >
              {/* Matrix Background */}
              <div className="matrix-background"></div>

              {/* Menu Header with Close Button */}
              <motion.div className="mobile-nav-header" variants={headerVariants}>
                <div className="mobile-nav-header-content">
                  {portfolioLogo ? (
                    <img
                      src={portfolioLogo}
                      alt={hero?.title || "Portfolio"}
                      className="mobile-nav-logo"
                    />
                  ) : (
                    <div className="mobile-nav-logo-text">
                      <span className="logo-letter">{slug?.charAt(0).toUpperCase() || "P"}</span>
                      <span className="logo-text">{slug || hero?.title || "Portfolio"}</span>
                    </div>
                  )}
                </div>
                <button
                  className="mobile-nav-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <span>×</span>
                </button>
              </motion.div>

              {/* Menu Items */}
              <div className="mobile-nav-items">
                {/* Home link (if hero exists) - Button Style */}
                {hasHero && (
                  <motion.div variants={linkVariants}>
                    <Link
                      to={homeLink}
                      className={`mobile-nav-link mobile-nav-link-button ${
                        location.pathname === homeLink || location.pathname === `${homeLink}/`
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-nav-link-text">Home</span>
                      <span className="mobile-nav-link-arrow">→</span>
                    </Link>
                  </motion.div>
                )}

                {/* First Section (About) - Button Style if exists */}
                {enabledSections.length > 0 && enabledSections[0] && (
                  <motion.div variants={linkVariants}>
                    {(() => {
                      const section = enabledSections[0];
                      const sectionSlug = getSectionSlug(section);
                      const sectionLink = `/portfolio/${slug}/${sectionSlug}`;
                      const isActive = isActiveSection(section);
                      return (
                        <Link
                          to={sectionLink}
                          className={`mobile-nav-link mobile-nav-link-button ${isActive ? "active" : ""}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="mobile-nav-link-text">
                            {section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                          </span>
                          <span className="mobile-nav-link-arrow">→</span>
                        </Link>
                      );
                    })()}
                  </motion.div>
                )}

                {/* Remaining Section Links - Text Style */}
                {enabledSections.slice(1).map((section, index) => {
                  const sectionSlug = getSectionSlug(section);
                  const sectionLink = `/portfolio/${slug}/${sectionSlug}`;
                  const isActive = isActiveSection(section);

                  return (
                    <motion.div key={section.id || section.type} variants={linkVariants}>
                      <Link
                        to={sectionLink}
                        className={`mobile-nav-link mobile-nav-link-text ${isActive ? "active" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mobile-nav-link-text">
                          {section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </span>
                        <span className="mobile-nav-link-arrow">→</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Language Selection */}
              <motion.div className="mobile-nav-language-section" variants={headerVariants}>
                <div className="mobile-nav-divider"></div>
                <div className="mobile-nav-language-buttons">
                  {availableLanguages
                    .filter((lang) => ["uz", "ru", "en"].includes(lang.code))
                    .map((lang) => (
                      <button
                        key={lang.code}
                        className={`mobile-nav-language-btn ${
                          targetLanguage === lang.code ? "active" : ""
                        }`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        {lang.code === "uz" ? "O'zbek" : lang.code === "ru" ? "Русский" : "English"}
                      </button>
                    ))}
                </div>
              </motion.div>

              {/* Get Started Button */}
              <motion.div className="mobile-nav-footer" variants={headerVariants}>
                <div className="mobile-nav-divider"></div>
                <button
                  className="mobile-nav-get-started"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                >
                  <span>Get Started</span>
                  <span className="get-started-arrow">→</span>
                </button>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PortfolioHeader;

