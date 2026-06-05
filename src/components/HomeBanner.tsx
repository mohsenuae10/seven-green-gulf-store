import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerData {
  image: string;
  videoUrl?: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  overlayOpacity: number;
}

const DEFAULT_GRADIENT = "linear-gradient(135deg, #2d5a27 0%, #4f7942 50%, #6aab5e 100%)";

const HomeBanner = () => {
  const { language } = useLanguage();
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_content").select("content")
        .eq("section", "homepage_banner").maybeSingle();
      if (data?.content) setBanner(data.content as BannerData);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Skeleton className="w-full h-[420px] md:h-[520px] rounded-none" />;

  const title    = language === 'ar' ? banner?.titleAr    : banner?.titleEn;
  const subtitle = language === 'ar' ? banner?.subtitleAr : banner?.subtitleEn;
  const btnText  = language === 'ar' ? banner?.buttonTextAr : banner?.buttonTextEn;
  const link     = banner?.buttonLink || "/products";
  const opacity  = banner?.overlayOpacity ?? 0.45;
  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Background — فيديو أو صورة */}
      {banner?.videoUrl ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={banner.videoUrl} />
        </video>
      ) : banner?.image ? (
        <img
          src={banner.image}
          alt={title || "Seven Green"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: DEFAULT_GRADIENT }} />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 py-24 md:py-32">
        {/* Title */}
        {title && (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg leading-tight">
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl drop-shadow">
            {subtitle}
          </p>
        )}

        {/* CTA Button */}
        {btnText && (
          <Link to={link}>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-8 gap-2 shadow-lg text-base"
            >
              {btnText}
              <ChevronIcon className="w-4 h-4" />
            </Button>
          </Link>
        )}

        {/* Default CTA if no banner configured */}
        {!banner && (
          <>
            <h1 className="text-4xl md:text-6xl font-black mb-4">SEVEN GREEN</h1>
            <p className="text-lg text-white/90 mb-8">
              {language === 'ar' ? 'منتجات طبيعية لعناية الشعر' : 'Natural hair care products'}
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-8">
                {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                <ChevronIcon className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
};

export default HomeBanner;
