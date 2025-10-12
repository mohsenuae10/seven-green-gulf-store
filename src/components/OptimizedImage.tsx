import { useEffect, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
}

/**
 * OptimizedImage component
 * - Lazy loading, async decoding
 * - Optional WebP: only used when a valid WebP actually exists (pre-checked)
 */
const OptimizedImage = ({ 
  src, 
  alt,
  title,
  className = "", 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  width,
  height,
  fill = false
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);

  // Check if a corresponding .webp actually exists; otherwise, don't force it
  useEffect(() => {
    setWebpUrl(null);
    const ext = src.split('.').pop()?.toLowerCase();
    if (!ext || !/(jpg|jpeg|png|webp)$/.test(ext)) return;

    // If already webp, no need to probe
    if (ext === 'webp') return;

    const candidate = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    let cancelled = false;
    const testImg = new Image();
    testImg.onload = () => {
      if (!cancelled) setWebpUrl(candidate);
    };
    testImg.onerror = () => {
      if (!cancelled) setWebpUrl(null);
    };
    testImg.src = candidate;

    return () => {
      cancelled = true;
    };
  }, [src]);

  const ImgTag = (
    <img
      src={src}
      alt={alt}
      title={title}
      draggable={false}
      className={`${className} transition-opacity duration-200 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
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
  );

  return (
    <div className="relative">
      {webpUrl ? (
        <picture>
          <source srcSet={webpUrl} type="image/webp" />
          {ImgTag}
        </picture>
      ) : (
        ImgTag
      )}

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