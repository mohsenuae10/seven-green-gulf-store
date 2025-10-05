import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
}

/**
 * OptimizedImage component with WebP support and lazy loading
 * Automatically serves WebP format when supported by the browser
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  width,
  height,
  fill = false
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate WebP version path
  const getWebPPath = (originalSrc: string) => {
    const ext = originalSrc.split('.').pop()?.toLowerCase();
    if (ext === 'webp') return originalSrc;
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const webpSrc = getWebPPath(src);

  return (
    <div className="relative">
      <picture>
        {/* WebP source for modern browsers */}
        <source srcSet={webpSrc} type="image/webp" />
        
        {/* Fallback to original format */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
          sizes={sizes}
          style={{
            maxWidth: '100%',
            height: fill ? '100%' : 'auto',
            objectFit: fill ? 'cover' : undefined
          }}
        />
      </picture>
      
      {/* Loading skeleton */}
      {!isLoaded && !imageError && (
        <div className={`absolute inset-0 ${className} bg-muted animate-pulse pointer-events-none`} />
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div className={`absolute inset-0 ${className} bg-muted flex items-center justify-center text-muted-foreground`}>
          <span className="text-sm">{alt || 'Image unavailable'}</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;