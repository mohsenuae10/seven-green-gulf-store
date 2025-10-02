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

  // Supabase Storage doesn't support URL transformation parameters by default
  // Use the original URL directly for better compatibility
  const imageUrl = src;

  return (
    <div className="relative">
      <img
        src={imageUrl}
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
        style={{
          maxWidth: '100%',
          height: fill ? '100%' : 'auto'
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !imageError && (
        <div className={`absolute inset-0 ${className} bg-muted animate-pulse pointer-events-none`} />
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div className={`absolute inset-0 ${className} bg-muted flex items-center justify-center text-muted-foreground`}>
          <span className="text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;