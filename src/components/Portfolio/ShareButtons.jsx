import { useState } from 'react';
import './ShareButtons.css';

/**
 * Download QR Code as PNG
 */
const downloadQRCode = async (portfolioUrl, portfolioSlug) => {
  try {
    // Use higher resolution for better quality
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(portfolioUrl)}`;
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-qr-code-${portfolioSlug || 'portfolio'}.png`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    alert('Failed to download QR code. Please try again.');
  }
};

/**
 * Share Buttons Component
 * Displays social media share buttons
 */
const ShareButtons = ({ portfolio, sharing = {} }) => {
  const [copied, setCopied] = useState(false);

  if (sharing.showShareButtons === false) {
    return null;
  }

  const portfolioUrl = window.location.href;
  const portfolioSlug = portfolio?.slug || 'portfolio';
  const portfolioTitle = portfolio?.hero?.title || portfolio?.slug || 'Portfolio';
  const portfolioDescription = portfolio?.seo?.ogDescription || portfolio?.hero?.subtitle || '';
  const shareMessage = sharing.customShareMessage || `${portfolioTitle} - ${portfolioDescription}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(portfolioUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + portfolioUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent(shareMessage)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="portfolio-share-buttons">
      <h4 className="share-buttons-title">Share this portfolio</h4>
      <div className="share-buttons-grid">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button share-button-twitter"
          aria-label="Share on Twitter"
        >
          <span className="share-icon">🐦</span>
          <span className="share-label">Twitter</span>
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button share-button-facebook"
          aria-label="Share on Facebook"
        >
          <span className="share-icon">📘</span>
          <span className="share-label">Facebook</span>
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button share-button-linkedin"
          aria-label="Share on LinkedIn"
        >
          <span className="share-icon">💼</span>
          <span className="share-label">LinkedIn</span>
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button share-button-whatsapp"
          aria-label="Share on WhatsApp"
        >
          <span className="share-icon">💬</span>
          <span className="share-label">WhatsApp</span>
        </a>
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button share-button-telegram"
          aria-label="Share on Telegram"
        >
          <span className="share-icon">✈️</span>
          <span className="share-label">Telegram</span>
        </a>
        <button
          onClick={handleCopyLink}
          className="share-button share-button-copy"
          aria-label="Copy link"
        >
          <span className="share-icon">{copied ? '✓' : '🔗'}</span>
          <span className="share-label">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
        {portfolio?.sharing?.enableQRCode !== false && (
          <button
            onClick={() => downloadQRCode(portfolioUrl, portfolioSlug)}
            className="share-button share-button-qr"
            aria-label="Download QR code"
          >
            <span className="share-icon">📱</span>
            <span className="share-label">QR Code</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;

