import { useEffect } from 'react';

/**
 * PortfolioHead Component
 * Handles SEO meta tags, favicon, custom code, and analytics
 */
const PortfolioHead = ({ portfolio }) => {
  const seo = portfolio?.seo || {};
  const favicon = portfolio?.favicon || '';
  const customCode = portfolio?.customCode || {};
  const analytics = portfolio?.analytics || {};
  const background = portfolio?.background || {};
  const fonts = portfolio?.fonts || {};

  // Inject custom CSS
  useEffect(() => {
    if (customCode?.css) {
      const styleId = 'portfolio-custom-css';
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = customCode.css;
      
      return () => {
        // Cleanup on unmount
        const element = document.getElementById(styleId);
        if (element) {
          element.remove();
        }
      };
    }
  }, [customCode?.css]);

  // Inject custom JavaScript
  useEffect(() => {
    if (customCode?.javascript) {
      const scriptId = 'portfolio-custom-js';
      let scriptElement = document.getElementById(scriptId);
      
      if (scriptElement) {
        scriptElement.remove();
      }
      
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.textContent = customCode.javascript;
      document.body.appendChild(scriptElement);
      
      return () => {
        const element = document.getElementById(scriptId);
        if (element) {
          element.remove();
        }
      };
    }
  }, [customCode?.javascript]);

  // Inject Google Analytics
  useEffect(() => {
    if (analytics?.googleAnalyticsId && analytics?.enableViewTracking !== false) {
      // Google Analytics 4
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${analytics.googleAnalyticsId}');
      `;
      document.head.appendChild(script2);

      return () => {
        // Cleanup
        const scripts = document.querySelectorAll(`script[src*="${analytics.googleAnalyticsId}"]`);
        scripts.forEach(script => script.remove());
        const inlineScripts = document.querySelectorAll('script');
        inlineScripts.forEach(script => {
          if (script.textContent?.includes('gtag')) {
            script.remove();
          }
        });
      };
    }
  }, [analytics?.googleAnalyticsId, analytics?.enableViewTracking]);

  // Inject Google Tag Manager
  useEffect(() => {
    if (analytics?.googleTagManagerId) {
      // GTM script
      const script1 = document.createElement('script');
      script1.textContent = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${analytics.googleTagManagerId}');
      `;
      document.head.insertBefore(script1, document.head.firstChild);

      // GTM noscript
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${analytics.googleTagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);

      return () => {
        // Cleanup
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.textContent?.includes('googletagmanager.com/gtm.js')) {
            script.remove();
          }
        });
        const noscripts = document.querySelectorAll('noscript');
        noscripts.forEach(noscript => {
          if (noscript.innerHTML?.includes('googletagmanager.com')) {
            noscript.remove();
          }
        });
      };
    }
  }, [analytics?.googleTagManagerId]);

  // Inject custom tracking code
  useEffect(() => {
    if (analytics?.customTrackingCode) {
      const scriptId = 'portfolio-custom-tracking';
      let scriptElement = document.getElementById(scriptId);
      
      if (scriptElement) {
        scriptElement.remove();
      }
      
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.textContent = analytics.customTrackingCode;
      document.head.appendChild(scriptElement);
      
      return () => {
        const element = document.getElementById(scriptId);
        if (element) {
          element.remove();
        }
      };
    }
  }, [analytics?.customTrackingCode]);

  // Helper to get full image URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('/')) {
      // Get API base URL - use Vite env variable if available, otherwise use current origin
      let apiBaseUrl = window.location.origin;
      try {
        // Try Vite environment variable first
        if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
          apiBaseUrl = import.meta.env.VITE_API_URL;
        }
      } catch (e) {
        // If import.meta is not available, use window.location.origin (already set)
      }
      return `${apiBaseUrl}${url}`;
    }
    return url;
  };

  // Apply background settings
  useEffect(() => {
    const portfolioContainer = document.querySelector('.portfolio-container');
    if (!portfolioContainer || !background.type) return;

    if (background.type === 'image' && background.image) {
      const imageUrl = getImageUrl(background.image);
      portfolioContainer.style.backgroundImage = `url(${imageUrl})`;
      portfolioContainer.style.backgroundSize = background.imageSize || 'cover';
      portfolioContainer.style.backgroundPosition = background.imagePosition || 'center';
      portfolioContainer.style.backgroundRepeat = background.imageRepeat || 'no-repeat';
    } else if (background.type === 'gradient' && background.gradient) {
      const gradient = background.gradient;
      if (gradient.type === 'linear' && gradient.colors && gradient.colors.length >= 2) {
        const direction = gradient.direction || 'to bottom';
        const colors = gradient.colors.join(', ');
        portfolioContainer.style.background = `linear-gradient(${direction}, ${colors})`;
      } else if (gradient.type === 'radial' && gradient.colors && gradient.colors.length >= 2) {
        const colors = gradient.colors.join(', ');
        portfolioContainer.style.background = `radial-gradient(circle, ${colors})`;
      }
    } else if (background.type === 'color' && background.color) {
      portfolioContainer.style.backgroundColor = background.color;
    }

    return () => {
      if (portfolioContainer) {
        portfolioContainer.style.backgroundImage = '';
        portfolioContainer.style.background = '';
        portfolioContainer.style.backgroundColor = '';
      }
    };
  }, [background]);

  // Apply font settings
  useEffect(() => {
    const portfolioContainer = document.querySelector('.portfolio-container');
    if (!portfolioContainer) return;

    // Load Google Fonts if specified
    if (fonts.googleFonts && fonts.googleFonts.length > 0) {
      const fontFamilies = fonts.googleFonts.map(font => font.replace(/\s+/g, '+')).join('|');
      const linkId = 'portfolio-google-fonts';
      
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
    }

    // Apply font family
    if (fonts.headingFont) {
      portfolioContainer.style.setProperty('--portfolio-heading-font', fonts.headingFont);
    }
    if (fonts.bodyFont) {
      portfolioContainer.style.setProperty('--portfolio-body-font', fonts.bodyFont);
    }

    // Apply font weights
    if (fonts.headingWeight) {
      portfolioContainer.style.setProperty('--portfolio-heading-weight', fonts.headingWeight);
    }
    if (fonts.bodyWeight) {
      portfolioContainer.style.setProperty('--portfolio-body-weight', fonts.bodyWeight);
    }

    // Apply letter spacing
    if (fonts.letterSpacing) {
      portfolioContainer.style.setProperty('--portfolio-letter-spacing', fonts.letterSpacing);
    }

    // Apply line height
    if (fonts.lineHeight) {
      portfolioContainer.style.setProperty('--portfolio-line-height', fonts.lineHeight);
    }

    return () => {
      // Cleanup is handled by React
    };
  }, [fonts]);

  // Get portfolio title
  const portfolioTitle = seo.ogTitle || portfolio?.hero?.title || portfolio?.slug || 'Portfolio';
  const metaDescription = seo.metaDescription || seo.ogDescription || portfolio?.hero?.subtitle || '';
  const ogImage = seo.ogImage || portfolio?.hero?.image || '';
  const metaKeywords = seo.metaKeywords || '';

  // Update document title and meta tags
  useEffect(() => {
    // Update title
    document.title = portfolioTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Meta description
    updateMetaTag('description', metaDescription);
    
    // Meta keywords
    updateMetaTag('keywords', metaKeywords);
    
    // Open Graph
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:title', portfolioTitle, true);
    updateMetaTag('og:description', metaDescription, true);
    updateMetaTag('og:image', ogImage, true);
    if (portfolio?.slug) {
      updateMetaTag('og:url', window.location.href, true);
    }
    
    // Twitter Card
    updateMetaTag('twitter:card', seo.twitterCard || 'summary');
    updateMetaTag('twitter:title', portfolioTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', ogImage);
    
    // Favicon
    if (favicon) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        document.head.appendChild(link);
      }
      link.setAttribute('href', favicon);
    }
  }, [portfolioTitle, metaDescription, ogImage, metaKeywords, seo.twitterCard, favicon, portfolio?.slug]);

  // This component doesn't render anything visible
  return null;
};

export default PortfolioHead;

