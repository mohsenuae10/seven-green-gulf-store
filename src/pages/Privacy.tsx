import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { ChevronRight } from "lucide-react";
import MobileOptimized from "@/components/MobileOptimized";
import { CONTACT_INFO } from "@/config/contact";

const Privacy = () => {
  const { language } = useLanguage();

  const title = language === 'ar'
    ? "سياسة الخصوصية | سفن جرين"
    : "Privacy Policy | Seven Green";

  const description = language === 'ar'
    ? "سياسة الخصوصية لمتجر سفن جرين - كيف نجمع بياناتك ونحميها ونستخدمها."
    : "Seven Green store privacy policy - how we collect, protect and use your data.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://sevensgreen.com/privacy" />
      </Helmet>

      <MobileOptimized className="min-h-screen bg-background">
        <nav className="container mx-auto px-4 py-4" aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <li>
              <span className="text-foreground font-medium">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </span>
            </li>
          </ol>
        </nav>

        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-muted-foreground mb-10 text-sm">
            {language === 'ar' ? 'آخر تحديث: يونيو 2026' : 'Last updated: June 2026'}
          </p>

          {language === 'ar' ? (
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. المعلومات التي نجمعها</h2>
                <p>عند طلب منتجاتنا، نجمع المعلومات التالية:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>الاسم الكامل</li>
                  <li>رقم الهاتف</li>
                  <li>عنوان الشحن (المدينة، المنطقة، الدولة)</li>
                  <li>عنوان البريد الإلكتروني (إن قُدِّم)</li>
                  <li>بيانات الدفع (تُعالَج بشكل مشفر عبر Stripe ولا نحتفظ بها)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. كيف نستخدم معلوماتك</h2>
                <p>نستخدم بياناتك الشخصية فقط من أجل:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>معالجة طلبك وتأكيده</li>
                  <li>التواصل معك بشأن حالة الشحن</li>
                  <li>الرد على استفساراتك عبر خدمة العملاء</li>
                  <li>تحسين تجربة المتجر (بيانات مجهولة الهوية فقط)</li>
                </ul>
                <p className="mt-3">نحن لا نبيع بياناتك أو نشاركها مع أطراف ثالثة لأغراض تسويقية.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. ملفات تعريف الارتباط (Cookies)</h2>
                <p>يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة التصفح وتتبع أداء الإعلانات عبر:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Google Analytics — لقياس حركة الزوار</li>
                  <li>Google Ads — لقياس فعالية الإعلانات</li>
                  <li>Snapchat Pixel — لتتبع التحويلات</li>
                </ul>
                <p className="mt-3">يمكنك تعطيل ملفات الارتباط من إعدادات متصفحك في أي وقت.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. أمان بياناتك</h2>
                <p>نستخدم بروتوكول HTTPS لتشفير جميع البيانات المنقولة. بيانات بطاقات الدفع تُعالَج حصرياً عبر Stripe — وهي شركة معتمدة بمعيار PCI DSS — ولا يصلنا أي رقم بطاقة كامل.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. مدة الاحتفاظ بالبيانات</h2>
                <p>نحتفظ ببيانات الطلبات لمدة 3 سنوات لأغراض المحاسبة وخدمة العملاء، ثم يتم حذفها بشكل آمن.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. حقوقك</h2>
                <p>يحق لك في أي وقت:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>طلب الاطلاع على بياناتك الشخصية</li>
                  <li>طلب تصحيح أو حذف بياناتك</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. التواصل معنا</h2>
                <p>لأي استفسار بشأن خصوصيتك، تواصل معنا على:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>البريد: <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">{CONTACT_INFO.email}</a></li>
                  <li>الهاتف: <a href={`tel:${CONTACT_INFO.phone}`} className="text-primary hover:underline">{CONTACT_INFO.phone}</a></li>
                </ul>
              </section>
            </div>
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                <p>When you place an order, we collect the following information:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Full name</li>
                  <li>Phone number</li>
                  <li>Shipping address (city, region, country)</li>
                  <li>Email address (if provided)</li>
                  <li>Payment data (processed encrypted via Stripe — we do not store it)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p>We use your personal data only to:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Process and confirm your order</li>
                  <li>Communicate shipping status</li>
                  <li>Respond to customer service inquiries</li>
                  <li>Improve the store experience (anonymous data only)</li>
                </ul>
                <p className="mt-3">We do not sell or share your data with third parties for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. Cookies</h2>
                <p>Our site uses cookies to improve browsing and track ad performance via:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Google Analytics — to measure visitor traffic</li>
                  <li>Google Ads — to measure ad effectiveness</li>
                  <li>Snapchat Pixel — to track conversions</li>
                </ul>
                <p className="mt-3">You can disable cookies in your browser settings at any time.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
                <p>We use HTTPS to encrypt all transmitted data. Payment card data is processed exclusively through Stripe — a PCI DSS certified provider — and we never receive a full card number.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
                <p>We retain order data for 3 years for accounting and customer service purposes, after which it is securely deleted.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
                <p>You may at any time:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Request access to your personal data</li>
                  <li>Request correction or deletion of your data</li>
                  <li>Object to the processing of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
                <p>For any privacy inquiries, contact us at:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">{CONTACT_INFO.email}</a></li>
                  <li>Phone: <a href={`tel:${CONTACT_INFO.phone}`} className="text-primary hover:underline">{CONTACT_INFO.phone}</a></li>
                </ul>
              </section>
            </div>
          )}
        </main>
      </MobileOptimized>
    </>
  );
};

export default Privacy;
