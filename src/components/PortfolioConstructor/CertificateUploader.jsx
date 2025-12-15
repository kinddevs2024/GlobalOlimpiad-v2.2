import { useState } from "react";
import { portfolioAPI } from "../../services/portfolioAPI";

const CertificateUploader = ({ certificates = [], onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an image (JPEG, PNG) or PDF file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await portfolioAPI.uploadCertificate(file, (progress) => {
        setUploadProgress(progress);
      });

      // Add new certificate to list
      const newCertificate = {
        id: response.data.id || Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        image: response.data.url || response.data.imageUrl,
        uploadedAt: new Date().toISOString(),
      };

      onUpdate([...certificates, newCertificate]);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert("Failed to upload certificate. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (certificateId) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    try {
      await portfolioAPI.deleteCertificate(certificateId);
      onUpdate(certificates.filter((cert) => cert.id !== certificateId));
    } catch (error) {
      console.error("Error deleting certificate:", error);
      alert("Failed to delete certificate. Please try again.");
    }
  };

  return (
    <div className="certificate-uploader">
      <h4>Certificates</h4>
      <div className="upload-area">
        <input
          type="file"
          id="certificate-upload"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: "none" }}
        />
        <label htmlFor="certificate-upload" className="upload-button">
          {uploading ? `Uploading... ${uploadProgress}%` : "+ Upload Certificate"}
        </label>
        {uploading && (
          <div className="upload-progress">
            <div
              className="upload-progress-bar"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
      {certificates.length > 0 && (
        <div className="certificates-list">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="certificate-item">
              {certificate.image && (
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="certificate-thumbnail"
                />
              )}
              <div className="certificate-info">
                <span className="certificate-title">{certificate.title}</span>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(certificate.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateUploader;

