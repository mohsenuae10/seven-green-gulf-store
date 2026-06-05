import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Save, Eye, Image, X } from "lucide-react";

interface BannerData {
  image: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  overlayOpacity: number;
}

const DEFAULT: BannerData = {
  image: "",
  titleAr: "سفن جرين",
  titleEn: "Seven Green",
  subtitleAr: "منتجات طبيعية لعناية الشعر",
  subtitleEn: "Natural hair care products",
  buttonTextAr: "تسوق الآن",
  buttonTextEn: "Shop Now",
  buttonLink: "/products",
  overlayOpacity: 0.45,
};

const SECTION = "homepage_banner";

const BannerManagement = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [banner, setBanner] = useState<BannerData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase
      .from("site_content").select("id, content")
      .eq("section", SECTION).maybeSingle();
    if (data?.content) {
      setBanner({ ...DEFAULT, ...(data.content as any) });
      setContentId(data.id);
    }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { section: SECTION, title: "البنر الرئيسي", description: "", content: banner };
      if (contentId) {
        await supabase.from("site_content").update(payload).eq("id", contentId);
      } else {
        const { data } = await supabase.from("site_content").insert(payload).select("id").single();
        if (data) setContentId(data.id);
      }
      toast({ title: "تم الحفظ", description: "تم حفظ البنر بنجاح ✓" });
    } catch {
      toast({ title: "خطأ", description: "فشل في الحفظ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `banners/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
      setBanner(b => ({ ...b, image: publicUrl }));
      toast({ title: "تم الرفع", description: "تم رفع صورة البنر ✓" });
    } catch {
      toast({ title: "خطأ", description: "فشل في رفع الصورة", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const set = (key: keyof BannerData, value: string | number) =>
    setBanner(b => ({ ...b, [key]: value }));

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">إدارة البنر الرئيسي</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreview(p => !p)} className="gap-1.5">
            <Eye className="w-4 h-4" />
            {preview ? "إخفاء المعاينة" : "معاينة"}
          </Button>
          <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "جاري الحفظ..." : "حفظ البنر"}
          </Button>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border">
          {banner.image ? (
            <img src={banner.image} alt="banner preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary to-green-700" />
          )}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
            style={{ backgroundColor: `rgba(0,0,0,${banner.overlayOpacity})` }}
          >
            <h2 className="text-2xl font-black mb-2">{banner.titleAr}</h2>
            <p className="text-sm mb-4 opacity-90">{banner.subtitleAr}</p>
            <span className="bg-white text-primary px-5 py-2 rounded-full text-sm font-bold">
              {banner.buttonTextAr}
            </span>
          </div>
        </div>
      )}

      {/* Image Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="w-4 h-4" /> صورة البنر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className="border-2 border-dashed border-gray-300 hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">اضغط لرفع صورة البنر</p>
                <p className="text-xs text-gray-400 mt-1">PNG، JPG، WEBP — يُفضل 1920×600</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />

          {banner.image && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <img src={banner.image} alt="" className="w-16 h-10 object-cover rounded" />
              <span className="text-xs text-gray-500 flex-1 truncate">{banner.image}</span>
              <button onClick={() => set("image", "")} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs">رابط الصورة (بديل عن الرفع)</Label>
            <Input value={banner.image} onChange={e => set("image", e.target.value)}
              placeholder="https://..." className="text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Text Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">النصوص</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">العنوان — عربي</Label>
              <Input value={banner.titleAr} onChange={e => set("titleAr", e.target.value)}
                placeholder="سفن جرين" className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">العنوان — إنجليزي</Label>
              <Input value={banner.titleEn} onChange={e => set("titleEn", e.target.value)}
                placeholder="Seven Green" className="text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">الوصف — عربي</Label>
              <Input value={banner.subtitleAr} onChange={e => set("subtitleAr", e.target.value)}
                placeholder="منتجات طبيعية" className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الوصف — إنجليزي</Label>
              <Input value={banner.subtitleEn} onChange={e => set("subtitleEn", e.target.value)}
                placeholder="Natural products" className="text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">نص الزر — عربي</Label>
              <Input value={banner.buttonTextAr} onChange={e => set("buttonTextAr", e.target.value)}
                placeholder="تسوق الآن" className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">نص الزر — إنجليزي</Label>
              <Input value={banner.buttonTextEn} onChange={e => set("buttonTextEn", e.target.value)}
                placeholder="Shop Now" className="text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">رابط الزر</Label>
              <Input value={banner.buttonLink} onChange={e => set("buttonLink", e.target.value)}
                placeholder="/products" className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">شفافية التظليل (0 = لا شيء، 1 = داكن جداً)</Label>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="0.9" step="0.05"
                  value={banner.overlayOpacity}
                  onChange={e => set("overlayOpacity", parseFloat(e.target.value))}
                  className="flex-1" />
                <span className="text-xs w-8 text-center">{Math.round(banner.overlayOpacity * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannerManagement;
