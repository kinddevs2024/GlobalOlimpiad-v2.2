import { useEffect, useRef } from "react";

/**
 * Custom hook for debounced auto-save
 * @param {Function} saveFunction - Function to call when saving
 * @param {any} data - Data to save
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @param {boolean} enabled - Whether auto-save is enabled
 */
export const useAutoSave = (saveFunction, data, delay = 500, enabled = true) => {
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(null);

  useEffect(() => {
    if (!enabled || !saveFunction || !data) {
      return;
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === previousDataRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      previousDataRef.current = currentDataString;
      saveFunction(data);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay, enabled]);
};

