import { useVerification as useVerificationContext } from "../context/VerificationContext";

/**
 * Custom hook for verification functionality
 * This is a convenience wrapper around the context hook
 */
export const useVerification = () => {
  return useVerificationContext();
};

