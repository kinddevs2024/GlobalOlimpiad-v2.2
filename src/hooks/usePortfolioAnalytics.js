import { useEffect } from "react";
import { portfolioAPI } from "../services/portfolioAPI";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook for tracking portfolio views
 * Detects viewer type and sends analytics event to backend
 */
export const usePortfolioAnalytics = (portfolioId, portfolioVisibility) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!portfolioId || portfolioVisibility === "private") {
      return;
    }

    // Determine viewer type
    // Backend only accepts "public" or "university"
    let viewerType = "public";
    
    if (isAuthenticated && user) {
      // Check if viewer is a university
      // You can customize this logic based on how universities are identified in your system
      // For example: if (user.role === "university" || user.type === "university") {
      //   viewerType = "university";
      // }
      
      // For now, default to "public" for all authenticated users
      // unless they are identified as a university
      if (user.role === "university" || user.type === "university" || user.isUniversity) {
        viewerType = "university";
      }
    }

    // Track view event
    const trackView = async () => {
      try {
        await portfolioAPI.trackView(portfolioId, viewerType);
      } catch (error) {
        // Silently fail analytics - don't break the user experience
        console.error("Failed to track portfolio view:", error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(trackView, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [portfolioId, portfolioVisibility, isAuthenticated, user]);
};

