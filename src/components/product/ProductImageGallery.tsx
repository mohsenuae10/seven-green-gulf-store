import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">لا توجد صور متاحة</p>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-white rounded-lg overflow-hidden group border border-border/50 cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        <OptimizedImage
          src={currentImage.image_url}
          alt={currentImage.alt_text || `${productName} - صابونة طبيعية لعلاج تساقط الشعر`}
          title={currentImage.alt_text || `${productName} - صورة المنتج الرئيسية`}
          className="w-full h-full object-contain transition-transform group-hover:scale-105"
        />
        
        {/* Zoom Icon */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsLightboxOpen(true)}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-primary shadow-md'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <OptimizedImage
                src={image.image_url}
                alt={image.alt_text || `${productName} - منظر ${index + 1}`}
                title={image.alt_text || `${productName} - صورة ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative bg-black">
            <OptimizedImage
              src={currentImage.image_url}
              alt={currentImage.alt_text || `${productName} - عرض مكبر`}
              title={currentImage.alt_text || `${productName} - صورة بالحجم الكامل`}
              className="w-full h-auto"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
