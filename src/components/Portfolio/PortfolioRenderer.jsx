import { useMemo } from "react";
import { motion } from "framer-motion";
import PortfolioThemeProvider from "./ThemeProvider";
import PortfolioHeader from "./PortfolioHeader";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import AchievementsSection from "./sections/AchievementsSection";
import ProjectsSection from "./sections/ProjectsSection";
import CertificatesSection from "./sections/CertificatesSection";
import InterestsSection from "./sections/InterestsSection";
import EducationSection from "./sections/EducationSection";
import CustomSection from "./sections/CustomSection";
import "../../styles/portfolio.css";

const SECTION_COMPONENTS = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  achievements: AchievementsSection,
  projects: ProjectsSection,
  certificates: CertificatesSection,
  interests: InterestsSection,
  education: EducationSection,
  custom: CustomSection,
};

/**
 * Portfolio Renderer Component
 * Converts portfolio JSON config to rendered UI
 * @param {Object} portfolio - Portfolio data object
 * @param {string} sectionId - Optional section ID/slug for multi-page layouts
 */
const PortfolioRenderer = ({ portfolio, sectionId = null }) => {
  const { layout, theme, hero, sections, animations } = portfolio || {};

  // Sort sections by order and filter enabled ones
  const sortedSections = useMemo(() => {
    if (!sections || !Array.isArray(sections)) return [];
    
    return sections
      .filter((section) => section.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [sections]);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const containerClass = layout === "multi-page" 
    ? "portfolio-multi-page" 
    : "portfolio-single-page";

  // Debug logging
  console.log("PortfolioRenderer - portfolio:", portfolio);
  console.log("PortfolioRenderer - theme:", theme);
  console.log("PortfolioRenderer - hero:", hero);
  console.log("PortfolioRenderer - sections:", sortedSections);
  console.log("PortfolioRenderer - sortedSections count:", sortedSections.length);

  // Check if we have any content to render
  const hasHeroContent = hero && (hero.title || hero.subtitle || hero.image);
  const hasSections = sortedSections.length > 0;

  // For multi-page layouts, filter sections based on sectionId
  const sectionsToRender = useMemo(() => {
    if (layout === "multi-page" && sectionId) {
      // Find the section matching the sectionId
      const sectionSlug = sectionId.toLowerCase();
      const matchingSection = sortedSections.find((section) => {
        // Check if section.slug matches
        if (section.slug && section.slug.toLowerCase() === sectionSlug) {
          return true;
        }
        // Check if section.id matches (e.g., "about-1" -> "about")
        if (section.id && section.id.toLowerCase().startsWith(sectionSlug)) {
          return true;
        }
        // Check if section.type matches
        if (section.type && section.type.toLowerCase() === sectionSlug) {
          return true;
        }
        return false;
      });
      return matchingSection ? [matchingSection] : [];
    }
    // For single-page or home page, return all sections
    return sortedSections;
  }, [layout, sectionId, sortedSections]);

  if (!hasHeroContent && !hasSections) {
    return (
      <PortfolioThemeProvider theme={theme}>
        <div className={`portfolio-container ${containerClass}`}>
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <h1>Portfolio</h1>
            <p>This portfolio is empty. Add content to see it here.</p>
          </div>
        </div>
      </PortfolioThemeProvider>
    );
  }

  // For multi-page layouts with sectionId, show only that section (no hero on section pages)
  const shouldShowHero = layout === "multi-page" && sectionId ? false : hasHeroContent;

  return (
    <PortfolioThemeProvider theme={theme}>
      {/* Portfolio container uses user's Settings theme for page background */}
      {/* Portfolio content sections use portfolio's own theme */}
      <div className={`portfolio-container ${containerClass}`}>
        {/* Render Header for multi-page layouts */}
        {layout === "multi-page" && (
          <PortfolioHeader portfolio={portfolio} hero={hero} />
        )}

        {/* Render Hero Section if exists and has content (only on home page for multi-page) */}
        {shouldShowHero && (
          <motion.div
            initial={animations?.enabled ? "hidden" : false}
            animate={animations?.enabled ? "visible" : false}
            variants={sectionVariants}
          >
            <HeroSection data={hero} />
          </motion.div>
        )}

        {/* Render Sections */}
        {sectionsToRender.length > 0 ? (
          sectionsToRender.map((section, index) => {
            const SectionComponent = SECTION_COMPONENTS[section.type];
            
            if (!SectionComponent) {
              console.warn(`Unknown section type: ${section.type}`);
              return null;
            }

            return (
              <motion.div
                key={section.id || index}
                initial={animations?.enabled ? "hidden" : false}
                animate={animations?.enabled ? "visible" : false}
                variants={sectionVariants}
                transition={{
                  delay: animations?.enabled ? index * 0.1 : 0,
                }}
              >
                <SectionComponent
                  data={section.content || {}}
                  title={section.title}
                  style={section.style || {}}
                />
              </motion.div>
            );
          })
        ) : (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>No sections to display.</p>
          </div>
        )}

        {/* Portfolio Footer Credit */}
        <footer className="portfolio-footer">
          <div className="portfolio-footer-content">
            <p className="portfolio-footer-text">
              This portfolio was created by{" "}
              <a href="/" className="portfolio-footer-link">
                GlobalOlimpiads
              </a>{" "}
              company
            </p>
          </div>
        </footer>
      </div>
    </PortfolioThemeProvider>
  );
};

export default PortfolioRenderer;

