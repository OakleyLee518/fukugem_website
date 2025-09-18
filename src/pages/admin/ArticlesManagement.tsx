import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Tag,
  Filter,
  MoreVertical,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Article, Category } from '../../types/blog';

interface ArticlesManagementProps {
  articles: Article[];
  categories: Category[];
  getSubCategories: (parentId?: string) => Category[];
  getCategoryPath: (categoryId: string) => string;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
}

export function ArticlesManagement({
  articles,
  categories,
  getSubCategories,
  getCategoryPath,
  updateArticle,
  deleteArticle
}: ArticlesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<string>('');

  // 取得所有子分類（文章只能歸類到子分類）
  const subCategories = getSubCategories();

  // 篩選文章
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 搜尋篩選
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 分類篩選
      const matchesCategory = !selectedCategory || article.categoryId === selectedCategory;
      
      // 狀態篩選
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'published' && article.published) ||
                           (statusFilter === 'draft' && !article.published);
      
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, searchTerm, selectedCategory, statusFilter]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 提取文字內容
  const extractTextFromHTML = (html: string, maxLength: number = 100) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 切換文章發布狀態
  const togglePublishStatus = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      updateArticle(articleId, { published: !article.published });
    }
  };

  // 刪除文章
  const handleDelete = (articleId: string) => {
    if (deleteConfirm !== articleId) {
      setDeleteConfirm(articleId);
      setTimeout(() => setDeleteConfirm(''), 3000);
      return;
    }

    deleteArticle(articleId);
    setDeleteConfirm('');
    setSelectedArticles(prev => {
      const newSet = new Set(prev);
      newSet.delete(articleId);
      return newSet;
    });
  };

  // 批量操作
  const handleBatchPublish = (published: boolean) => {
    selectedArticles.forEach(articleId => {
      updateArticle(articleId, { published });
    });
    setSelectedArticles(new Set());
  };

  const handleBatchDelete = () => {
    if (window.confirm(`確定要刪除 ${selectedArticles.size} 篇文章嗎？`)) {
      selectedArticles.forEach(articleId => {
        deleteArticle(articleId);
      });
      setSelectedArticles(new Set());
    }
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map(a => a.id)));
    }
  };

  // 選擇單篇文章
  const toggleSelectArticle = (articleId: string) => {
    setSelectedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  // 導航到編輯頁面
  const navigateToEdit = (articleId: string) => {
    window.location.href = `/admin/articles/edit/${articleId}`;
  };

  // 導航到新增頁面
  const navigateToNew = () => {
    window.location.href = '/admin/articles/new';
  };

  // 預覽文章
  const previewArticle = (articleId: string) => {
    window.open(`/article/${articleId}`, '_blank');
  };

  const getStatusBadge = (published: boolean) => {
    return published ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        <Eye className="h-3 w-3 mr-1" />
        已發布
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        <EyeOff className="h-3 w-3 mr-1" />
        草稿
      </span>
    );
  };

  return (
    <AdminLayout currentView="articles">
      <div className="space-y-6">
        {/* 頁面標題和操作 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
            <p className="text-gray-600 mt-1">
              共 {articles.length} 篇文章，{articles.filter(a => a.published).length} 篇已發布
            </p>
          </div>
          <button
            onClick={navigateToNew}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>新增文章</span>
          </button>
        </div>

        {/* 搜尋和篩選 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜尋框 */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="搜尋文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 分類篩選 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分類</option>
              {subCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category.id)}
                </option>
              ))}
            </select>

            {/* 狀態篩選 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部狀態</option>
              <option value="published">已發布</option>
              <option value="draft">草稿</option>
            </select>

            {/* 批量操作 */}
            {selectedArticles.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  已選擇 {selectedArticles.size} 篇
                </span>
                <button
                  onClick={() => handleBatchPublish(true)}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                >
                  批量發布
                </button>
                <button
                  onClick={() => handleBatchPublish(false)}
                  className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                >
                  轉為草稿
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  批量刪除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      文章
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分類
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新時間
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((article) => {
                    const category = categories.find(c => c.id === article.categoryId);
                    return (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedArticles.has(article.id)}
                            onChange={() => toggleSelectArticle(article.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-4">
                            {article.imageUrl && (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {article.excerpt || extractTextFromHTML(article.content)}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  作者：{article.author}
                                </span>
                                {article.tags.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Tag className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {article.tags.slice(0, 2).join(', ')}
                                      {article.tags.length > 2 && `+${article.tags.length - 2}`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {category && (
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm text-gray-900">
                                {getCategoryPath(category.id)}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(article.published)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(article.updatedAt)}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setDropdownOpen(dropdownOpen === article.id ? '' : article.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {dropdownOpen === article.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                  onClick={() => {
                                    previewArticle(article.id);
                                    setDropdownOpen('');
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  預覽文章
                                </button>
                                <button
                                  onClick={() => {
                                    navigateToEdit(article.id);
                                    setDropdownOpen('');
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  編輯文章
                                </button>
                                <button
                                  onClick={() => {
                                    togglePublishStatus(article.id);
                                    setDropdownOpen('');
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  {article.published ? (
                                    <>
                                      <EyeOff className="h-4 w-4 mr-2" />
                                      轉為草稿
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4 mr-2" />
                                      發布文章
                                    </>
                                  )}
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                  onClick={() => {
                                    handleDelete(article.id);
                                    setDropdownOpen('');
                                  }}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center ${
                                    deleteConfirm === article.id 
                                      ? 'text-red-700 bg-red-50' 
                                      : 'text-red-600'
                                  }`}
                                >
                                  {deleteConfirm === article.id ? (
                                    <>
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      確認刪除？
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      刪除文章
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">
                {searchTerm || selectedCategory || statusFilter !== 'all' 
                  ? '沒有符合條件的文章' 
                  : '還沒有任何文章'
                }
              </p>
              {!searchTerm && !selectedCategory && statusFilter === 'all' && (
                <button
                  onClick={navigateToNew}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  建立第一篇文章
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 點擊其他地方關閉下拉選單 */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen('')}
        />
      )}
    </AdminLayout>
  );
}