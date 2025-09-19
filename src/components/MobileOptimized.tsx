import { ReactNode } from "react";

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
  dir?: string;
}

const MobileOptimized = ({ children, className = "", dir }: MobileOptimizedProps) => {
  return (
    <div className={`mobile-optimized overflow-x-hidden max-w-full scroll-smooth ${className}`} dir={dir}>
      {children}
      
      {/* Mobile spacing for bottom buy button */}
      <div className="h-24 sm:hidden" />
    </div>
  );
};

export default MobileOptimized;