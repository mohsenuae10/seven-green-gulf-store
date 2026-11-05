import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  DEFAULT_STORE_THEME,
  STORE_THEME_QUERY_KEY,
  STORE_THEME_SECTION,
  cacheStoreTheme,
  normalizeStoreTheme,
  type StoreTheme,
  type ThemeVariant,
} from "@/hooks/useStoreTheme";

interface OptionProps {
  selected: boolean;
  title: string;
  description: string;
  onSelect: () => void;
  preview: React.ReactNode;
}

const ThemeOption = ({ selected, title, description, onSelect, preview }: OptionProps) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={selected}
    className={`relative text-right rounded-2xl border-2 p-3 transition-all bg-white ${
      selected ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"
    }`}
  >
    {selected && (
      <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
        <Check className="w-4 h-4" />
      </span>
    )}
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 mb-3 h-44 overflow-hidden">{preview}</div>
    <p className="font-bold text-gray-900">{title}</p>
    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
  </button>
);

/* ── Tiny drawn previews (no images needed) ─────────────────────────────── */
const Bar = ({ w = "100%", h = 8, c = "#E5E7EB", r = 4 }: { w?: string; h?: number; c?: string; r?: number }) => (
  <div style={{ width: w, height: h, background: c, borderRadius: r }} />
);

const CheckoutClassicPreview = () => (
  <div className="space-y-1.5">
    <Bar h={10} c="#D1D5DB" />
    <div className="bg-white rounded-lg p-2 space-y-1.5 border border-gray-100">
      <Bar w="60%" />
      <Bar w="40%" c="#53763F" />
    </div>
    <div className="bg-white rounded-lg p-2 space-y-1.5 border border-gray-100">
      <Bar h={6} w="30%" /> <Bar h={12} />
      <Bar h={6} w="30%" /> <Bar h={12} />
      <Bar h={6} w="30%" /> <Bar h={12} />
      <Bar h={14} c="#53763F" r={6} />
    </div>
  </div>
);

const CheckoutSimplePreview = () => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center"><Bar w="35%" h={8} c="#53763F" /><Bar w="20%" h={6} /></div>
    <div className="bg-white rounded-lg p-2 border border-gray-100"><Bar w="70%" /></div>
    <div className="bg-white rounded-lg p-2 space-y-1 border border-gray-100">
      <Bar h={14} c="#111827" r={5} />
    </div>
    <div className="bg-white rounded-lg p-2 space-y-1.5 border border-gray-100">
      <Bar h={16} r={6} />
      <div className="flex gap-1"><Bar w="22%" h={10} c="#E9F0E6" r={8} /><Bar w="22%" h={10} r={8} /><Bar w="22%" h={10} r={8} /></div>
      <Bar h={16} r={6} />
    </div>
    <Bar h={18} c="#53763F" r={6} />
  </div>
);

const CardClassicPreview = () => (
  <div className="grid grid-cols-2 gap-2">
    {[0, 1].map((i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="h-16 bg-gray-200" />
        <div className="p-1.5 space-y-1">
          <Bar h={5} w="50%" c="#FACC15" />
          <Bar h={6} />
          <Bar h={8} w="40%" c="#53763F" />
          <div className="flex gap-1"><Bar h={10} w="50%" r={8} /><Bar h={10} w="50%" c="#53763F" r={8} /></div>
        </div>
      </div>
    ))}
  </div>
);

const CardSimplePreview = () => (
  <div className="grid grid-cols-2 gap-2">
    {[0, 1].map((i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="h-16 bg-[#E9F0E6] relative"><span className="absolute top-1 right-1 w-8 h-2.5 bg-white rounded-full" /></div>
        <div className="p-1.5 space-y-1">
          <Bar h={6} />
          <Bar h={9} w="45%" c="#53763F" />
          {i === 0 ? <Bar h={12} c="#53763F" r={6} /> : <Bar h={12} c="#E9F0E6" r={6} />}
        </div>
      </div>
    ))}
  </div>
);

export default function ThemeManagement() {
  const [theme, setTheme] = useState<StoreTheme>(DEFAULT_STORE_THEME);
  const [savedTheme, setSavedTheme] = useState<StoreTheme>(DEFAULT_STORE_THEME);
  const [rowId, setRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("id, content")
        .eq("section", STORE_THEME_SECTION)
        .maybeSingle();
      if (data) {
        const t = normalizeStoreTheme(data.content);
        setTheme(t);
        setSavedTheme(t);
        setRowId(data.id);
      }
      setLoading(false);
    })();
  }, []);

  const set = (key: keyof StoreTheme, value: ThemeVariant) => setTheme((prev) => ({ ...prev, [key]: value }));

  // Opens the page with the SELECTED design, even before saving (this tab only).
  const openPreview = (path: string) =>
    window.open(`${path}?preview_checkout=${theme.checkout}&preview_card=${theme.productCard}`, "_blank");
  const dirty = theme.checkout !== savedTheme.checkout || theme.productCard !== savedTheme.productCard;

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        section: STORE_THEME_SECTION,
        title: "مظهر المتجر",
        description: "",
        content: { ...theme },
      };
      if (rowId) {
        const { error } = await supabase.from("site_content").update(payload).eq("id", rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("site_content").insert(payload).select("id").single();
        if (error) throw error;
        setRowId(data.id);
      }
      setSavedTheme(theme);
      cacheStoreTheme(theme);
      queryClient.setQueryData(STORE_THEME_QUERY_KEY, theme);
      toast({ title: "تم الحفظ ✓", description: "سيظهر المظهر الجديد للزوار فوراً عند فتح الصفحة" });
    } catch (e) {
      console.error("Theme save failed:", e);
      toast({ title: "خطأ", description: "فشل حفظ المظهر", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>صفحة الدفع</CardTitle>
          <CardDescription>الشكل الذي يراه العميل عند إتمام الطلب</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <ThemeOption
              selected={theme.checkout === "classic"}
              onSelect={() => set("checkout", "classic")}
              title="الكلاسيكي"
              description="التصميم الحالي مع قائمة الموقع وحقول الدولة."
              preview={<CheckoutClassicPreview />}
            />
            <ThemeOption
              selected={theme.checkout === "simple"}
              onSelect={() => set("checkout", "simple")}
              title="المبسّط (للجوال)"
              description="بدون قائمة، أقسام مرقّمة، حقول أكبر، أزرار للمدن، والبريد اختياري مخفي، وزر الدفع ثابت أسفل الشاشة."
              preview={<CheckoutSimplePreview />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => openPreview("/ar/order")}>
              <ExternalLink className="w-4 h-4 ml-1" />
              معاينة صفحة الدفع
            </Button>
            <span className="text-xs text-gray-500">تعرض ما اخترته قبل الحفظ. يجب أن يكون في سلتك منتج واحد على الأقل.</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>بطاقة المنتج</CardTitle>
          <CardDescription>شكل المنتجات في الصفحة الرئيسية وصفحة المنتجات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <ThemeOption
              selected={theme.productCard === "classic"}
              onSelect={() => set("productCard", "classic")}
              title="الكلاسيكي"
              description="التصميم الحالي بزرين: السلة واشترِ الآن."
              preview={<CardClassicPreview />}
            />
            <ThemeOption
              selected={theme.productCard === "simple"}
              onSelect={() => set("productCard", "simple")}
              title="المبسّط"
              description="زر واحد كبير «أضف للسلة» يتحول لعدّاد الكمية، شارة شحن مجاني، وشريط «إتمام الطلب» أسفل صفحة المنتجات."
              preview={<CardSimplePreview />}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => openPreview("/ar/products")}>
            <ExternalLink className="w-4 h-4 ml-1" />
            معاينة المنتجات
          </Button>
        </CardContent>
      </Card>

      <div className="sticky bottom-20 lg:bottom-4 z-10 flex justify-end">
        <Button size="lg" onClick={save} disabled={!dirty || saving} className="shadow-lg min-w-40">
          {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Check className="w-4 h-4 ml-2" />}
          {dirty ? "حفظ المظهر" : "محفوظ"}
        </Button>
      </div>
    </div>
  );
}
