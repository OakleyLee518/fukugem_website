import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Image,
  FileText,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RichTextEditor } from '../../components/public/RichTextEditor';
import { Article, Category } from '../../types/blog';

interface ArticleEditorProps {
  article?: Article; // undefined 表示新增文章
  categories: Category[];
  getSubCategories: (parentId?: string) => Category[];
  getCategoryPath: (categoryId: string) => string;
  addArticle?: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => Article;
  updateArticle?: (id: string, updates: Partial<Article>) => void;
}

export function ArticleEditor({
  article,
  categories,
  getSubCategories,
  getCategoryPath,
  addArticle,
  updateArticle
}: ArticleEditorProps) {
  const isEditing = !!article;
  const subCategories = getSubCategories();

  // 表單狀態
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tags: [] as string[],
    author: 'Admin',
    imageUrl: '',
    published: false
  });

  // UI 狀態
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // 如果是編輯模式，載入文章資料
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        categoryId: article.categoryId,
        tags: [...article.tags],
        author: article.author,
        imageUrl: article.imageUrl || '',
        published: article.published
      });
    }
  }, [article]);

  // 監聽表單變化
  useEffect(() => {
    if (isEditing) {
      setIsDirty(true);
    }
  }, [formData, isEditing]);

  // 表單驗證
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = '請輸入文章標題';
    }

    if (!formData.content.trim()) {
      newErrors.content = '請輸入文章內容';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '請選擇文章分類';
    }

    if (!formData.author.trim()) {
      newErrors.author = '請輸入作者名稱';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 自動生成摘要
  const generateExcerpt = () => {
    if (formData.content) {
      const div = document.createElement('div');
      div.innerHTML = formData.content;
      const text = div.textContent || div.innerText || '';
      const excerpt = text.substring(0, 150) + (text.length > 150 ? '...' : '');
      setFormData(prev => ({ ...prev, excerpt }));
    }
  };

  // 新增標籤
  const addTag = () => {
    const tag = currentTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setCurrentTag('');
    }
  };

  // 移除標籤
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 處理圖片上傳 (模擬)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案');
      return;
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片檔案不能超過 5MB');
      return;
    }

    setIsUploading(true);

    // 模擬上傳過程
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        // 這裡模擬上傳成功，實際上應該上傳到伺服器
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({ ...prev, imageUrl }));
        setIsUploading(false);
        setShowImageUpload(false);
        
        // 實際應用中，這裡會是：
        // uploadImage(file).then(url => setFormData(prev => ({ ...prev, imageUrl: url })))
      }, 1500); // 模擬網路延遲
    };
    reader.readAsDataURL(file);
  };

  // 儲存文章
  const handleSave = async (publishNow: boolean = false) => {
    if (!validateForm()) {
      return;
    }

    try {
      const articleData = {
        ...formData,
        published: publishNow,
        // 如果沒有摘要，自動生成
        excerpt: formData.excerpt.trim() || (() => {
          const div = document.createElement('div');
          div.innerHTML = formData.content;
          const text = div.textContent || div.innerText || '';
          return text.substring(0, 150) + (text.length > 150 ? '...' : '');
        })()
      };

      if (isEditing && article && updateArticle) {
        updateArticle(article.id, articleData);
      } else if (!isEditing && addArticle) {
        addArticle(articleData);
      }

      // 成功後導航回文章列表
      window.location.href = '/admin/articles';
    } catch (error) {
      alert('儲存失敗，請重試');
      console.error('Save error:', error);
    }
  };

  // 預覽文章
  const handlePreview = () => {
    if (isEditing && article) {
      window.open(`/article/${article.id}`, '_blank');
    } else {
      alert('請先儲存文章才能預覽');
    }
  };

  // 返回文章列表
  const handleBack = () => {
    if (isDirty && !window.confirm('有未儲存的變更，確定要離開嗎？')) {
      return;
    }
    window.location.href = '/admin/articles';
  };

  return (
    <AdminLayout currentView="articles">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 頁面標題和操作 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? '編輯文章' : '新增文章'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? `編輯「${article?.title}」` : '建立新的文章內容'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing && (
              <button
                onClick={handlePreview}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                <span>預覽</span>
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Save className="h-4 w-4" />
              <span>儲存草稿</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Eye className="h-4 w-4" />
              <span>發布</span>
            </button>
          </div>
        </div>

        {/* 主要編輯表單 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：主要內容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 文章標題 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">文章標題</h2>
              </div>
              <input
                type="text"
                placeholder="輸入引人入勝的標題..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </div>
              )}
            </div>

            {/* 文章封面 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">文章封面</h2>
                </div>
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  <span>上傳圖片</span>
                </button>
              </div>

              {formData.imageUrl ? (
                <div className="relative">
                  <img
                    src={formData.imageUrl}
                    alt="文章封面"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setShowImageUpload(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer"
                >
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">點擊上傳封面圖片</p>
                  <p className="text-gray-400 text-sm mt-1">支援 JPG、PNG 格式，檔案大小不超過 5MB</p>
                </div>
              )}
            </div>

            {/* 文章內容 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">文章內容</h2>
              </div>
              <div className={`border rounded-lg ${errors.content ? 'border-red-500' : 'border-gray-300'}`}>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
              </div>
              {errors.content && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.content}
                </div>
              )}
            </div>

            {/* 文章摘要 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">文章摘要</h2>
                </div>
                <button
                  onClick={generateExcerpt}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  自動生成
                </button>
              </div>
              <textarea
                placeholder="簡短描述這篇文章的重點內容..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-gray-500 text-sm mt-2">
                {formData.excerpt.length}/200 字元
              </p>
            </div>
          </div>

          {/* 右側：設定選項 */}
          <div className="space-y-6">
            {/* 發布設定 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">發布設定</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.author && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.author}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    發布狀態
                  </label>
                  <select
                    value={formData.published ? 'published' : 'draft'}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      published: e.target.value === 'published' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已發布</option>
                  </select>
                </div>

                {isEditing && article && (
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>建立時間：{new Date(article.createdAt).toLocaleString('zh-TW')}</p>
                    <p>更新時間：{new Date(article.updatedAt).toLocaleString('zh-TW')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 分類設定 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">文章分類</h2>
              </div>
              
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">請選擇分類</option>
                {subCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {getCategoryPath(category.id)}
                  </option>
                ))}
              </select>
              
              {errors.categoryId && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.categoryId}
                </div>
              )}

              {formData.categoryId && (
                <div className="mt-3">
                  {(() => {
                    const selectedCategory = categories.find(c => c.id === formData.categoryId);
                    return selectedCategory && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedCategory.color }}
                        />
                        <span>{getCategoryPath(selectedCategory.id)}</span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* 標籤設定 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Tag className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">文章標籤</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="輸入標籤名稱"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 圖片上傳對話框 */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">上傳封面圖片</h3>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={isUploading}
                />

                <div className="text-sm text-gray-500">
                  <p>• 支援格式：JPG、PNG</p>
                  <p>• 檔案大小：最大 5MB</p>
                  <p>• 建議尺寸：1200×630 像素</p>
                </div>

                {isUploading && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-2">上傳中...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}