import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FolderOpen, 
  Folder, 
  ChevronRight,
  ChevronDown,
  Move3D,
  AlertTriangle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Category, CategoryTree } from '../../types/blog';

interface CategoriesManagementProps {
  categories: Category[];
  articles: any[];
  getCategoryTree: () => CategoryTree[];
  canDeleteCategory: (id: string) => boolean;
  getCategoryPath: (id: string) => string;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  moveCategory: (categoryId: string, newParentId?: string, newOrder?: number) => void;
}

export function CategoriesManagement({
  categories,
  articles,
  getCategoryTree,
  canDeleteCategory,
  getCategoryPath,
  addCategory,
  updateCategory,
  deleteCategory,
  moveCategory
}: CategoriesManagementProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalType, setModalType] = useState<'create-main' | 'create-sub' | 'edit'>('create-main');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');

  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    parentId: '',
    order: 1
  });

  const categoryTree = getCategoryTree();
  const mainCategories = categories.filter(cat => !cat.parentId);

  // 展開/收合分類
  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      parentId: '',
      order: 1
    });
    setEditingCategory(null);
    setSelectedParent('');
  };

  // 開啟新增主分類對話框
  const openCreateMainModal = () => {
    resetForm();
    setModalType('create-main');
    setIsModalOpen(true);
  };

  // 開啟新增子分類對話框
  const openCreateSubModal = (parentId: string) => {
    resetForm();
    const parentCategory = categories.find(cat => cat.id === parentId);
    const subCategories = categories.filter(cat => cat.parentId === parentId);
    
    setFormData({
      name: '',
      description: '',
      color: parentCategory?.color || '#3B82F6',
      parentId: parentId,
      order: subCategories.length + 1
    });
    setSelectedParent(parentId);
    setModalType('create-sub');
    setIsModalOpen(true);
  };

  // 開啟編輯對話框
  const openEditModal = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      parentId: category.parentId || '',
      order: category.order
    });
    setEditingCategory(category);
    setModalType('edit');
    setIsModalOpen(true);
  };

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalType === 'edit' && editingCategory) {
        updateCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description,
          color: formData.color,
          order: formData.order
        });
      } else {
        addCategory({
          name: formData.name,
          description: formData.description,
          color: formData.color,
          parentId: formData.parentId || undefined,
          order: formData.order
        });
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失敗');
    }
  };

  // 刪除分類
  const handleDelete = (categoryId: string) => {
    if (deleteConfirm !== categoryId) {
      setDeleteConfirm(categoryId);
      setTimeout(() => setDeleteConfirm(''), 3000); // 3秒後清除確認狀態
      return;
    }

    try {
      deleteCategory(categoryId);
      setDeleteConfirm('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '刪除失敗');
      setDeleteConfirm('');
    }
  };

  // 計算分類下的文章數量
  const getArticleCount = (categoryId: string): number => {
    return articles.filter(article => article.categoryId === categoryId).length;
  };

  // 計算主分類下的總文章數（包含所有子分類）
  const getTotalArticleCount = (mainCategoryId: string): number => {
    const subCategories = categories.filter(cat => cat.parentId === mainCategoryId);
    return subCategories.reduce((total, subCat) => total + getArticleCount(subCat.id), 0);
  };

  const colorOptions = [
    '#3B82F6', // 藍色
    '#F59E0B', // 黃色
    '#8B5CF6', // 紫色
    '#10B981', // 綠色
    '#EF4444', // 紅色
    '#6B7280', // 灰色
    '#EC4899', // 粉色
    '#14B8A6', // 藍綠色
  ];

  return (
    <AdminLayout currentView="categories">
      <div className="space-y-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">分類管理</h1>
            <p className="text-gray-600 mt-1">管理文章分類，支援兩層階層結構</p>
          </div>
          <button
            onClick={openCreateMainModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>新增主分類</span>
          </button>
        </div>

        {/* 分類樹狀結構 */}
        <div className="bg-white rounded-xl shadow-sm">
          {categoryTree.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {categoryTree.map((mainCatTree) => (
                <div key={mainCatTree.category.id}>
                  {/* 主分類 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* 展開/收合按鈕 */}
                        <button
                          onClick={() => toggleExpanded(mainCatTree.category.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedCategories.has(mainCatTree.category.id) ? (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </button>

                        {/* 分類資訊 */}
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: mainCatTree.category.color }}
                          />
                          <FolderOpen className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {mainCatTree.category.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {mainCatTree.category.description}
                            </p>
                          </div>
                        </div>

                        {/* 統計資訊 */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{mainCatTree.children.length} 個子分類</span>
                          <span>{getTotalArticleCount(mainCatTree.category.id)} 篇文章</span>
                        </div>
                      </div>

                      {/* 操作按鈕 */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openCreateSubModal(mainCatTree.category.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="新增子分類"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(mainCatTree.category)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="編輯分類"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mainCatTree.category.id)}
                          disabled={!canDeleteCategory(mainCatTree.category.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            canDeleteCategory(mainCatTree.category.id)
                              ? deleteConfirm === mainCatTree.category.id 
                                ? 'text-red-600 bg-red-50' 
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={
                            canDeleteCategory(mainCatTree.category.id)
                              ? deleteConfirm === mainCatTree.category.id 
                                ? '再次點擊確認刪除' 
                                : '刪除分類'
                              : '請先刪除子分類和文章'
                          }
                        >
                          {deleteConfirm === mainCatTree.category.id ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 子分類列表 */}
                    {expandedCategories.has(mainCatTree.category.id) && mainCatTree.children.length > 0 && (
                      <div className="mt-4 ml-12 space-y-3">
                        {mainCatTree.children.map((subCatTree) => (
                          <div 
                            key={subCatTree.category.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: subCatTree.category.color }}
                              />
                              <Folder className="h-4 w-4 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {subCatTree.category.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {subCatTree.category.description}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {getArticleCount(subCatTree.category.id)} 篇文章
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openEditModal(subCatTree.category)}
                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="編輯子分類"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(subCatTree.category.id)}
                                disabled={!canDeleteCategory(subCatTree.category.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  canDeleteCategory(subCatTree.category.id)
                                    ? deleteConfirm === subCatTree.category.id 
                                      ? 'text-red-600 bg-red-50' 
                                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                                title={
                                  canDeleteCategory(subCatTree.category.id)
                                    ? deleteConfirm === subCatTree.category.id 
                                      ? '再次點擊確認刪除' 
                                      : '刪除子分類'
                                    : '請先刪除文章'
                                }
                              >
                                {deleteConfirm === subCatTree.category.id ? (
                                  <AlertTriangle className="h-3 w-3" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">尚未建立任何分類</p>
              <button
                onClick={openCreateMainModal}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                建立第一個分類
              </button>
            </div>
          )}
        </div>

        {/* 新增/編輯分類對話框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-90vw max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {modalType === 'edit' ? '編輯分類' : 
                 modalType === 'create-sub' ? '新增子分類' : '新增主分類'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分類名稱
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="輸入分類名稱"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分類描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="輸入分類描述"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分類顏色
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({...formData, color})}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {modalType === 'create-sub' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      父分類
                    </label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {categories.find(cat => cat.id === selectedParent)?.name}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排序
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {modalType === 'edit' ? '更新' : '建立'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}