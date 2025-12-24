import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { portfolioAPI } from "../../services/portfolioAPI";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { DEFAULT_THEME, normalizeTheme } from "../../utils/portfolioThemes";
import LayoutSelector from "../../components/PortfolioConstructor/LayoutSelector";
import ThemeCustomizer from "../../components/PortfolioConstructor/ThemeCustomizer";
import SectionManager from "../../components/PortfolioConstructor/SectionManager";
import PortfolioPreview from "../../components/PortfolioConstructor/PortfolioPreview";
import TextToPortfolioInput from "../../components/PortfolioConstructor/TextToPortfolioInput";
import SEOSettings from "../../components/PortfolioConstructor/SEOSettings";
import SocialLinksSettings from "../../components/PortfolioConstructor/SocialLinksSettings";
import AdvancedStyling from "../../components/PortfolioConstructor/AdvancedStyling";
import CustomCodeSettings from "../../components/PortfolioConstructor/CustomCodeSettings";
import PortfolioActions from "../../components/PortfolioConstructor/PortfolioActions";
import HeroImageSettings from "../../components/PortfolioConstructor/HeroImageSettings";
import BackgroundSettings from "../../components/PortfolioConstructor/BackgroundSettings";
import FaviconSettings from "../../components/PortfolioConstructor/FaviconSettings";
import ImageGallery from "../../components/PortfolioConstructor/ImageGallery";
import FontSettings from "../../components/PortfolioConstructor/FontSettings";
import PortfolioStatistics from "../../components/PortfolioConstructor/PortfolioStatistics";
import SharingSettings from "../../components/PortfolioConstructor/SharingSettings";
import ImageUpload from "../../components/PortfolioConstructor/ImageUpload";
import "./PortfolioConstructor.css";
import "../../components/PortfolioConstructor/PortfolioConstructor.css";

const PortfolioConstructor = () => {
  const { user } = useAuth();
  const { currentTheme, customTheme } = useTheme();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [savedPortfolio, setSavedPortfolio] = useState(null); // Track saved state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [showTextGenerator, setShowTextGenerator] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // For logo file upload

  // Calculate if accent color is light or dark, and set active button text color
  useEffect(() => {
    const root = document.documentElement;
    const accentColor =
      getComputedStyle(root).getPropertyValue("--accent").trim() || "#0066ff";

    // Convert hex to RGB and calculate brightness
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Calculate relative luminance (brightness)
    const getBrightness = (rgb) => {
      // Using relative luminance formula
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const rgb = hexToRgb(accentColor);
    if (rgb) {
      const brightness = getBrightness(rgb);
      // If brightness > 0.5, accent is light, use dark text; otherwise use light text
      const textColor = brightness > 0.5 ? "#000000" : "#ffffff";
      root.style.setProperty("--active-button-text", textColor);
    } else {
      // Fallback: assume dark accent, use white text
      root.style.setProperty("--active-button-text", "#ffffff");
    }
  }, [currentTheme, customTheme]);

  // Initialize portfolio structure
  const initializePortfolio = () => ({
    slug: user?.email?.split("@")[0] || "my-portfolio",
    visibility: "public",
    layout: "single-page",
    logo: "", // Portfolio logo URL
    theme: DEFAULT_THEME,
    hero: {
      title: "Welcome to My Portfolio",
      subtitle: "Student & Olympiad Participant",
      image: "",
      ctaText: "",
      ctaLink: "",
    },
    sections: [
      {
        id: "about-1",
        type: "about",
        enabled: true,
        order: 0,
        title: "About Me",
        content: { text: "Tell your story here..." },
        style: {},
      },
      {
        id: "achievements-1",
        type: "achievements",
        enabled: true,
        order: 1,
        title: "Achievements",
        content: { achievements: [] },
        style: {},
      },
      {
        id: "skills-1",
        type: "skills",
        enabled: true,
        order: 2,
        title: "Skills",
        content: { skills: [] },
        style: {},
      },
    ],
    animations: {
      enabled: true,
      type: "fade",
    },
  });

  // Convert frontend format back to backend format for saving
  const convertPortfolioToBackendFormat = (frontendPortfolio) => {
    // Create a clean backend format object with only the fields we need
    // Don't spread the entire object to avoid sending stale or frontend-only fields
    const backendFormat = {
      // Only include fields that backend expects
      _id: frontendPortfolio._id,
      studentId: frontendPortfolio.studentId,
      slug: frontendPortfolio.slug || "my-portfolio",
      layout: frontendPortfolio.layout || "single-page",
      isPublic:
        frontendPortfolio.visibility === "public" ||
        frontendPortfolio.isPublic === true,
    };

    // Convert theme: frontend { colors, typography, spacing, containerWidth } -> backend { colors, fonts, styles }
    if (frontendPortfolio.theme) {
      backendFormat.theme = {
        name: frontendPortfolio.theme.name,
        colors: {
          ...frontendPortfolio.theme.colors,
          primary: frontendPortfolio.theme.colors?.primary || "#000000",
          secondary: frontendPortfolio.theme.colors?.secondary || "#666666",
          background: frontendPortfolio.theme.colors?.background || "#FFFFFF",
          text: frontendPortfolio.theme.colors?.text || "#000000",
          accent: frontendPortfolio.theme.colors?.accent || "#0066FF",
        },
        fonts: {
          heading:
            frontendPortfolio.theme.typography?.fontFamily ||
            "Inter, system-ui, sans-serif",
          body:
            frontendPortfolio.theme.typography?.fontFamily ||
            "Inter, system-ui, sans-serif",
        },
        // Preserve containerWidth in theme if it exists
        containerWidth: frontendPortfolio.theme.containerWidth || "medium",
        styles: {
          spacing: frontendPortfolio.theme.spacing || "normal",
          headingSize:
            frontendPortfolio.theme.typography?.headingSize || "2.5rem",
          bodySize: frontendPortfolio.theme.typography?.bodySize || "1rem",
        },
      };
    }

    // Convert sections: frontend { id, type, enabled, order, title, content } -> backend { type, title, content/items, order }
    if (
      frontendPortfolio.sections &&
      Array.isArray(frontendPortfolio.sections)
    ) {
      backendFormat.sections = frontendPortfolio.sections
        .filter((section) => section.enabled !== false) // Only include enabled sections
        .map((section) => {
          const backendSection = {
            type: section.type,
            title:
              section.title ||
              section.type.charAt(0).toUpperCase() + section.type.slice(1),
            order: section.order !== undefined ? section.order : 0,
          };

          // Convert content based on section type
          if (section.content) {
            // Check for items arrays first (most common case)
            const itemsKey = section.type; // e.g., "achievements", "projects", etc.
            const pluralKey = itemsKey + "s"; // e.g., "achievements", "projects"

            // Try to find items array in content
            if (
              section.content[pluralKey] &&
              Array.isArray(section.content[pluralKey])
            ) {
              // Found items array (e.g., content.achievements, content.projects)
              backendSection.items = section.content[pluralKey];
            } else if (
              section.content[itemsKey] &&
              Array.isArray(section.content[itemsKey])
            ) {
              // Found singular key (e.g., content.achievement)
              backendSection.items = section.content[itemsKey];
            } else if (Array.isArray(section.content)) {
              // Content is directly an array
              backendSection.items = section.content;
            } else if (section.type === "about" && section.content.text) {
              // About section uses content as string
              backendSection.content = section.content.text;
            } else if (section.type === "contact") {
              // Contact section might have content or socialLinks
              if (section.content.text) {
                backendSection.content = section.content.text;
              }
              if (section.content.socialLinks) {
                backendSection.socialLinks = section.content.socialLinks;
              }
            } else if (section.type === "custom" && section.content) {
              // Custom section - preserve all content
              if (section.content.html) {
                backendSection.content = section.content.html;
              } else if (section.content.text) {
                backendSection.content = section.content.text;
              } else {
                backendSection.content = section.content;
              }
            } else if (section.content.text) {
              // Fallback for text content
              backendSection.content = section.content.text;
            } else {
              // Preserve content as-is if we don't know how to convert it
              backendSection.content = section.content;
            }
          }

          // Preserve any additional properties from the section
          Object.keys(section).forEach((key) => {
            if (
              !["id", "enabled", "content"].includes(key) &&
              !backendSection.hasOwnProperty(key)
            ) {
              backendSection[key] = section[key];
            }
          });

          return backendSection;
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order
    }

    // Handle certificates array separately (if certificates section exists, extract items)
    if (frontendPortfolio.sections) {
      const certificatesSection = frontendPortfolio.sections.find(
        (s) => s.type === "certificates"
      );
      if (certificatesSection && certificatesSection.content?.certificates) {
        backendFormat.certificates = certificatesSection.content.certificates;
      } else if (
        frontendPortfolio.certificates &&
        !backendFormat.certificates
      ) {
        backendFormat.certificates = frontendPortfolio.certificates;
      }
    }

    // Add logo if it exists
    if (frontendPortfolio.logo) {
      backendFormat.logo = frontendPortfolio.logo;
    }

    // Add hero section - preserve null values (don't convert to empty strings)
    if (frontendPortfolio.hero) {
      backendFormat.hero = {
        title:
          frontendPortfolio.hero.title !== undefined
            ? frontendPortfolio.hero.title
            : null,
        subtitle:
          frontendPortfolio.hero.subtitle !== undefined
            ? frontendPortfolio.hero.subtitle
            : null,
        description:
          frontendPortfolio.hero.description !== undefined
            ? frontendPortfolio.hero.description
            : null,
        image:
          frontendPortfolio.hero.image !== undefined
            ? frontendPortfolio.hero.image
            : null,
        avatar:
          frontendPortfolio.hero.avatar !== undefined
            ? frontendPortfolio.hero.avatar
            : null,
        ctaText:
          frontendPortfolio.hero.ctaText !== undefined
            ? frontendPortfolio.hero.ctaText
            : null,
        ctaLink:
          frontendPortfolio.hero.ctaLink !== undefined
            ? frontendPortfolio.hero.ctaLink
            : null,
      };
    } else {
      // If hero doesn't exist, set default structure with null values
      backendFormat.hero = {
        title: null,
        subtitle: null,
        description: null,
        image: null,
        avatar: null,
        ctaText: null,
        ctaLink: null,
      };
    }

    // Add new portfolio features - always include these fields (even if empty)
    backendFormat.imageGallery = Array.isArray(frontendPortfolio.imageGallery)
      ? frontendPortfolio.imageGallery
      : [];
    backendFormat.seo = frontendPortfolio.seo || {};
    backendFormat.socialLinks = Array.isArray(frontendPortfolio.socialLinks)
      ? frontendPortfolio.socialLinks
      : [];
    backendFormat.sharing = frontendPortfolio.sharing || {};
    backendFormat.analytics = frontendPortfolio.analytics || {};
    backendFormat.customCode = frontendPortfolio.customCode || {};
    backendFormat.favicon = frontendPortfolio.favicon || "";
    backendFormat.background = frontendPortfolio.background || {};
    backendFormat.fonts = frontendPortfolio.fonts || {};
    backendFormat.statistics = frontendPortfolio.statistics || {};
    if (frontendPortfolio.animations !== undefined) {
      backendFormat.animations = frontendPortfolio.animations || {};
    }
    if (frontendPortfolio.visibility !== undefined) {
      backendFormat.visibility = frontendPortfolio.visibility;
    }

    // Ensure required fields are present
    if (!backendFormat.slug) {
      backendFormat.slug = frontendPortfolio.slug || "my-portfolio";
    }
    if (!backendFormat.layout) {
      backendFormat.layout = frontendPortfolio.layout || "single-page";
    }

    return backendFormat;
  };

  // Normalize portfolio structure from backend format to frontend format
  const normalizePortfolioFromBackend = (backendPortfolio) => {
    const normalized = { ...backendPortfolio };

    // Normalize theme: backend has { colors, fonts, styles } -> frontend needs { colors, typography, spacing }
    if (normalized.theme) {
      const backendTheme = normalized.theme;
      normalized.theme = {
        name: backendTheme.name || "minimal",
        colors: {
          primary: backendTheme.colors?.primary || "#000000",
          secondary: backendTheme.colors?.secondary || "#666666",
          background: backendTheme.colors?.background || "#FFFFFF",
          text: backendTheme.colors?.text || "#000000",
          accent: backendTheme.colors?.accent || "#0066FF",
        },
        typography: {
          fontFamily:
            backendTheme.fonts?.body ||
            backendTheme.fonts?.heading ||
            "Inter, system-ui, sans-serif",
          headingSize: backendTheme.styles?.headingSize || "2.5rem",
          bodySize: backendTheme.styles?.bodySize || "1rem",
        },
        spacing:
          backendTheme.styles?.spacing || backendTheme.spacing || "normal",
        containerWidth: backendTheme.containerWidth || "medium",
      };
      // Normalize using our theme normalizer (preserves containerWidth)
      normalized.theme = normalizeTheme(normalized.theme);
    } else {
      normalized.theme = normalizeTheme(DEFAULT_THEME);
    }

    // Normalize sections: backend has { type, title, content/items, order } -> frontend needs { id, type, enabled, order, title, content }
    if (normalized.sections && Array.isArray(normalized.sections)) {
      normalized.sections = normalized.sections.map((section, index) => {
        const normalizedSection = {
          id: section.id || `${section.type}-${index + 1}`,
          type: section.type,
          enabled: section.enabled !== false, // Default to true
          order: section.order !== undefined ? section.order : index,
          title:
            section.title ||
            section.type.charAt(0).toUpperCase() + section.type.slice(1),
        };

        // Normalize content based on section type
        if (section.items) {
          // Backend uses 'items' array
          normalizedSection.content = { [section.type]: section.items };
        } else if (section.content) {
          // Backend might have 'content' as string or object
          if (typeof section.content === "string") {
            normalizedSection.content = { text: section.content };
          } else {
            normalizedSection.content = section.content;
          }
        } else if (
          section.type === "about" &&
          !section.content &&
          !section.items
        ) {
          normalizedSection.content = { text: "" };
        } else if (
          section.type === "skills" &&
          !section.content &&
          !section.items
        ) {
          normalizedSection.content = { skills: [] };
        } else if (
          section.type === "achievements" &&
          !section.content &&
          !section.items
        ) {
          normalizedSection.content = { achievements: [] };
        } else if (
          section.type === "projects" &&
          !section.content &&
          !section.items
        ) {
          normalizedSection.content = { projects: [] };
        } else if (
          section.type === "education" &&
          !section.content &&
          !section.items
        ) {
          normalizedSection.content = { education: [] };
        } else if (
          section.type === "certificates" &&
          !section.content &&
          !section.items
        ) {
          normalizedSection.content = { certificates: [] };
        }

        return normalizedSection;
      });
    } else {
      normalized.sections = [];
    }

    // Handle certificates array - merge into sections if certificates section doesn't exist
    if (
      normalized.certificates &&
      Array.isArray(normalized.certificates) &&
      normalized.certificates.length > 0
    ) {
      const hasCertificatesSection = normalized.sections.some(
        (s) => s.type === "certificates"
      );
      if (!hasCertificatesSection) {
        normalized.sections.push({
          id: "certificates-1",
          type: "certificates",
          enabled: true,
          order: normalized.sections.length,
          title: "Certificates",
          content: { certificates: normalized.certificates },
        });
      } else {
        // Merge certificates into existing section
        const certSection = normalized.sections.find(
          (s) => s.type === "certificates"
        );
        if (
          certSection &&
          (!certSection.content?.certificates ||
            certSection.content.certificates.length === 0)
        ) {
          certSection.content = { certificates: normalized.certificates };
        }
      }
    }

    // Ensure logo field exists
    if (!normalized.logo) {
      normalized.logo = "";
    }

    // Ensure hero section exists - preserve backend hero data if it exists
    if (!normalized.hero) {
      normalized.hero = {
        title: "",
        subtitle: "",
        image: "",
        ctaText: "",
        ctaLink: null, // Allow null
      };
    } else {
      // Ensure all hero fields are present, preserving backend values
      normalized.hero = {
        title: normalized.hero.title || "",
        subtitle: normalized.hero.subtitle || "",
        image: normalized.hero.image || "",
        ctaText: normalized.hero.ctaText || "",
        ctaLink:
          normalized.hero.ctaLink !== undefined
            ? normalized.hero.ctaLink
            : null, // Preserve null if set
      };
    }

    // Ensure animations object exists
    if (!normalized.animations) {
      normalized.animations = {
        enabled: true,
        type: "fade",
      };
    }

    // Ensure new portfolio features are initialized
    if (!normalized.imageGallery || !Array.isArray(normalized.imageGallery)) {
      normalized.imageGallery = [];
    }
    if (!normalized.seo) {
      normalized.seo = {};
    }
    if (!normalized.socialLinks || !Array.isArray(normalized.socialLinks)) {
      normalized.socialLinks = [];
    }
    if (!normalized.sharing) {
      normalized.sharing = {};
    }
    if (!normalized.analytics) {
      normalized.analytics = {};
    }
    if (!normalized.customCode) {
      normalized.customCode = {};
    }
    if (!normalized.favicon) {
      normalized.favicon = "";
    }
    if (!normalized.background) {
      normalized.background = {};
    }
    if (!normalized.fonts) {
      normalized.fonts = {};
    }
    if (!normalized.statistics) {
      normalized.statistics = {};
    }

    // Map isPublic to visibility
    if (normalized.isPublic !== undefined && !normalized.visibility) {
      normalized.visibility = normalized.isPublic ? "public" : "private";
    } else if (!normalized.visibility) {
      normalized.visibility = "public";
    }

    return normalized;
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await portfolioAPI.getMyPortfolio();

        // Handle nested response structure: { success: true, data: [...] } or { success: true, data: {...} }
        let portfolioData = null;
        if (response && response.data) {
          // Check for nested structure with success flag
          if (response.data.success !== undefined && response.data.data) {
            // Check if data is an array (multiple portfolios) or a single object
            if (Array.isArray(response.data.data)) {
              const portfolios = response.data.data;
              // Use the most recent portfolio (last in array, or sort by updatedAt)
              if (portfolios.length > 0) {
                // Sort by updatedAt (most recent first) or use the last one
                const sorted = [...portfolios].sort((a, b) => {
                  const dateA = new Date(a.updatedAt || a.createdAt || 0);
                  const dateB = new Date(b.updatedAt || b.createdAt || 0);
                  return dateB - dateA;
                });
                portfolioData = sorted[0]; // Use most recently updated portfolio
              }
            } else {
              // Single portfolio object
              portfolioData = response.data.data;
            }
          }
          // Check if response.data itself is a portfolio (has _id or slug)
          else if (response.data._id || response.data.slug) {
            portfolioData = response.data;
          }
          // Check if response.data has a data property (array)
          else if (Array.isArray(response.data.data)) {
            const portfolios = response.data.data;
            if (portfolios.length > 0) {
              const sorted = [...portfolios].sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0);
                const dateB = new Date(b.updatedAt || b.createdAt || 0);
                return dateB - dateA;
              });
              portfolioData = sorted[0];
            }
          }
        }

        if (portfolioData) {
          // Normalize portfolio structure from backend format to frontend format
          const normalizedPortfolio =
            normalizePortfolioFromBackend(portfolioData);
          setPortfolio(normalizedPortfolio);
          setSavedPortfolio(JSON.parse(JSON.stringify(normalizedPortfolio))); // Deep copy for comparison
        } else {
          // No portfolio exists, initialize new one
          const newPortfolio = initializePortfolio();
          setPortfolio(newPortfolio);
          setSavedPortfolio(JSON.parse(JSON.stringify(newPortfolio)));
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        // Portfolio doesn't exist, initialize new one
        const newPortfolio = initializePortfolio();
        setPortfolio(newPortfolio);
        setSavedPortfolio(JSON.parse(JSON.stringify(newPortfolio)));
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Detect unsaved changes
  useEffect(() => {
    if (!portfolio || !savedPortfolio) {
      setHasUnsavedChanges(false);
      return;
    }

    // Compare current portfolio with saved portfolio
    const currentStr = JSON.stringify(portfolio);
    const savedStr = JSON.stringify(savedPortfolio);
    setHasUnsavedChanges(currentStr !== savedStr);
  }, [portfolio, savedPortfolio]);

  const handleSave = async () => {
    if (!portfolio) return;

    try {
      setSaving(true);

      // First, upload logo if a new one is selected
      let logoUrl = portfolio.logo || null;
      if (logoFile) {
        try {
          const logoResponse = await portfolioAPI.uploadLogo(logoFile);
          logoUrl =
            logoResponse.data.logoUrl ||
            logoResponse.data.url ||
            logoResponse.data.logo ||
            logoResponse.data.data?.logoUrl ||
            logoResponse.data.data?.url;

          if (logoUrl) {
            // Update portfolio with new logo URL
            setPortfolio((prev) => ({ ...prev, logo: logoUrl }));
            portfolio.logo = logoUrl;
          }
        } catch (logoError) {
          console.error("Error uploading logo:", logoError);
          alert(
            logoError.response?.data?.message ||
              "Failed to upload logo. Portfolio will be saved without logo update."
          );
          // Continue with save even if logo upload fails
        }
      }

      // Convert frontend format to backend format before saving
      const backendData = convertPortfolioToBackendFormat(portfolio);

      let savedData;
      if (portfolio._id) {
        // Update existing portfolio
        await portfolioAPI.updatePortfolio(portfolio._id, backendData);

        // Reload portfolio from server to get the latest data including imageGallery
        try {
          const reloadResponse = await portfolioAPI.getMyPortfolio();
          let reloadedPortfolio = null;
          if (reloadResponse && reloadResponse.data) {
            if (
              reloadResponse.data.success !== undefined &&
              reloadResponse.data.data
            ) {
              if (Array.isArray(reloadResponse.data.data)) {
                const portfolios = reloadResponse.data.data;
                if (portfolios.length > 0) {
                  const sorted = [...portfolios].sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt || 0);
                    const dateB = new Date(b.updatedAt || b.createdAt || 0);
                    return dateB - dateA;
                  });
                  reloadedPortfolio = sorted[0];
                }
              } else {
                reloadedPortfolio = reloadResponse.data.data;
              }
            } else if (reloadResponse.data._id || reloadResponse.data.slug) {
              reloadedPortfolio = reloadResponse.data;
            }
          }

          if (reloadedPortfolio) {
            const normalizedPortfolio =
              normalizePortfolioFromBackend(reloadedPortfolio);
            setPortfolio(normalizedPortfolio);
            savedData = normalizedPortfolio;
          } else {
            savedData = portfolio;
          }
        } catch (reloadError) {
          console.error(
            "PortfolioConstructor: handleSave - Error reloading portfolio:",
            reloadError
          );
          savedData = portfolio;
        }
      } else {
        // Create new portfolio
        const response = await portfolioAPI.createPortfolio(backendData);
        savedData = { ...portfolio, _id: response.data._id };
        setPortfolio(savedData);
      }

      // Clear logo file after successful save
      setLogoFile(null);

      // Update saved portfolio state to mark as saved
      setSavedPortfolio(JSON.parse(JSON.stringify(savedData)));
      setHasUnsavedChanges(false);
      alert("Portfolio saved successfully!");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Failed to save portfolio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioChange = (updates) => {
    setPortfolio((prev) => {
      const updated = { ...prev, ...updates };
      // Deep merge for nested objects like sections
      if (updates.sections && Array.isArray(updates.sections)) {
        updated.sections = updates.sections;
      }
      if (updates.hero && typeof updates.hero === "object") {
        updated.hero = { ...prev?.hero, ...updates.hero };
      }
      if (updates.theme && typeof updates.theme === "object") {
        updated.theme = { ...prev?.theme, ...updates.theme };
      }
      // Handle imageGallery array - always replace with new array
      if (updates.imageGallery !== undefined) {
        updated.imageGallery = Array.isArray(updates.imageGallery)
          ? updates.imageGallery
          : [];
      }
      // Handle other new fields
      if (updates.seo !== undefined) {
        updated.seo = { ...prev?.seo, ...updates.seo };
      }
      if (updates.socialLinks !== undefined) {
        updated.socialLinks = updates.socialLinks;
      }
      if (updates.sharing !== undefined) {
        updated.sharing = { ...prev?.sharing, ...updates.sharing };
      }
      if (updates.analytics !== undefined) {
        updated.analytics = { ...prev?.analytics, ...updates.analytics };
      }
      if (updates.customCode !== undefined) {
        updated.customCode = { ...prev?.customCode, ...updates.customCode };
      }
      if (updates.background !== undefined) {
        updated.background = { ...prev?.background, ...updates.background };
      }
      if (updates.fonts !== undefined) {
        updated.fonts = { ...prev?.fonts, ...updates.fonts };
      }
      if (updates.statistics !== undefined) {
        updated.statistics = { ...prev?.statistics, ...updates.statistics };
      }
      if (updates.favicon !== undefined) {
        updated.favicon = updates.favicon;
      }
      return updated;
    });
  };

  const handleGenerateFromText = async (generatedPortfolio) => {
    setPortfolio(generatedPortfolio);
    setShowTextGenerator(false);
    setActiveTab("preview");
  };

  if (loading) {
    return (
      <div className="portfolio-constructor-page-container">
        <div className="portfolio-constructor-loading">
          <div className="loading-spinner"></div>
          <p>Loading portfolio editor...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="portfolio-constructor-page-container">
        <div>Error loading portfolio</div>
      </div>
    );
  }

  return (
    <div className="portfolio-constructor-page-container">
      <div className="portfolio-constructor">
        <div className="constructor-header">
          <h1>Portfolio Constructor</h1>
          <div className="constructor-actions">
            <button
              className="button-secondary"
              onClick={() => navigate(`/portfolio/${portfolio.slug}`)}
            >
              View Portfolio
            </button>
            <button
              className="button-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Portfolio"}
            </button>
          </div>
        </div>

        {/* Unsaved changes warning */}
        {hasUnsavedChanges && (
          <div className="unsaved-changes-warning">
            <span>
              ⚠️ You have unsaved changes. Don't forget to save your portfolio!
            </span>
          </div>
        )}

        <div className="constructor-content">
          <div className="constructor-sidebar">
            <div className="constructor-tabs">
              <button
                className={`tab-button ${
                  activeTab === "general" ? "active" : ""
                }`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                className={`tab-button ${
                  activeTab === "layout" ? "active" : ""
                }`}
                onClick={() => setActiveTab("layout")}
              >
                Layout
              </button>
              <button
                className={`tab-button ${
                  activeTab === "theme" ? "active" : ""
                }`}
                onClick={() => setActiveTab("theme")}
              >
                Theme
              </button>
              <button
                className={`tab-button ${
                  activeTab === "sections" ? "active" : ""
                }`}
                onClick={() => setActiveTab("sections")}
              >
                Sections
              </button>
              <button
                className={`tab-button ${
                  activeTab === "preview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </button>
              <button
                className={`tab-button ${activeTab === "seo" ? "active" : ""}`}
                onClick={() => setActiveTab("seo")}
              >
                SEO
              </button>
              <button
                className={`tab-button ${
                  activeTab === "social" ? "active" : ""
                }`}
                onClick={() => setActiveTab("social")}
              >
                Social
              </button>
              <button
                className={`tab-button ${
                  activeTab === "styling" ? "active" : ""
                }`}
                onClick={() => setActiveTab("styling")}
              >
                Styling
              </button>
              <button
                className={`tab-button ${activeTab === "code" ? "active" : ""}`}
                onClick={() => setActiveTab("code")}
              >
                Code
              </button>
              <button
                className={`tab-button ${
                  activeTab === "actions" ? "active" : ""
                }`}
                onClick={() => setActiveTab("actions")}
              >
                Actions
              </button>
              <button
                className={`tab-button ${activeTab === "hero" ? "active" : ""}`}
                onClick={() => setActiveTab("hero")}
              >
                Hero
              </button>
              <button
                className={`tab-button ${
                  activeTab === "background" ? "active" : ""
                }`}
                onClick={() => setActiveTab("background")}
              >
                Background
              </button>
              <button
                className={`tab-button ${
                  activeTab === "gallery" ? "active" : ""
                }`}
                onClick={() => setActiveTab("gallery")}
              >
                Gallery
              </button>
              <button
                className={`tab-button ${
                  activeTab === "fonts" ? "active" : ""
                }`}
                onClick={() => setActiveTab("fonts")}
              >
                Fonts
              </button>
              <button
                className={`tab-button ${
                  activeTab === "favicon" ? "active" : ""
                }`}
                onClick={() => setActiveTab("favicon")}
              >
                Favicon
              </button>
              <button
                className={`tab-button ${
                  activeTab === "sharing" ? "active" : ""
                }`}
                onClick={() => setActiveTab("sharing")}
              >
                Sharing
              </button>
              <button
                className={`tab-button ${
                  activeTab === "stats" ? "active" : ""
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Statistics
              </button>
            </div>

            {showTextGenerator && (
              <div className="text-generator-panel">
                <TextToPortfolioInput
                  onGenerate={handleGenerateFromText}
                  onClose={() => setShowTextGenerator(false)}
                />
              </div>
            )}

            {!showTextGenerator && (
              <button
                className="button-text-generator"
                onClick={() => setShowTextGenerator(true)}
              >
                ✨ Generate from Text
              </button>
            )}
          </div>

          <div className="constructor-main">
            {activeTab === "general" && (
              <div className="tab-content">
                <h2>General Settings</h2>
                <div className="form-group">
                  <ImageUpload
                    label="Portfolio Logo"
                    value={portfolio.logo || ""}
                    onChange={(url) => {
                      handlePortfolioChange({ logo: url });
                      setLogoFile(null);
                    }}
                    recommendedSize="200x50"
                    maxSize={2 * 1024 * 1024}
                  />
                </div>
                <div className="form-group">
                  <label>Portfolio Slug (URL)</label>
                  <input
                    type="text"
                    value={portfolio.slug}
                    onChange={(e) =>
                      handlePortfolioChange({ slug: e.target.value })
                    }
                    placeholder="my-portfolio"
                  />
                  <small>
                    Your portfolio will be available at: /portfolio/
                    {portfolio.slug}
                  </small>
                </div>
                <div className="form-group">
                  <label>Visibility</label>
                  <select
                    value={portfolio.visibility}
                    onChange={(e) =>
                      handlePortfolioChange({ visibility: e.target.value })
                    }
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                  <small>
                    Public: Visible to everyone | Private: Only you can see |
                    Unlisted: Only accessible via direct link
                  </small>
                </div>

                <div className="form-group">
                  <label>Portfolio Status</label>
                  <select
                    value={portfolio.status || "draft"}
                    onChange={(e) =>
                      handlePortfolioChange({ status: e.target.value })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <small>Draft portfolios are not visible to others</small>
                </div>

                <div className="form-group">
                  <label>Portfolio Description</label>
                  <textarea
                    value={portfolio.description || ""}
                    onChange={(e) =>
                      handlePortfolioChange({ description: e.target.value })
                    }
                    placeholder="A brief description of your portfolio"
                    rows={3}
                  />
                  <small>
                    This description appears in search results and portfolio
                    listings
                  </small>
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div className="tab-content">
                <LayoutSelector
                  layout={portfolio.layout}
                  onChange={(layout) => handlePortfolioChange({ layout })}
                />
              </div>
            )}

            {activeTab === "theme" && (
              <div className="tab-content">
                <ThemeCustomizer
                  theme={portfolio.theme}
                  onChange={(theme) =>
                    handlePortfolioChange({ theme: normalizeTheme(theme) })
                  }
                />
              </div>
            )}

            {activeTab === "sections" && (
              <div className="tab-content">
                <SectionManager
                  sections={portfolio.sections}
                  hero={portfolio.hero}
                  onChange={(sections, hero) => {
                    handlePortfolioChange({ sections, hero });
                  }}
                />
              </div>
            )}

            {activeTab === "preview" && (
              <div className="tab-content preview-content">
                <PortfolioPreview portfolio={portfolio} />
              </div>
            )}

            {activeTab === "seo" && (
              <div className="tab-content">
                <SEOSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "social" && (
              <div className="tab-content">
                <SocialLinksSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "styling" && (
              <div className="tab-content">
                <AdvancedStyling
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "code" && (
              <div className="tab-content">
                <CustomCodeSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "actions" && (
              <div className="tab-content">
                <PortfolioActions
                  portfolio={portfolio}
                  onPortfolioChange={handlePortfolioChange}
                  onNavigate={navigate}
                />
              </div>
            )}

            {activeTab === "hero" && (
              <div className="tab-content">
                <HeroImageSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "background" && (
              <div className="tab-content">
                <BackgroundSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="tab-content">
                <ImageGallery
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "fonts" && (
              <div className="tab-content">
                <FontSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "favicon" && (
              <div className="tab-content">
                <FaviconSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "sharing" && (
              <div className="tab-content">
                <SharingSettings
                  portfolio={portfolio}
                  onChange={handlePortfolioChange}
                />
              </div>
            )}

            {activeTab === "stats" && (
              <div className="tab-content">
                <PortfolioStatistics portfolio={portfolio} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioConstructor;
