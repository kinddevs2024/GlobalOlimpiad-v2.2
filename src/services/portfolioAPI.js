import api from "./api";

// Portfolio endpoints
export const portfolioAPI = {
  // Get portfolio by slug (public access)
  getPortfolioBySlug: (slug) => api.get(`/portfolio/${slug}`),

  // Get current user's portfolio (authenticated)
  getMyPortfolio: () => api.get("/portfolio/my"),

  // Create new portfolio (authenticated, student only)
  createPortfolio: (data) => api.post("/portfolio", data),

  // Update portfolio (authenticated, owner only)
  updatePortfolio: (id, data) => api.put(`/portfolio/${id}`, data),

  // Delete portfolio (authenticated, owner only)
  deletePortfolio: (id) => api.delete(`/portfolio/${id}`),

  // Generate portfolio from text description
  generateFromText: (text) =>
    api.post("/portfolio/generate-from-text", { text }),

  // Duplicate portfolio template
  duplicatePortfolio: (id) => api.post(`/portfolio/${id}/duplicate`),

  // Upload certificate file
  uploadCertificate: (file, onUploadProgress) => {
    const formData = new FormData();
    // Try "file" first as it's the most common field name
    formData.append("file", file);
    // Also append as "certificate" for compatibility
    formData.append("certificate", file);
    return api.post("/upload/certificates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
  },

  // Delete certificate
  deleteCertificate: (id) => api.delete(`/upload/certificates/${id}`),

  // Upload portfolio logo
  uploadLogo: (logoFile, onUploadProgress) => {
    const formData = new FormData();
    // Try "file" first as it's the most common field name
    formData.append("file", logoFile);
    // Also append as "logo" for compatibility
    formData.append("logo", logoFile);
    return api.post("/upload/portfolio-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
  },

  // Track portfolio view (analytics)
  trackView: (portfolioId, viewerType) =>
    api.post("/analytics/view", { portfolioId, viewerType }),

  // Verification endpoints
  // Submit item for verification
  submitItemForVerification: (portfolioId, sectionId, itemId, itemType) =>
    api.post(`/portfolio/${portfolioId}/verify/item`, {
      sectionId,
      itemId,
      itemType,
    }),

  // Submit section for verification
  submitSectionForVerification: (portfolioId, sectionId) =>
    api.post(`/portfolio/${portfolioId}/verify/section`, { sectionId }),

  // Get verification status
  getVerificationStatus: (portfolioId) =>
    api.get(`/portfolio/${portfolioId}/verification`),
};

