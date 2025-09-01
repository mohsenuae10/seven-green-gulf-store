import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemoval';
import { Download, Loader2 } from 'lucide-react';

interface BackgroundRemovalDemoProps {
  imageUrl: string;
  onProcessed?: (processedImageUrl: string) => void;
}

const BackgroundRemovalDemo = ({ imageUrl, onProcessed }: BackgroundRemovalDemoProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Load the image
      const imageElement = await loadImageFromUrl(imageUrl);
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for the processed image
      const url = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(url);
      
      // Call the callback if provided
      onProcessed?.(url);
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError('فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = 'seven-green-no-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-white font-semibold mb-2">إزالة خلفية الصورة</h3>
          <p className="text-white/70 text-sm mb-4">
            استخدم الذكاء الاصطناعي لإزالة خلفية الصورة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Image */}
          <div className="space-y-2">
            <h4 className="text-white text-sm font-medium">الصورة الأصلية</h4>
            <img 
              src={imageUrl} 
              alt="الصورة الأصلية" 
              className="w-full h-48 object-cover rounded-lg border border-white/20"
            />
          </div>

          {/* Processed Image */}
          <div className="space-y-2">
            <h4 className="text-white text-sm font-medium">بعد إزالة الخلفية</h4>
            {processedImageUrl ? (
              <div className="relative">
                <img 
                  src={processedImageUrl} 
                  alt="بعد إزالة الخلفية" 
                  className="w-full h-48 object-cover rounded-lg border border-white/20 bg-gradient-to-br from-white/5 to-white/10"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={downloadProcessedImage}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-48 bg-white/5 rounded-lg border border-white/20 flex items-center justify-center">
                <span className="text-white/50 text-sm">ستظهر الصورة المعالجة هنا</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              'إزالة الخلفية'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundRemovalDemo;