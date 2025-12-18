import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { portfolioAPI } from "../services/portfolioAPI";
import { normalizeTheme } from "../utils/portfolioThemes";

const PortfolioEditorContext = createContext(null);

export const usePortfolioEditor = () => {
  const context = useContext(PortfolioEditorContext);
  if (!context) {
    throw new Error("usePortfolioEditor must be used within PortfolioEditorProvider");
  }
  return context;
};

export const PortfolioEditorProvider = ({ children, portfolio: initialPortfolio, isOwner }) => {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const saveTimeoutRef = useRef(null);
  const previousPortfolioRef = useRef(JSON.stringify(initialPortfolio));

  // Convert frontend format to backend format for saving
  const convertPortfolioToBackendFormat = useCallback((frontendPortfolio) => {
    const backendFormat = {
      _id: frontendPortfolio._id,
      studentId: frontendPortfolio.studentId,
      slug: frontendPortfolio.slug || "my-portfolio",
      layout: frontendPortfolio.layout || "single-page",
      isPublic: frontendPortfolio.visibility === "public" || frontendPortfolio.isPublic === true,
    };

    // Convert theme
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
        styles: {
          spacing: frontendPortfolio.theme.spacing || "normal",
          headingSize:
            frontendPortfolio.theme.typography?.headingSize || "2.5rem",
          bodySize: frontendPortfolio.theme.typography?.bodySize || "1rem",
        },
      };
    }

    // Convert sections
    if (frontendPortfolio.sections && Array.isArray(frontendPortfolio.sections)) {
      backendFormat.sections = frontendPortfolio.sections
        .filter((section) => section.enabled !== false)
        .map((section) => {
          const backendSection = {
            type: section.type,
            title:
              section.title ||
              section.type.charAt(0).toUpperCase() + section.type.slice(1),
            order: section.order !== undefined ? section.order : 0,
          };

          if (section.id) {
            backendSection.id = section.id;
          }
          if (section.slug) {
            backendSection.slug = section.slug;
          }

          // Convert content based on section type
          if (section.content) {
            const itemsKey = section.type;
            const pluralKey = itemsKey + "s";

            if (
              section.content[pluralKey] &&
              Array.isArray(section.content[pluralKey])
            ) {
              backendSection.items = section.content[pluralKey];
            } else if (
              section.content[itemsKey] &&
              Array.isArray(section.content[itemsKey])
            ) {
              backendSection.items = section.content[itemsKey];
            } else if (Array.isArray(section.content)) {
              backendSection.items = section.content;
            } else if (section.type === "about" && section.content.text) {
              backendSection.content = section.content.text;
            } else {
              backendSection.content = section.content;
            }
          }

          return backendSection;
        });
    }

    // Add hero
    if (frontendPortfolio.hero) {
      backendFormat.hero = frontendPortfolio.hero;
    }

    // Add logo
    if (frontendPortfolio.logo !== undefined) {
      backendFormat.logo = frontendPortfolio.logo;
    }

    // Add animations
    if (frontendPortfolio.animations) {
      backendFormat.animations = frontendPortfolio.animations;
    }

    return backendFormat;
  }, []);

  // Save portfolio to backend
  const savePortfolio = useCallback(async (portfolioToSave) => {
    if (!portfolioToSave || !portfolioToSave._id) {
      console.error("Cannot save portfolio: missing _id");
      return { success: false, error: "Portfolio ID is missing" };
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const backendFormat = convertPortfolioToBackendFormat(portfolioToSave);
      await portfolioAPI.updatePortfolio(portfolioToSave._id, backendFormat);
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      previousPortfolioRef.current = JSON.stringify(portfolioToSave);
      
      return { success: true };
    } catch (error) {
      console.error("Error saving portfolio:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save portfolio";
      setSaveError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [convertPortfolioToBackendFormat]);

  // Debounced auto-save
  const scheduleAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const currentPortfolio = portfolio;
      if (currentPortfolio && currentPortfolio._id) {
        const currentJson = JSON.stringify(currentPortfolio);
        if (currentJson !== previousPortfolioRef.current) {
          savePortfolio(currentPortfolio);
        }
      }
    }, 500);
  }, [portfolio, savePortfolio]);

  // Update portfolio (optimistic)
  const updatePortfolio = useCallback((updates) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      setHasUnsavedChanges(true);
      scheduleAutoSave();
      return updated;
    });
  }, [scheduleAutoSave]);

  // Update a specific section
  const updateSection = useCallback((sectionId, updates) => {
    setPortfolio((prev) => {
      if (!prev || !prev.sections) return prev;
      
      const updatedSections = prev.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      );
      
      const updated = { ...prev, sections: updatedSections };
      setHasUnsavedChanges(true);
      scheduleAutoSave();
      return updated;
    });
  }, [scheduleAutoSave]);

  // Add a new section
  const addSection = useCallback((type, position = null) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      
      const newSection = {
        id: `${type}-${Date.now()}`,
        type,
        enabled: true,
        order: position !== null ? position : (prev.sections?.length || 0),
        title: type.charAt(0).toUpperCase() + type.slice(1),
        content: getDefaultContentForType(type),
        style: {},
      };

      const updatedSections = prev.sections ? [...prev.sections] : [];
      if (position !== null) {
        updatedSections.splice(position, 0, newSection);
        // Reorder all sections
        updatedSections.forEach((section, index) => {
          section.order = index;
        });
      } else {
        updatedSections.push(newSection);
      }

      const updated = { ...prev, sections: updatedSections };
      setHasUnsavedChanges(true);
      scheduleAutoSave();
      return updated;
    });
  }, [scheduleAutoSave]);

  // Remove a section
  const removeSection = useCallback((sectionId) => {
    setPortfolio((prev) => {
      if (!prev || !prev.sections) return prev;
      
      const updatedSections = prev.sections.filter(
        (section) => section.id !== sectionId
      );
      
      // Reorder remaining sections
      updatedSections.forEach((section, index) => {
        section.order = index;
      });

      const updated = { ...prev, sections: updatedSections };
      setHasUnsavedChanges(true);
      scheduleAutoSave();
      return updated;
    });
  }, [scheduleAutoSave]);

  // Duplicate a section
  const duplicateSection = useCallback((sectionId) => {
    setPortfolio((prev) => {
      if (!prev || !prev.sections) return prev;
      
      const sectionToDuplicate = prev.sections.find(
        (section) => section.id === sectionId
      );
      
      if (!sectionToDuplicate) return prev;

      const duplicatedSection = {
        ...sectionToDuplicate,
        id: `${sectionToDuplicate.type}-${Date.now()}`,
        order: sectionToDuplicate.order + 1,
      };

      // Update order of sections after the duplicated one
      const updatedSections = prev.sections.map((section) => {
        if (section.order > sectionToDuplicate.order) {
          return { ...section, order: section.order + 1 };
        }
        return section;
      });

      // Insert duplicated section
      const insertIndex = updatedSections.findIndex(
        (section) => section.id === sectionId
      ) + 1;
      updatedSections.splice(insertIndex, 0, duplicatedSection);

      const updated = { ...prev, sections: updatedSections };
      setHasUnsavedChanges(true);
      scheduleAutoSave();
      return updated;
    });
  }, [scheduleAutoSave]);

  // Reorder sections
  const reorderSections = useCallback((newOrder) => {
    setPortfolio((prev) => {
      if (!prev || !prev.sections) return prev;
      
      const updatedSections = newOrder.map((sectionId, newIndex) => {
        const section = prev.sections.find((s) => s.id === sectionId);
        return section ? { ...section, order: newIndex } : null;
      }).filter(Boolean);

      const updated = { ...prev, sections: updatedSections };
      setHasUnsavedChanges(true);
      scheduleAutoSave();
      return updated;
    });
  }, [scheduleAutoSave]);

  // Get default content for section type
  const getDefaultContentForType = (type) => {
    switch (type) {
      case "about":
        return { text: "" };
      case "skills":
        return { skills: [] };
      case "achievements":
        return { achievements: [] };
      case "projects":
        return { projects: [] };
      case "certificates":
        return { certificates: [] };
      case "education":
        return { education: [] };
      case "interests":
        return { interests: [] };
      case "custom":
        return { text: "" };
      default:
        return {};
    }
  };

  // Update portfolio when initial portfolio changes
  useEffect(() => {
    if (initialPortfolio) {
      setPortfolio(initialPortfolio);
      previousPortfolioRef.current = JSON.stringify(initialPortfolio);
    }
  }, [initialPortfolio]);

  const value = {
    portfolio,
    updatePortfolio,
    updateSection,
    addSection,
    removeSection,
    duplicateSection,
    reorderSections,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveError,
    savePortfolio, // Manual save function
  };

  return (
    <PortfolioEditorContext.Provider value={value}>
      {children}
    </PortfolioEditorContext.Provider>
  );
};

