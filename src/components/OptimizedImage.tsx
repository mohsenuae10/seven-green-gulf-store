import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  width,
  height
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate responsive image URLs for different sizes
  const generateResponsiveUrls = (originalSrc: string) => {
    // For Supabase storage URLs, we can add transformation parameters
    if (originalSrc.includes('supabase.co/storage')) {
      const baseUrl = originalSrc.split('?')[0];
      return {
        '640w': `${baseUrl}?width=640&quality=80&format=webp`,
        '768w': `${baseUrl}?width=768&quality=80&format=webp`,
        '1024w': `${baseUrl}?width=1024&quality=80&format=webp`,
        '1280w': `${baseUrl}?width=1280&quality=80&format=webp`,
        fallback: originalSrc
      };
    }
    
    // For other URLs, return as-is (could be enhanced with external image optimization service)
    return {
      fallback: originalSrc
    };
  };

  const urls = generateResponsiveUrls(src);
  
  // Create srcSet string for responsive images
  const createSrcSet = () => {
    const entries = Object.entries(urls).filter(([key]) => key !== 'fallback');
    if (entries.length === 0) return undefined;
    
    return entries.map(([size, url]) => `${url} ${size}`).join(', ');
  };

  const srcSet = createSrcSet();

  return (
    <picture>
      {/* WebP source with responsive sizes */}
      {srcSet && (
        <source
          srcSet={srcSet}
          sizes={sizes}
          type="image/webp"
        />
      )}
      
      {/* Fallback image */}
      <img
        src={urls.fallback}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={width}
        height={height}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !imageError && (
        <div className={`${className} bg-muted animate-pulse`} />
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div className={`${className} bg-muted flex items-center justify-center text-muted-foreground`}>
          <span className="text-sm">Image unavailable</span>
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;