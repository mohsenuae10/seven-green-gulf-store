import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Edit2, Plus, Trash2, Sparkles, Upload, Star, StarOff,
  X, Loader2, Image, ArrowRight, Package,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number | null;
  is_active: boolean | null;
  image_url: string | null;
  created_at: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean | null;
}

// Staged image before upload (for new products)
interface StagedImage {
  file: File;
  preview: string;
}

/* ─── Component ─────────────────────────────────────────── */
export function ProductsManagement() {
  const { formatPrice, getCurrentCurrency } = useCurrency();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // List
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form mode: null = list only | "create" | product id = editing
  const [mode, setMode] = useState<null | "create" | string>(null);
  const editingProduct = typeof mode === "string" && mode !== "create"
    ? products.find(p => p.id === mode) ?? null
    : null;

  // Form fields
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock_quantity: "", is_active: true, image_url: "",
  });
  const [aiKeywords, setAiKeywords] = useState("");
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [saving, setSaving] = useState(false);

  // Images for existing product
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loadingImgs, setLoadingImgs] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Staged images for new product (uploaded after product is created)
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);

  /* ── Fetch ── */
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoadingList(true);
    const { data } = await supabase
      .from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoadingList(false);
  };

  const fetchImages = async (productId: string) => {
    setLoadingImgs(true);
    const { data } = await supabase
      .from("product_images").select("*")
      .eq("product_id", productId).order("display_order");
    setImages(data || []);
    setLoadingImgs(false);
  };

  /* ── Open form ── */
  const openCreate = () => {
    setForm({ name: "", description: "", price: "", stock_quantity: "", is_active: true, image_url: "" });
    setAiKeywords("");
    setImages([]);
    setStagedImages([]);
    setMode("create");
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock_quantity: product.stock_quantity?.toString() || "",
      is_active: product.is_active ?? true,
      image_url: product.image_url || "",
    });
    setAiKeywords("");
    setStagedImages([]);
    setMode(product.id);
    fetchImages(product.id);
  };

  const closeForm = () => { setMode(null); setStagedImages([]); setImages([]); };

  /* ── AI Description ── */
  const generateDesc = async () => {
    if (!form.name.trim()) {
      toast({ title: "تنبيه", description: "أدخل اسم المنتج أولاً", variant: "destructive" });
      return;
    }
    setGeneratingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-description", {
        body: { productName: form.name, keywords: aiKeywords, language: "ar" },
      });
      if (error || !data?.description) throw new Error();
      setForm(f => ({ ...f, description: data.description }));
      toast({ title: "✨ تم التوليد", description: "تم توليد الوصف بالذكاء الاصطناعي" });
    } catch {
      toast({ title: "خطأ", description: "فشل توليد الوصف", variant: "destructive" });
    } finally {
      setGeneratingDesc(false);
    }
  };

  /* ── Save product ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast({ title: "تنبيه", description: "الاسم والسعر مطلوبان", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description || null,
        price: parseFloat(form.price),
        stock_quantity: form.stock_quantity ? parseInt(form.stock_quantity) : null,
        is_active: form.is_active,
        image_url: form.image_url || null,
        updated_at: new Date().toISOString(),
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId!);
        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث المنتج بنجاح ✓" });
      } else {
        const { data, error } = await supabase
          .from("products").insert({ ...payload, created_at: new Date().toISOString() })
          .select().single();
        if (error || !data) throw error;
        productId = data.id;
        toast({ title: "تم الإنشاء", description: "تم إنشاء المنتج بنجاح ✓" });

        // Upload any staged images
        if (stagedImages.length > 0 && productId) {
          await uploadStagedImages(productId, stagedImages);
          setStagedImages([]);
        }

        // Switch to edit mode so images can be managed
        setMode(productId!);
        fetchImages(productId!);
        fetchProducts();
        setSaving(false);
        return;
      }

      fetchProducts();
      closeForm();
    } catch (err) {
      console.error(err);
      toast({ title: "خطأ", description: "فشل في حفظ المنتج", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  /* ── Upload staged images after product creation ── */
  const uploadStagedImages = async (productId: string, staged: StagedImage[]) => {
    for (let i = 0; i < staged.length; i++) {
      const file = staged[i].file;
      const ext = file.name.split(".").pop();
      const path = `${productId}/${Date.now()}-${i}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
      if (upErr) continue;
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
      await supabase.from("product_images").insert({
        product_id: productId,
        image_url: publicUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        display_order: i,
        is_primary: i === 0,
      });
    }
    toast({ title: "تم الرفع", description: `تم رفع ${staged.length} صورة` });
  };

  /* ── Upload image for existing product ── */
  const uploadImage = async (file: File) => {
    if (!editingProduct) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${editingProduct.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
      const nextOrder = Math.max(...images.map(i => i.display_order), -1) + 1;
      await supabase.from("product_images").insert({
        product_id: editingProduct.id,
        image_url: publicUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        display_order: nextOrder,
        is_primary: images.length === 0,
      });
      fetchImages(editingProduct.id);
      toast({ title: "تم الرفع", description: "تم رفع الصورة بنجاح ✓" });
    } catch {
      toast({ title: "خطأ", description: "فشل في رفع الصورة", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  /* ── Stage image for new product ── */
  const stageImage = (file: File) => {
    const preview = URL.createObjectURL(file);
    setStagedImages(prev => [...prev, { file, preview }]);
  };

  const removeStagedImage = (idx: number) => {
    setStagedImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  /* ── Image actions for existing product ── */
  const deleteImage = async (img: ProductImage) => {
    try {
      const path = img.image_url.split("/").slice(-2).join("/");
      await supabase.storage.from("product-images").remove([path]);
      await supabase.from("product_images").delete().eq("id", img.id);
      fetchImages(editingProduct!.id);
      toast({ title: "تم الحذف", description: "تم حذف الصورة" });
    } catch {
      toast({ title: "خطأ", description: "فشل في حذف الصورة", variant: "destructive" });
    }
  };

  const setPrimary = async (imgId: string) => {
    if (!editingProduct) return;
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", editingProduct.id);
    await supabase.from("product_images").update({ is_primary: true }).eq("id", imgId);
    fetchImages(editingProduct.id);
  };

  /* ── Delete product ── */
  const deleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error?.code === "23503") {
      await supabase.from("products")
        .update({ is_active: false, stock_quantity: 0, updated_at: new Date().toISOString() })
        .eq("id", productId);
      toast({ title: "تمت الأرشفة", description: "المنتج مرتبط بطلبات، تم أرشفته" });
    } else if (!error) {
      toast({ title: "تم الحذف", description: "تم حذف المنتج" });
    }
    fetchProducts();
    if (mode === productId) closeForm();
  };

  /* ── Drag & Drop ── */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (editingProduct) {
      files.forEach(uploadImage);
    } else {
      files.forEach(stageImage);
    }
  };

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="flex gap-6 h-full">

      {/* ── LEFT: Products Table ──────────────────────────── */}
      <div className={`flex-1 space-y-4 ${mode ? "hidden lg:block lg:w-1/2 lg:flex-none" : ""}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">المنتجات ({products.length})</h2>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> إضافة منتج
          </Button>
        </div>

        {loadingList ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <Card className="py-16 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد منتجات حتى الآن</p>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الصورة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>المخزون</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p.id} className={mode === p.id ? "bg-primary/5" : ""}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={p.image_url || "/images/sevengreen-logo.webp"}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-[140px] truncate">{p.name}</TableCell>
                        <TableCell className="text-primary font-bold">{formatPrice(p.price)}</TableCell>
                        <TableCell>{p.stock_quantity ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={p.is_active ? "secondary" : "destructive"} className="text-xs">
                            {p.is_active ? "نشط" : "مخفي"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── RIGHT: Product Form ───────────────────────────── */}
      {mode && (
        <div className="w-full lg:w-[560px] shrink-0 space-y-4">
          {/* Form Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={closeForm} className="lg:hidden p-1 hover:bg-gray-100 rounded">
                <ArrowRight className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">
                {mode === "create" ? "إضافة منتج جديد" : "تعديل المنتج"}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={closeForm} className="hidden lg:flex gap-1">
              <X className="w-4 h-4" /> إغلاق
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ─ Section 1: Basic Info ─ */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-700">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>اسم المنتج *</Label>
                    <Input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="صابونة سفن جرين..."
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>السعر ({getCurrentCurrency().symbol}) *</Label>
                    <Input
                      type="number" step="0.01" min="0"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="71"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>كمية المخزون</Label>
                    <Input
                      type="number" min="0"
                      value={form.stock_quantity}
                      onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>رابط الصورة الرئيسية (اختياري)</Label>
                    <Input
                      type="url"
                      value={form.image_url}
                      onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {form.is_active ? "المنتج نشط (مرئي للعملاء)" : "المنتج مخفي"}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* ─ Section 2: Description ─ */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-700">الوصف</CardTitle>
                  <Button
                    type="button" variant="outline" size="sm"
                    onClick={generateDesc} disabled={generatingDesc}
                    className="gap-1.5 text-xs"
                  >
                    {generatingDesc
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Sparkles className="h-3.5 w-3.5" />
                    }
                    {generatingDesc ? "جاري التوليد..." : "توليد بالذكاء الاصطناعي"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={aiKeywords}
                  onChange={e => setAiKeywords(e.target.value)}
                  placeholder="كلمات مفتاحية للذكاء الاصطناعي: طبيعي، للشعر، تساقط..."
                  className="text-sm"
                />
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="اكتب وصف المنتج يدوياً أو ولّده بالذكاء الاصطناعي..."
                />
              </CardContent>
            </Card>

            {/* ─ Section 3: Images ─ */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  الصور
                  {mode === "create" && stagedImages.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{stagedImages.length} جاهزة للرفع</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 hover:border-primary/50 rounded-xl p-6 text-center transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 font-medium">
                    {uploading ? "جاري الرفع..." : "اسحب الصور هنا أو اضغط للاختيار"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG، JPG، WEBP — أكثر من صورة مسموح</p>
                  {uploading && <Loader2 className="w-5 h-5 animate-spin mx-auto mt-2 text-primary" />}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    if (editingProduct) files.forEach(uploadImage);
                    else files.forEach(stageImage);
                    e.target.value = "";
                  }}
                />

                {/* Staged images (new product, not yet uploaded) */}
                {mode === "create" && stagedImages.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">ستُرفع هذه الصور بعد حفظ المنتج:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {stagedImages.map((s, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                          <img src={s.preview} alt="" className="w-full h-full object-cover" />
                          {i === 0 && (
                            <span className="absolute top-1 right-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">رئيسية</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeStagedImage(i)}
                            className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing product images */}
                {editingProduct && (
                  loadingImgs ? (
                    <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                  ) : images.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">لا توجد صور بعد</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {images.map(img => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                          <img
                            src={img.image_url} alt={img.alt_text || ""}
                            className="w-full h-full object-cover"
                          />
                          {img.is_primary && (
                            <span className="absolute top-1 right-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">رئيسية</span>
                          )}
                          {/* Actions overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {!img.is_primary && (
                              <button
                                type="button"
                                onClick={() => setPrimary(img.id)}
                                title="تعيين كرئيسية"
                                className="bg-yellow-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-yellow-600"
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteImage(img)}
                              title="حذف"
                              className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* ─ Save Button ─ */}
            <div className="flex gap-3 pb-6">
              <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "جاري الحفظ..." : (mode === "create" ? "إضافة المنتج" : "حفظ التغييرات")}
              </Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
