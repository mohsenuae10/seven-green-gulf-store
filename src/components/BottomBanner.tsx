import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BottomBannerData {
  image: string;
  videoUrl: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  bgColor: string;
}

const DEFAULT: BottomBannerData = {
  image: "", videoUrl: "",
  titleAr: "🌿 شحن مجاني لجميع الدول",
  titleEn: "🌿 Free Worldwide Shipping",
  subtitleAr: "اطلب الآن واستلم طلبك مع ضمان الجودة لمدة 30 يوم",
  subtitleEn: "Order now and receive with 30-day quality guarantee",
  buttonTextAr: "تسوق الآن",
  buttonTextEn: "Shop Now",
  buttonLink: "/products",
  bgColor: "#4f7942",
};

const BottomBanner = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<BottomBannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_content").select("content")
      .eq("section", "homepage_bottom_banner").maybeSingle()
      .then(({ data: row }) => {
        if (row?.content) setData({ ...DEFAULT, ...(row.content as any) });
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  const d = data || DEFAULT;
  const title    = language === 'ar' ? d.titleAr    : d.titleEn;
  const subtitle = language === 'ar' ? d.subtitleAr : d.subtitleEn;
  const btnText  = language === 'ar' ? d.buttonTextAr : d.buttonTextEn;
  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      {d.videoUrl ? (
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover">
          <source src={d.videoUrl} />
        </video>
      ) : d.image ? (
        <img src={d.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: d.bgColor }} />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full" />

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10 text-white">
        <h2 className="text-2xl md:text-4xl font-black mb-3">{title}</h2>
        <p className="text-white/85 text-base md:text-lg mb-8 max-w-xl mx-auto">{subtitle}</p>
        <Link to={d.buttonLink || "/products"}>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-10 shadow-lg text-base gap-2"
          >
            {btnText}
            <ChevronIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BottomBanner;
