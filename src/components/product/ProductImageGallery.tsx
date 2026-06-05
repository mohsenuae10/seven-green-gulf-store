import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
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

const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);

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
  const currentIsVideo = isVideo(currentImage.image_url);

  const getAltText = (image: ProductImage, index: number) => {
    if (image.alt_text) return image.alt_text;
    return `${productName} - ${index + 1}`;
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex(p => p === 0 ? images.length - 1 : p - 1);
  };
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex(p => p === images.length - 1 ? 0 : p + 1);
  };

  return (
    <div className="space-y-4">
      {/* Main media */}
      <div
        className="relative aspect-square bg-white rounded-xl overflow-hidden group border border-border/50 cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        {currentIsVideo ? (
          <video
            key={currentImage.image_url}
            autoPlay muted loop playsInline
            className="w-full h-full object-contain"
          >
            <source src={currentImage.image_url} />
          </video>
        ) : (
          <OptimizedImage
            src={currentImage.image_url}
            alt={getAltText(currentImage, selectedIndex)}
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
          />
        )}

        {!currentIsVideo && (
          <Button variant="secondary" size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => { e.stopPropagation(); setIsLightboxOpen(true); }}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        )}

        {images.length > 1 && (
          <>
            <Button variant="secondary" size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => {
            const isVid = isVideo(image.image_url);
            return (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex ? 'border-primary shadow-md' : 'border-border/50 hover:border-primary/50'
                }`}
              >
                {isVid ? (
                  <>
                    <video src={image.image_url} muted className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </>
                ) : (
                  <OptimizedImage
                    src={image.image_url}
                    alt={getAltText(image, index)}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <div className="relative">
            {currentIsVideo ? (
              <video autoPlay controls loop playsInline className="w-full h-auto max-h-[80vh]">
                <source src={currentImage.image_url} />
              </video>
            ) : (
              <OptimizedImage
                src={currentImage.image_url}
                alt={getAltText(currentImage, selectedIndex)}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            {images.length > 1 && (
              <>
                <Button variant="secondary" size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={handleNext}>
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
