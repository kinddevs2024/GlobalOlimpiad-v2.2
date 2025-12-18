import { usePortfolioEditor as usePortfolioEditorContext } from "../context/PortfolioEditorContext";

/**
 * Custom hook for portfolio editor functionality
 * This is a convenience wrapper around the context hook
 */
export const usePortfolioEditor = () => {
  return usePortfolioEditorContext();
};

