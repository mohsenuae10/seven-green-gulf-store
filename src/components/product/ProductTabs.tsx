import { Star, CheckCircle2, Package, Leaf, Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

export interface ProductIngredient {
  name: string;
  benefit: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFaq {
  q: string;
  a: string;
}

export interface ProductTabsProps {
  productDescription?: string;
  features?: string[];
  ingredients?: ProductIngredient[];
  specs?: ProductSpec[];
  howToUse?: string[];
  faq?: ProductFaq[];
}

export const ProductTabs = ({
  productDescription,
  features = [],
  ingredients = [],
  specs = [],
  howToUse = [],
  faq = [],
}: ProductTabsProps) => {
  const { language } = useLanguage();

  const hasFeatures = features.filter(f => f?.trim()).length > 0;
  const hasIngredients = ingredients.filter(i => i?.name?.trim()).length > 0;
  const hasSpecs = specs.filter(s => s?.label?.trim()).length > 0;
  const hasHowToUse = howToUse.filter(s => s?.trim()).length > 0;
  const hasFaq = faq.filter(f => f?.q?.trim()).length > 0;

  return (
    <Tabs defaultValue="description" className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-2">
        <TabsTrigger value="description" className="flex items-center gap-2">
          <Book className="w-4 h-4" />
          <span>{language === 'ar' ? 'الوصف' : 'Description'}</span>
        </TabsTrigger>
        <TabsTrigger value="ingredients" className="flex items-center gap-2">
          <Leaf className="w-4 h-4" />
          <span>{language === 'ar' ? 'المكونات' : 'Ingredients'}</span>
        </TabsTrigger>
        <TabsTrigger value="specifications" className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>{language === 'ar' ? 'المواصفات' : 'Specifications'}</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>{language === 'ar' ? 'التقييمات' : 'Reviews'}</span>
        </TabsTrigger>
        <TabsTrigger value="howto" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{language === 'ar' ? 'الاستخدام' : 'How to Use'}</span>
        </TabsTrigger>
      </TabsList>

      {/* ── Description ── */}
      <TabsContent value="description" className="space-y-6 pt-4">
        {productDescription && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{productDescription}</p>
          </div>
        )}

        {hasFeatures ? (
          <div>
            <h4 className="text-lg font-semibold mb-3">
              {language === 'ar' ? 'الفوائد الرئيسية:' : 'Key Benefits:'}
            </h4>
            <div className="grid gap-3">
              {features.filter(f => f?.trim()).map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ) : !productDescription ? (
          <p className="text-muted-foreground text-sm italic">
            {language === 'ar'
              ? 'لم يتم إضافة وصف لهذا المنتج بعد.'
              : 'No description has been added for this product yet.'}
          </p>
        ) : null}
      </TabsContent>

      {/* ── Ingredients ── */}
      <TabsContent value="ingredients" className="space-y-6 pt-4">
        {hasIngredients ? (
          <>
            <h3 className="text-2xl font-bold">
              {language === 'ar' ? 'المكونات الطبيعية' : 'Natural Ingredients'}
            </h3>
            <div className="grid gap-4">
              {ingredients.filter(i => i?.name?.trim()).map((ingredient, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                  <Leaf className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">{ingredient.name}</h4>
                    {ingredient.benefit && (
                      <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm italic py-8 text-center">
            {language === 'ar'
              ? 'لم يتم إضافة مكونات لهذا المنتج بعد.'
              : 'No ingredients have been added for this product yet.'}
          </p>
        )}
      </TabsContent>

      {/* ── Specifications ── */}
      <TabsContent value="specifications" className="space-y-6 pt-4">
        {hasSpecs ? (
          <>
            <h3 className="text-2xl font-bold">
              {language === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
            </h3>
            <div className="divide-y">
              {specs.filter(s => s?.label?.trim()).map((spec, i) => (
                <div key={i} className="flex justify-between py-3">
                  <span className="font-medium">{spec.label}</span>
                  <span className="text-muted-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm italic py-8 text-center">
            {language === 'ar'
              ? 'لم يتم إضافة مواصفات لهذا المنتج بعد.'
              : 'No specifications have been added for this product yet.'}
          </p>
        )}
      </TabsContent>

      {/* ── Reviews ── */}
      <TabsContent value="reviews" className="space-y-6 pt-4">
        <h3 className="text-2xl font-bold">
          {language === 'ar' ? 'آراء العملاء' : 'Customer Reviews'}
        </h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {[5,4,3,2,1].map(r => (
            <div key={r} className="flex items-center gap-2">
              <span className="text-sm">{r}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: r === 5 ? '85%' : r === 4 ? '12%' : '3%' }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {r === 5 ? '85%' : r === 4 ? '12%' : '3%'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground italic text-center">
          {language === 'ar' ? '(التقييمات قريباً)' : '(Reviews coming soon)'}
        </p>
      </TabsContent>

      {/* ── How to Use ── */}
      <TabsContent value="howto" className="space-y-6 pt-4">
        {hasHowToUse ? (
          <>
            <h3 className="text-2xl font-bold">
              {language === 'ar' ? 'طريقة الاستخدام' : 'How to Use'}
            </h3>
            <div className="space-y-6">
              {howToUse.filter(s => s?.trim()).map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm italic py-8 text-center">
            {language === 'ar'
              ? 'لم يتم إضافة طريقة الاستخدام لهذا المنتج بعد.'
              : 'No usage instructions have been added for this product yet.'}
          </p>
        )}

        {hasFaq && (
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Book className="w-5 h-5" />
              {language === 'ar' ? 'أسئلة شائعة:' : 'FAQs:'}
            </h4>
            <div className="space-y-3">
              {faq.filter(f => f?.q?.trim()).map((item, i) => (
                <div key={i}>
                  <p className="font-medium text-sm">• {item.q}</p>
                  {item.a && <p className="text-sm text-muted-foreground mr-3 mt-0.5">{item.a}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
