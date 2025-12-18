import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { portfolioAPI } from "../services/portfolioAPI";
import {
  calculateSectionStatus,
  calculatePortfolioStatus,
  getSectionItems,
} from "../utils/verificationHelpers";

const VerificationContext = createContext(null);

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within VerificationProvider");
  }
  return context;
};

export const VerificationProvider = ({ children, portfolio }) => {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate verification statuses from portfolio data
  const calculateVerificationStatuses = useCallback((portfolioData) => {
    if (!portfolioData || !portfolioData.sections) {
      return {
        portfolio: {
          status: "unverified",
          verifiedSections: 0,
          totalSections: 0,
          verifiedItems: 0,
          totalItems: 0,
        },
        sections: {},
      };
    }

    const sections = portfolioData.sections;
    const sectionStatuses = {};

    // Calculate section statuses
    sections.forEach((section) => {
      const items = getSectionItems(section);
      sectionStatuses[section.id] = calculateSectionStatus(items);
    });

    // Calculate portfolio status
    const portfolioStatus = calculatePortfolioStatus(sections);

    return {
      portfolio: portfolioStatus,
      sections: sectionStatuses,
    };
  }, []);

  // Fetch verification status from backend
  const fetchVerificationStatus = useCallback(async (portfolioId) => {
    if (!portfolioId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await portfolioAPI.getVerificationStatus(portfolioId);
      setVerificationData(response.data);
    } catch (err) {
      console.error("Error fetching verification status:", err);
      // Don't set error for 404 - verification might not exist yet
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to fetch verification status");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit item for verification
  const submitItemForVerification = useCallback(
    async (sectionId, itemId, itemType) => {
      if (!portfolio?._id) {
        throw new Error("Portfolio ID is required");
      }

      setLoading(true);
      setError(null);

      try {
        await portfolioAPI.submitItemForVerification(
          portfolio._id,
          sectionId,
          itemId,
          itemType
        );

        // Refresh verification status
        await fetchVerificationStatus(portfolio._id);

        return { success: true };
      } catch (err) {
        console.error("Error submitting item for verification:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to submit for verification";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [portfolio, fetchVerificationStatus]
  );

  // Submit section for verification
  const submitSectionForVerification = useCallback(
    async (sectionId) => {
      if (!portfolio?._id) {
        throw new Error("Portfolio ID is required");
      }

      setLoading(true);
      setError(null);

      try {
        await portfolioAPI.submitSectionForVerification(portfolio._id, sectionId);

        // Refresh verification status
        await fetchVerificationStatus(portfolio._id);

        return { success: true };
      } catch (err) {
        console.error("Error submitting section for verification:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to submit section for verification";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [portfolio, fetchVerificationStatus]
  );

  // Calculate statuses from portfolio data (client-side calculation)
  const calculatedStatuses = portfolio
    ? calculateVerificationStatuses(portfolio)
    : {
        portfolio: {
          status: "unverified",
          verifiedSections: 0,
          totalSections: 0,
          verifiedItems: 0,
          totalItems: 0,
        },
        sections: {},
      };

  // Merge backend verification data with calculated statuses
  // Backend data takes precedence for item-level verification, but we calculate section/portfolio from items
  const mergedStatuses = verificationData
    ? {
        portfolio: calculatedStatuses?.portfolio || {
          status: "unverified",
          verifiedSections: 0,
          totalSections: 0,
          verifiedItems: 0,
          totalItems: 0,
        },
        sections: calculatedStatuses?.sections || {},
        // Include backend item-level verification data if available
        items: verificationData.items || {},
      }
    : calculatedStatuses;

  // Fetch verification status when portfolio changes
  useEffect(() => {
    if (portfolio?._id) {
      fetchVerificationStatus(portfolio._id);
    }
  }, [portfolio?._id, fetchVerificationStatus]);

  const value = {
    verificationStatuses: mergedStatuses,
    loading,
    error,
    submitItemForVerification,
    submitSectionForVerification,
    refreshVerificationStatus: () => portfolio?._id && fetchVerificationStatus(portfolio._id),
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
};

