import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/metaPixel";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    // The Meta Pixel base snippet in index.html already fires the PageView
    // for the initial load; only track subsequent SPA route changes here.
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      trackPageView();
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
