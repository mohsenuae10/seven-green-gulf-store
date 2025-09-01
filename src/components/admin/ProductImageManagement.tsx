import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Edit2, Star, StarOff, Image, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
}

const ProductImageManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchProductImages();
    }
  }, [selectedProductId]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
      
      if (data && data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المنتجات',
        variant: 'destructive',
      });
    }
  };

  const fetchProductImages = async () => {
    if (!selectedProductId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', selectedProductId)
        .order('display_order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching product images:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل صور المنتج',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!selectedProductId) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار منتج أولاً',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedProductId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const nextOrder = Math.max(...images.map(img => img.display_order), -1) + 1;
      const isPrimary = images.length === 0;

      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: selectedProductId,
          image_url: publicUrl,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          display_order: nextOrder,
          is_primary: isPrimary
        });

      if (dbError) throw dbError;

      await fetchProductImages();
      toast({
        title: 'تم الرفع',
        description: 'تم رفع الصورة بنجاح',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في رفع الصورة',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const fileName = imageUrl.split('/').slice(-2).join('/');
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      await fetchProductImages();
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الصورة بنجاح',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الصورة',
        variant: 'destructive',
      });
    }
  };

  const updateImage = async () => {
    if (!editingImage) return;

    try {
      const { error } = await supabase
        .from('product_images')
        .update({
          alt_text: editAltText,
          display_order: editOrder
        })
        .eq('id', editingImage.id);

      if (error) throw error;

      await fetchProductImages();
      setEditingImage(null);
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الصورة بنجاح',
      });
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الصورة',
        variant: 'destructive',
      });
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    try {
      // Remove primary status from all images
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', selectedProductId);

      // Set new primary image
      const { error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      await fetchProductImages();
      toast({
        title: 'تم التحديث',
        description: 'تم تعيين الصورة الرئيسية',
      });
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تعيين الصورة الرئيسية',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (image: ProductImage) => {
    setEditingImage(image);
    setEditAltText(image.alt_text);
    setEditOrder(image.display_order);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">إدارة صور المنتجات</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اختيار المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger>
              <SelectValue placeholder="اختر منتج" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProductId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              صور المنتج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {uploading ? 'جاري الرفع...' : 'اختر صورة للرفع'}
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file);
                      }}
                      className="sr-only"
                      disabled={uploading}
                    />
                  </div>
                  {uploading && <Loader2 className="mx-auto mt-2 h-4 w-4 animate-spin" />}
                </div>
              </div>

              {/* Images Grid */}
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={image.image_url}
                          alt={image.alt_text}
                          className="w-full h-48 object-cover"
                        />
                        {image.is_primary && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            رئيسية
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">{image.alt_text}</p>
                          <p className="text-xs text-gray-500">ترتيب العرض: {image.display_order}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(image)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPrimaryImage(image.id)}
                              disabled={image.is_primary}
                            >
                              {image.is_primary ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteImage(image.id, image.image_url)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {images.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد صور لهذا المنتج
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Image Dialog */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحرير الصورة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingImage && (
              <img
                src={editingImage.image_url}
                alt={editingImage.alt_text}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <div>
              <Label htmlFor="edit-alt-text">النص البديل</Label>
              <Input
                id="edit-alt-text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-order">ترتيب العرض</Label>
              <Input
                id="edit-order"
                type="number"
                value={editOrder}
                onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={updateImage}>
                حفظ التغييرات
              </Button>
              <Button variant="outline" onClick={() => setEditingImage(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageManagement;