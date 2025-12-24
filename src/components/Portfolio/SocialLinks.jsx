import './SocialLinks.css';

/**
 * Social Links Component
 * Displays social media and external links
 */
const SocialLinks = ({ socialLinks = [] }) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  const getIcon = (platform) => {
    const icons = {
      github: '🔗',
      linkedin: '🔗',
      twitter: '🔗',
      facebook: '🔗',
      instagram: '🔗',
      youtube: '🔗',
      website: '🌐',
      email: '📧',
      custom: '🔗',
    };
    return icons[platform?.toLowerCase()] || icons.custom;
  };

  return (
    <div className="portfolio-social-links">
      {socialLinks.map((link, index) => {
        if (!link.url || !link.platform) return null;
        
        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-social-link"
            aria-label={link.label || link.platform}
          >
            <span className="social-link-icon">{getIcon(link.platform)}</span>
            {link.label && <span className="social-link-label">{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;

