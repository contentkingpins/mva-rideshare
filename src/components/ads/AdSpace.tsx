import React, { useEffect } from 'react';
import { events as standardEvents } from '@/utils/metaPixel';

interface AdSpaceProps {
  platform: 'meta' | 'google' | 'tiktok';
  adId: string;
  size: 'banner' | 'sidebar' | 'in-content' | 'mobile';
  position?: string;
  className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({
  platform,
  adId,
  size,
  position = 'default',
  className = '',
}) => {
  useEffect(() => {
    // Track ad impression
    const trackImpression = () => {
      switch (platform) {
        case 'meta':
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', standardEvents.VIEW_CONTENT, {
              content_name: `ad_${adId}`,
              content_type: 'advertisement',
              content_category: 'ad_impression',
              content_ids: [adId],
              ad_position: position
            });
          }
          break;
        case 'google':
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ad_impression', {
              'ad_id': adId,
              'ad_type': size,
              'ad_position': position
            });
          }
          break;
        case 'tiktok':
          if (typeof window !== 'undefined' && (window as any).ttq) {
            (window as any).ttq.track('ViewContent', {
              content_name: `ad_${adId}`,
              content_type: 'advertisement',
              content_category: 'ad_impression',
              ad_position: position
            });
          }
          break;
      }
    };

    // Track when ad is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackImpression();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const adElement = document.getElementById(`ad-${adId}`);
    if (adElement) {
      observer.observe(adElement);
    }

    return () => {
      if (adElement) {
        observer.unobserve(adElement);
      }
    };
  }, [platform, adId, size, position]);

  const getAdContainerClass = () => {
    const baseClass = 'ad-container';
    const sizeClass = `ad-${size}`;
    const positionClass = `ad-${position}`;
    return `${baseClass} ${sizeClass} ${positionClass} ${className}`;
  };

  return (
    <div
      id={`ad-${adId}`}
      className={getAdContainerClass()}
      data-ad-platform={platform}
      data-ad-id={adId}
      data-ad-size={size}
      data-ad-position={position}
    >
      {/* Ad content will be injected here by the respective ad platforms */}
      <div className="ad-placeholder">
        <span className="ad-label">Advertisement</span>
      </div>
    </div>
  );
};

export default AdSpace; 