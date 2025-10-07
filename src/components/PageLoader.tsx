import { useEffect, useState } from 'react';
import sevenGreenLogo from '@/assets/seven-green-logo.png';

interface PageLoaderProps {
  onLoadComplete: () => void;
  minDisplayTime?: number;
  maxWaitTime?: number;
}

const PageLoader = ({ onLoadComplete, minDisplayTime = 800, maxWaitTime = 3000 }: PageLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    // Maximum wait timeout
    const maxTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        onLoadComplete();
      }, 300);
    }, maxWaitTime);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxTimeout);
    };
  }, [maxWaitTime, onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-primary/5 to-secondary/5 animate-fade-in">
      <div className="text-center space-y-6">
        {/* Logo with rotation animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
          <img 
            src={sevenGreenLogo} 
            alt="Seven Green" 
            className="w-32 h-32 object-contain mx-auto relative z-10 animate-[spin_3s_linear_infinite]"
          />
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary animate-pulse">
            سفن جرين
          </h2>
          <p className="text-sm text-muted-foreground">
            جاري التحميل...
          </p>
        </div>

        {/* Progress bar - only show after 2 seconds */}
        {progress > 0 && (
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-primary transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
