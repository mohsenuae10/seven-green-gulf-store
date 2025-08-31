import { ReactNode } from "react";

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
}

const MobileOptimized = ({ children, className = "" }: MobileOptimizedProps) => {
  return (
    <div className={`mobile-optimized overflow-x-hidden max-w-full scroll-smooth ${className}`}>
      {children}
      
      {/* Mobile spacing for bottom buy button */}
      <div className="h-24 sm:hidden" />
    </div>
  );
};

export default MobileOptimized;