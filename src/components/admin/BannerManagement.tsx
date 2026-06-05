import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Save, Eye, Image, X, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ─── Types ─────────────────────────────────────────────── */
interface BannerData {
  image: string;
  videoUrl: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  overlayOpacity: number;
}

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

const TOP_DEFAULT: BannerData = {
  image: "", videoUrl: "",
  titleAr: "سفن جرين", titleEn: "Seven Green",
  subtitleAr: "منتجات طبيعية لعناية الشعر", subtitleEn: "Natural hair care products",
  buttonTextAr: "تسوق الآن", buttonTextEn: "Shop Now",
  buttonLink: "/products", overlayOpacity: 0.45,
};

const BOTTOM_DEFAULT: BottomBannerData = {
  image: "", videoUrl: "",
  titleAr: "شحن مجاني لجميع الدول", titleEn: "Free Worldwide Shipping",
  subtitleAr: "اطلب الآن واستلم طلبك مع ضمان الجودة لمدة 30 يوم",
  subtitleEn: "Order now and receive with 30-day quality guarantee",
  buttonTextAr: "تسوق الآن", buttonTextEn: "Shop Now",
  buttonLink: "/products", bgColor: "#4f7942",
};

/* ─── Helper ─────────────────────────────────────────────── */
const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);

const BannerManagement = () => {
  const { toast } = useToast();
  const topImgRef  = useRef<HTMLInputElement>(null);
  const topVidRef  = useRef<HTMLInputElement>(null);
  const botImgRef  = useRef<HTMLInputElement>(null);
  const botVidRef  = useRef<HTMLInputElement>(null);

  const [top, setTop]       = useState<BannerData>(TOP_DEFAULT);
  const [bottom, setBottom] = useState<BottomBannerData>(BOTTOM_DEFAULT);
  const [topId, setTopId]   = useState<string | null>(null);
  const [botId, setBotId]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [savingTop, setSavingTop]   = useState(false);
  const [savingBot, setSavingBot]   = useState(false);
  const [uploading, setUploading]   = useState<string | null>(null);
  const [previewTop, setPreviewTop] = useState(false);
  const [previewBot, setPreviewBot] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [{ data: t }, { data: b }] = await Promise.all([
      supabase.from("site_content").select("id,content").eq("section","homepage_banner").maybeSingle(),
      supabase.from("site_content").select("id,content").eq("section","homepage_bottom_banner").maybeSingle(),
    ]);
    if (t?.content) { setTop({ ...TOP_DEFAULT, ...(t.content as any) }); setTopId(t.id); }
    if (b?.content) { setBottom({ ...BOTTOM_DEFAULT, ...(b.content as any) }); setBotId(b.id); }
    setLoading(false);
  };

  const upsert = async (section: string, id: string|null, content: any, setId: (v:string)=>void) => {
    const payload = { section, title: section, description: "", content };
    if (id) {
      await supabase.from("site_content").update(payload).eq("id", id);
    } else {
      const { data } = await supabase.from("site_content").insert(payload).select("id").single();
      if (data) setId(data.id);
    }
  };

  const saveTop = async () => {
    setSavingTop(true);
    try {
      await upsert("homepage_banner", topId, top, setTopId);
      toast({ title: "تم الحفظ", description: "تم حفظ البنر العلوي ✓" });
    } catch { toast({ title: "خطأ", description: "فشل الحفظ", variant: "destructive" }); }
    finally { setSavingTop(false); }
  };

  const saveBottom = async () => {
    setSavingBot(true);
    try {
      await upsert("homepage_bottom_banner", botId, bottom, setBotId);
      toast({ title: "تم الحفظ", description: "تم حفظ البنر السفلي ✓" });
    } catch { toast({ title: "خطأ", description: "فشل الحفظ", variant: "destructive" }); }
    finally { setSavingBot(false); }
  };

  const uploadFile = async (file: File, target: "topImg"|"topVid"|"botImg"|"botVid") => {
    setUploading(target);
    try {
      const ext  = file.name.split(".").pop();
      const path = `banners/${target}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
      if (target === "topImg")  setTop(b => ({ ...b, image: publicUrl }));
      if (target === "topVid")  setTop(b => ({ ...b, videoUrl: publicUrl }));
      if (target === "botImg")  setBottom(b => ({ ...b, image: publicUrl }));
      if (target === "botVid")  setBottom(b => ({ ...b, videoUrl: publicUrl }));
      toast({ title: "تم الرفع ✓" });
    } catch { toast({ title: "خطأ في الرفع", variant: "destructive" }); }
    finally { setUploading(null); }
  };

  /* ── MediaUploadRow ── */
  const MediaRow = ({
    label, imgRef, vidRef, imageVal, videoVal,
    onImg, onVid, onImgUrl, onVidUrl, targetImg, targetVid,
  }: {
    label: string; imgRef: any; vidRef: any;
    imageVal: string; videoVal: string;
    onImg: (v:string)=>void; onVid: (v:string)=>void;
    onImgUrl: (v:string)=>void; onVidUrl: (v:string)=>void;
    targetImg: string; targetVid: string;
  }) => (
    <div className="space-y-4">
      {/* Image */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">📷 الصورة</Label>
        <div className="flex gap-2">
          <div
            className="flex-1 border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-lg p-3 text-center cursor-pointer transition-colors"
            onClick={() => imgRef.current?.click()}
          >
            {uploading === targetImg
              ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
              : <><Image className="w-5 h-5 mx-auto mb-1 text-gray-400" /><p className="text-xs text-gray-500">رفع صورة</p></>
            }
          </div>
          <input ref={imgRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f=e.target.files?.[0]; if(f) uploadFile(f,targetImg as any); e.target.value=""; }} />
        </div>
        <Input value={imageVal} onChange={e=>onImgUrl(e.target.value)} placeholder="أو ضع رابط الصورة هنا..." className="text-xs" />
        {imageVal && !isVideo(imageVal) && (
          <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
            <img src={imageVal} className="w-12 h-8 object-cover rounded" />
            <span className="text-xs text-gray-400 flex-1 truncate">{imageVal}</span>
            <button onClick={()=>onImg("")}><X className="w-3.5 h-3.5 text-red-400" /></button>
          </div>
        )}
      </div>

      {/* Video */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">🎬 فيديو (بديل عن الصورة أو فوقها)</Label>
        <div className="flex gap-2">
          <div
            className="flex-1 border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-lg p-3 text-center cursor-pointer transition-colors"
            onClick={() => vidRef.current?.click()}
          >
            {uploading === targetVid
              ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-purple-500" />
              : <><Video className="w-5 h-5 mx-auto mb-1 text-purple-400" /><p className="text-xs text-gray-500">رفع فيديو</p></>
            }
          </div>
          <input ref={vidRef} type="file" accept="video/*" className="hidden"
            onChange={e => { const f=e.target.files?.[0]; if(f) uploadFile(f,targetVid as any); e.target.value=""; }} />
        </div>
        <Input value={videoVal} onChange={e=>onVidUrl(e.target.value)} placeholder="أو ضع رابط الفيديو (mp4)..." className="text-xs" />
        {videoVal && (
          <div className="flex items-center gap-2 bg-purple-50 rounded p-2">
            <Video className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-xs text-gray-400 flex-1 truncate">{videoVal}</span>
            <button onClick={()=>onVid("")}><X className="w-3.5 h-3.5 text-red-400" /></button>
          </div>
        )}
        <p className="text-[10px] text-gray-400">* الفيديو يشتغل تلقائياً بدون صوت ويتكرر كخلفية</p>
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold">إدارة البنرات</h2>

      <Tabs defaultValue="top">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="top">البنر العلوي</TabsTrigger>
          <TabsTrigger value="bottom">البنر السفلي</TabsTrigger>
        </TabsList>

        {/* ── TOP BANNER ── */}
        <TabsContent value="top" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">البنر الرئيسي (أعلى الصفحة)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={()=>setPreviewTop(p=>!p)} className="gap-1">
                <Eye className="w-3.5 h-3.5" />{previewTop ? "إخفاء" : "معاينة"}
              </Button>
              <Button size="sm" onClick={saveTop} disabled={savingTop} className="gap-1">
                {savingTop ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                حفظ
              </Button>
            </div>
          </div>

          {previewTop && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border">
              {top.videoUrl ? (
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src={top.videoUrl} />
                </video>
              ) : top.image ? (
                <img src={top.image} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-700" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
                style={{ backgroundColor: `rgba(0,0,0,${top.overlayOpacity})` }}>
                <p className="text-lg font-black">{top.titleAr}</p>
                <p className="text-xs mt-1 opacity-80">{top.subtitleAr}</p>
                <span className="mt-2 bg-white text-primary px-4 py-1 rounded-full text-xs font-bold">{top.buttonTextAr}</span>
              </div>
            </div>
          )}

          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">الوسائط</CardTitle></CardHeader>
            <CardContent>
              <MediaRow label="البنر العلوي"
                imgRef={topImgRef} vidRef={topVidRef}
                imageVal={top.image} videoVal={top.videoUrl}
                onImg={v=>setTop(b=>({...b,image:v}))} onVid={v=>setTop(b=>({...b,videoUrl:v}))}
                onImgUrl={v=>setTop(b=>({...b,image:v}))} onVidUrl={v=>setTop(b=>({...b,videoUrl:v}))}
                targetImg="topImg" targetVid="topVid"
              />
            </CardContent>
          </Card>

          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">النصوص</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">العنوان — عربي</Label>
                  <Input value={top.titleAr} onChange={e=>setTop(b=>({...b,titleAr:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">العنوان — إنجليزي</Label>
                  <Input value={top.titleEn} onChange={e=>setTop(b=>({...b,titleEn:e.target.value}))} className="text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">الوصف — عربي</Label>
                  <Input value={top.subtitleAr} onChange={e=>setTop(b=>({...b,subtitleAr:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">الوصف — إنجليزي</Label>
                  <Input value={top.subtitleEn} onChange={e=>setTop(b=>({...b,subtitleEn:e.target.value}))} className="text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">نص الزر — عربي</Label>
                  <Input value={top.buttonTextAr} onChange={e=>setTop(b=>({...b,buttonTextAr:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">نص الزر — إنجليزي</Label>
                  <Input value={top.buttonTextEn} onChange={e=>setTop(b=>({...b,buttonTextEn:e.target.value}))} className="text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">رابط الزر</Label>
                  <Input value={top.buttonLink} onChange={e=>setTop(b=>({...b,buttonLink:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">التظليل {Math.round(top.overlayOpacity*100)}%</Label>
                  <input type="range" min="0" max="0.9" step="0.05" value={top.overlayOpacity}
                    onChange={e=>setTop(b=>({...b,overlayOpacity:parseFloat(e.target.value)}))} className="w-full" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── BOTTOM BANNER ── */}
        <TabsContent value="bottom" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">البنر الترويجي (أسفل الصفحة)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={()=>setPreviewBot(p=>!p)} className="gap-1">
                <Eye className="w-3.5 h-3.5" />{previewBot ? "إخفاء" : "معاينة"}
              </Button>
              <Button size="sm" onClick={saveBottom} disabled={savingBot} className="gap-1">
                {savingBot ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                حفظ
              </Button>
            </div>
          </div>

          {previewBot && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border">
              {bottom.videoUrl ? (
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src={bottom.videoUrl} />
                </video>
              ) : bottom.image ? (
                <img src={bottom.image} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: bottom.bgColor }} />
              )}
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
                <p className="font-black">{bottom.titleAr}</p>
                <p className="text-xs mt-1 opacity-80">{bottom.subtitleAr}</p>
                <span className="mt-2 bg-white text-primary px-4 py-1 rounded-full text-xs font-bold">{bottom.buttonTextAr}</span>
              </div>
            </div>
          )}

          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">الوسائط</CardTitle></CardHeader>
            <CardContent>
              <MediaRow label="البنر السفلي"
                imgRef={botImgRef} vidRef={botVidRef}
                imageVal={bottom.image} videoVal={bottom.videoUrl}
                onImg={v=>setBottom(b=>({...b,image:v}))} onVid={v=>setBottom(b=>({...b,videoUrl:v}))}
                onImgUrl={v=>setBottom(b=>({...b,image:v}))} onVidUrl={v=>setBottom(b=>({...b,videoUrl:v}))}
                targetImg="botImg" targetVid="botVid"
              />
              <div className="mt-3 space-y-1">
                <Label className="text-xs">لون الخلفية (إذا لم يوجد صورة/فيديو)</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bottom.bgColor}
                    onChange={e=>setBottom(b=>({...b,bgColor:e.target.value}))}
                    className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
                  <Input value={bottom.bgColor} onChange={e=>setBottom(b=>({...b,bgColor:e.target.value}))}
                    className="text-xs flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">النصوص</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">العنوان — عربي</Label>
                  <Input value={bottom.titleAr} onChange={e=>setBottom(b=>({...b,titleAr:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">العنوان — إنجليزي</Label>
                  <Input value={bottom.titleEn} onChange={e=>setBottom(b=>({...b,titleEn:e.target.value}))} className="text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">الوصف — عربي</Label>
                  <Input value={bottom.subtitleAr} onChange={e=>setBottom(b=>({...b,subtitleAr:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">الوصف — إنجليزي</Label>
                  <Input value={bottom.subtitleEn} onChange={e=>setBottom(b=>({...b,subtitleEn:e.target.value}))} className="text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">نص الزر — عربي</Label>
                  <Input value={bottom.buttonTextAr} onChange={e=>setBottom(b=>({...b,buttonTextAr:e.target.value}))} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">نص الزر — إنجليزي</Label>
                  <Input value={bottom.buttonTextEn} onChange={e=>setBottom(b=>({...b,buttonTextEn:e.target.value}))} className="text-sm" /></div>
              </div>
              <div className="space-y-1"><Label className="text-xs">رابط الزر</Label>
                <Input value={bottom.buttonLink} onChange={e=>setBottom(b=>({...b,buttonLink:e.target.value}))} className="text-sm" /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BannerManagement;
