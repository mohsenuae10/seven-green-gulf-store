import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

interface SiteContent {
  id: string;
  section: string;
  title: string;
  description: string;
  content: any;
}

const ContentManagement = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section');

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المحتوى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (sectionId: string, field: string, value: any) => {
    setSaving(sectionId);
    try {
      const content = contents.find(c => c.id === sectionId);
      if (!content) return;

      let updateData: any = {};
      
      if (field === 'content') {
        updateData.content = value;
      } else {
        updateData[field] = value;
      }

      const { error } = await supabase
        .from('site_content')
        .update(updateData)
        .eq('id', sectionId);

      if (error) throw error;

      setContents(prev => prev.map(c => 
        c.id === sectionId ? { ...c, ...updateData } : c
      ));

      toast({
        title: 'تم الحفظ',
        description: 'تم تحديث المحتوى بنجاح',
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث المحتوى',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const updateNestedContent = async (sectionId: string, path: string, value: any) => {
    const content = contents.find(c => c.id === sectionId);
    if (!content) return;

    const updatedContent = { ...content.content };
    const keys = path.split('.');
    let current = updatedContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    await updateContent(sectionId, 'content', updatedContent);
  };

  const updateArrayContent = async (sectionId: string, arrayPath: string, index: number, value: string) => {
    const content = contents.find(c => c.id === sectionId);
    if (!content) return;

    const updatedContent = { ...content.content };
    const array = [...(updatedContent[arrayPath] || [])];
    array[index] = value;
    updatedContent[arrayPath] = array;
    
    await updateContent(sectionId, 'content', updatedContent);
  };

  const addArrayItem = async (sectionId: string, arrayPath: string) => {
    const content = contents.find(c => c.id === sectionId);
    if (!content) return;

    const updatedContent = { ...content.content };
    const array = [...(updatedContent[arrayPath] || [])];
    array.push('عنصر جديد');
    updatedContent[arrayPath] = array;
    
    await updateContent(sectionId, 'content', updatedContent);
  };

  const removeArrayItem = async (sectionId: string, arrayPath: string, index: number) => {
    const content = contents.find(c => c.id === sectionId);
    if (!content) return;

    const updatedContent = { ...content.content };
    const array = [...(updatedContent[arrayPath] || [])];
    array.splice(index, 1);
    updatedContent[arrayPath] = array;
    
    await updateContent(sectionId, 'content', updatedContent);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">إدارة محتوى الموقع</h2>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">القسم الرئيسي</TabsTrigger>
          <TabsTrigger value="features">المميزات</TabsTrigger>
          <TabsTrigger value="about">عن المنتج</TabsTrigger>
          <TabsTrigger value="seo">تحسين SEO</TabsTrigger>
        </TabsList>

        {contents.map((content) => (
          <TabsContent key={content.id} value={content.section}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {content.title}
                  {saving === content.id && <Loader2 className="w-4 h-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* SEO Metadata Section */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-primary">🔍</span>
                    معلومات تحسين محركات البحث (SEO)
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor={`seo-title-${content.id}`} className="flex items-center gap-2">
                        عنوان SEO
                        <span className="text-xs text-muted-foreground">(يُفضل 50-60 حرف)</span>
                      </Label>
                      <Input
                        id={`seo-title-${content.id}`}
                        value={content.content?.seo_title || content.title}
                        onChange={(e) => updateNestedContent(content.id, 'seo_title', e.target.value)}
                        className="mt-1"
                        placeholder="عنوان محسّن لمحركات البحث"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(content.content?.seo_title || content.title || '').length}/60 حرف
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`seo-description-${content.id}`} className="flex items-center gap-2">
                        وصف SEO
                        <span className="text-xs text-muted-foreground">(يُفضل 150-160 حرف)</span>
                      </Label>
                      <Textarea
                        id={`seo-description-${content.id}`}
                        value={content.content?.seo_description || content.description}
                        onChange={(e) => updateNestedContent(content.id, 'seo_description', e.target.value)}
                        className="mt-1"
                        placeholder="وصف تفصيلي محسّن لمحركات البحث"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(content.content?.seo_description || content.description || '').length}/160 حرف
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`keywords-${content.id}`}>
                        الكلمات المفتاحية (مفصولة بفاصلة)
                      </Label>
                      <Input
                        id={`keywords-${content.id}`}
                        value={content.content?.keywords || ''}
                        onChange={(e) => updateNestedContent(content.id, 'keywords', e.target.value)}
                        className="mt-1"
                        placeholder="سفن جرين, شامبو طبيعي, علاج تساقط الشعر"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Content Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">المحتوى الأساسي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${content.id}`}>العنوان الرئيسي</Label>
                      <Input
                        id={`title-${content.id}`}
                        value={content.title}
                        onChange={(e) => updateContent(content.id, 'title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${content.id}`}>الوصف القصير</Label>
                      <Input
                        id={`description-${content.id}`}
                        value={content.description}
                        onChange={(e) => updateContent(content.id, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section Content */}
                {content.section === 'hero' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-lg">محتوى القسم الرئيسي</h3>
                    <div>
                      <Label>العنوان الفرعي</Label>
                      <Input
                        value={content.content?.subtitle || ''}
                        onChange={(e) => updateNestedContent(content.id, 'subtitle', e.target.value)}
                        className="mt-1"
                        placeholder="شامبو وصابونة طبيعية 100%"
                      />
                    </div>
                    <div>
                      <Label>الوصف التفصيلي</Label>
                      <Textarea
                        value={content.content?.description || ''}
                        onChange={(e) => updateNestedContent(content.id, 'description', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="وصف شامل عن المنتج وفوائده..."
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        المميزات الرئيسية
                        <span className="text-xs text-muted-foreground">(تظهر في القسم الرئيسي)</span>
                      </Label>
                      {content.content?.features?.map((feature: string, index: number) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateArrayContent(content.id, 'features', index, e.target.value)}
                            placeholder={`مميزة ${index + 1}`}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeArrayItem(content.id, 'features', index)}
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem(content.id, 'features')}
                        className="mt-2"
                      >
                        + إضافة مميزة جديدة
                      </Button>
                    </div>
                  </div>
                )}

                {/* Features Section Content */}
                {content.section === 'features' && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-4">فوائد المنتج</h3>
                    <Label className="flex items-center gap-2 mb-2">
                      قائمة الفوائد
                      <span className="text-xs text-muted-foreground">(تظهر في قسم المميزات)</span>
                    </Label>
                    {content.content?.benefits?.map((benefit: string, index: number) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={benefit}
                          onChange={(e) => updateArrayContent(content.id, 'benefits', index, e.target.value)}
                          placeholder={`فائدة ${index + 1}`}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(content.id, 'benefits', index)}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem(content.id, 'benefits')}
                      className="mt-2"
                    >
                      + إضافة فائدة جديدة
                    </Button>
                  </div>
                )}

                {/* About Section Content */}
                {content.section === 'about' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-lg">معلومات المنتج</h3>
                    <div>
                      <Label>المكونات الطبيعية</Label>
                      <Textarea
                        value={content.content?.ingredients || ''}
                        onChange={(e) => updateNestedContent(content.id, 'ingredients', e.target.value)}
                        className="mt-1"
                        rows={3}
                        placeholder="زيت الأرغان، الجينسنغ، فيتامين E، زيت جوز الهند..."
                      />
                    </div>
                    <div>
                      <Label>الشهادات والاعتمادات</Label>
                      <Input
                        value={content.content?.certification || ''}
                        onChange={(e) => updateNestedContent(content.id, 'certification', e.target.value)}
                        className="mt-1"
                        placeholder="معتمد من FDA، شهادة طبيعي 100%..."
                      />
                    </div>
                    <div>
                      <Label>بلد المنشأ</Label>
                      <Input
                        value={content.content?.origin || ''}
                        onChange={(e) => updateNestedContent(content.id, 'origin', e.target.value)}
                        className="mt-1"
                        placeholder="كوريا الجنوبية"
                      />
                    </div>
                  </div>
                )}

                {/* SEO Tips */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    💡 نصائح لتحسين SEO
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>استخدم الكلمات المفتاحية الرئيسية في العنوان والوصف</li>
                    <li>اجعل العنوان جذاباً وواضحاً (50-60 حرف)</li>
                    <li>اكتب وصف شامل ومفيد (150-160 حرف)</li>
                    <li>أضف كلمات مفتاحية متنوعة وذات صلة بالمنتج</li>
                    <li>تجنب الحشو الزائد للكلمات المفتاحية</li>
                  </ul>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-6 mt-6 border-t border-border">
                  <Button
                    onClick={() => {
                      toast({
                        title: '✅ تم الحفظ بنجاح',
                        description: 'تم حفظ جميع التغييرات والتحسينات',
                      });
                    }}
                    disabled={saving === content.id}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                    size="lg"
                  >
                    {saving === content.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    حفظ جميع التغييرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManagement;