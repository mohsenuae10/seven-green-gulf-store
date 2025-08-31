import { ReactNode } from "react";

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
}

const MobileOptimized = ({ children, className = "" }: MobileOptimizedProps) => {
  return (
    <div className={`mobile-optimized overflow-x-hidden max-w-full scroll-smooth ${className}`}>
      {children}
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 sm:hidden" />
    </div>
  );
};

export default MobileOptimized;