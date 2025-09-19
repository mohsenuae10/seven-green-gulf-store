import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const CustomerReviews = () => {
  const { language, t } = useLanguage();
  
  const reviews = language === 'ar' ? [
    {
      name: "سارة أحمد",
      location: "الرياض، السعودية",
      rating: 5,
      comment: "منتج رائع! شعري أصبح أكثر نعومة ولمعان من أول استخدام. أنصح به بشدة لكل من تعاني من جفاف الشعر.",
      avatar: "SA",
      verified: true
    },
    {
      name: "فاطمة العلي",
      location: "دبي، الإمارات",
      rating: 5,
      comment: "استخدمت منتجات كثيرة لكن سيفن جرين مختلف تماماً. شعري أصبح أقوى وأكثر كثافة وتوقف التساقط نهائياً.",
      avatar: "FA",
      verified: true
    },
    {
      name: "نورا الزهراني",
      location: "جدة، السعودية", 
      rating: 5,
      comment: "المنتج طبيعي 100% وآمن. أستخدمه لابنتي المراهقة وشاهدت نتائج مذهلة في تحسن صحة شعرها.",
      avatar: "NZ",
      verified: true
    },
    {
      name: "مريم الكندري",
      location: "الكويت",
      rating: 5,
      comment: "شعري كان تالف جداً من الصبغة، لكن بعد شهر من استخدام سيفن جرين عاد شعري لحيويته الطبيعية.",
      avatar: "MK",
      verified: true
    },
    {
      name: "هند البحريني",
      location: "المنامة، البحرين",
      rating: 5,
      comment: "أفضل استثمار لجمال شعري! الرائحة طبيعية والنتيجة فورية. سأستمر في استخدامه بالتأكيد.",
      avatar: "HB",
      verified: true
    },
    {
      name: "علياء القطري",
      location: "الدوحة، قطر",
      rating: 5,
      comment: "منتج فاخر وجودة عالية. يستحق السعر فعلاً وأكثر. شعري أصبح كشعر الإعلانات!",
      avatar: "AQ",
      verified: true
    }
  ] : [
    {
      name: "Sarah Ahmed",
      location: "Riyadh, Saudi Arabia",
      rating: 5,
      comment: t('reviews.english.1'),
      avatar: "SA",
      verified: true
    },
    {
      name: "Fatima Al-Ali",
      location: "Dubai, UAE",
      rating: 5,
      comment: t('reviews.english.2'),
      avatar: "FA",
      verified: true
    },
    {
      name: "Nora Al-Zahrani",
      location: "Jeddah, Saudi Arabia", 
      rating: 5,
      comment: t('reviews.english.3'),
      avatar: "NZ",
      verified: true
    },
    {
      name: "Maryam Al-Kandari",
      location: "Kuwait",
      rating: 5,
      comment: t('reviews.english.4'),
      avatar: "MK",
      verified: true
    },
    {
      name: "Hind Al-Bahraini",
      location: "Manama, Bahrain",
      rating: 5,
      comment: t('reviews.english.5'),
      avatar: "HB",
      verified: true
    },
    {
      name: "Alia Al-Qatari",
      location: "Doha, Qatar",
      rating: 5,
      comment: t('reviews.english.6'),
      avatar: "AQ",
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/20 to-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-6 py-2 mb-6">
            <Quote className="w-5 h-5 text-secondary" />
            <span className="text-secondary-foreground font-medium">{t('reviews.badge')}</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('reviews.title')}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-2xl font-bold text-secondary">4.9</span>
            <span className="text-muted-foreground">(2,847 {t('reviews.badge')})</span>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('reviews.description')}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <Card 
              key={index}
              className="relative bg-gradient-card border-border/50 hover:border-secondary/30 transition-all duration-500 hover:scale-105 hover:shadow-medium animate-bounce-in overflow-hidden"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Quote decoration */}
              <div className="absolute top-4 left-4 text-secondary/20">
                <Quote className="w-8 h-8" />
              </div>
              
              <div className="p-6 pt-8">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'fill-secondary text-secondary' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-foreground leading-relaxed mb-6 text-sm">
                  "{review.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-secondary/20">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm">{review.name}</h4>
                      {review.verified && (
                        <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              </div>

              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
          {[
            { number: "10,000+", label: t('reviews.stats.customers') },
            { number: "4.9/5", label: t('reviews.stats.rating') },
            { number: "98%", label: t('reviews.stats.satisfaction') },
            { number: language === 'ar' ? "30 يوم" : "30 days", label: t('reviews.stats.guarantee') }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;