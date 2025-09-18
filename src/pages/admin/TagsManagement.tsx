import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag as TagIcon,
  AlertTriangle,
  TrendingUp,
  Hash,
  Merge
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Article, Tag } from '../../types/blog';

interface TagsManagementProps {
  articles: Article[];
  getAllTags: () => Tag[];
  updateArticle: (id: string, updates: Partial<Article>) => void;
}

export function TagsManagement({
  articles,
  getAllTags,
  updateArticle
}: TagsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');
  const [editingTag, setEditingTag] = useState<string>('');
  const [newTagName, setNewTagName] = useState('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeSourceTag, setMergeSourceTag] = useState<string>('');
  const [mergeTargetTag, setMergeTargetTag] = useState<string>('');

  const allTags = getAllTags();

  // 篩選標籤
  const filteredTags = useMemo(() => {
    return allTags
      .filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.count - a.count); // 按使用次數排序
  }, [allTags, searchTerm]);

  // 取得標籤統計
  const tagStats = useMemo(() => {
    const totalTags = allTags.length;
    const totalUsages = allTags.reduce((sum, tag) => sum + tag.count, 0);
    const mostUsedTag = allTags.reduce((max, tag) => 
      tag.count > max.count ? tag : max, allTags[0] || { name: '無', count: 0 }
    );
    const unusedTags = allTags.filter(tag => tag.count === 0).length;

    return { totalTags, totalUsages, mostUsedTag, unusedTags };
  }, [allTags]);

  // 重新命名標籤
  const handleRenameTag = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName.trim()) {
      setEditingTag('');
      setNewTagName('');
      return;
    }

    // 檢查新標籤名稱是否已存在
    if (allTags.some(tag => tag.name.toLowerCase() === newName.trim().toLowerCase())) {
      alert('標籤名稱已存在');
      return;
    }

    // 更新所有使用此標籤的文章
    articles.forEach(article => {
      if (article.tags.includes(oldName)) {
        const updatedTags = article.tags.map(tag => 
          tag === oldName ? newName.trim() : tag
        );
        updateArticle(article.id, { tags: updatedTags });
      }
    });

    setEditingTag('');
    setNewTagName('');
  };

  // 刪除標籤
  const handleDeleteTag = (tagName: string) => {
    if (deleteConfirm !== tagName) {
      setDeleteConfirm(tagName);
      setTimeout(() => setDeleteConfirm(''), 3000);
      return;
    }

    // 從所有文章中移除此標籤
    articles.forEach(article => {
      if (article.tags.includes(tagName)) {
        const updatedTags = article.tags.filter(tag => tag !== tagName);
        updateArticle(article.id, { tags: updatedTags });
      }
    });

    setDeleteConfirm('');
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      newSet.delete(tagName);
      return newSet;
    });
  };

  // 批量刪除標籤
  const handleBatchDelete = () => {
    if (!window.confirm(`確定要刪除 ${selectedTags.size} 個標籤嗎？`)) {
      return;
    }

    selectedTags.forEach(tagName => {
      articles.forEach(article => {
        if (article.tags.includes(tagName)) {
          const updatedTags = article.tags.filter(tag => tag !== tagName);
          updateArticle(article.id, { tags: updatedTags });
        }
      });
    });

    setSelectedTags(new Set());
  };

  // 合併標籤
  const handleMergeTags = () => {
    if (!mergeSourceTag || !mergeTargetTag) {
      alert('請選擇要合併的標籤');
      return;
    }

    if (mergeSourceTag === mergeTargetTag) {
      alert('不能合併相同的標籤');
      return;
    }

    // 將所有使用來源標籤的文章改為使用目標標籤
    articles.forEach(article => {
      if (article.tags.includes(mergeSourceTag)) {
        let updatedTags = article.tags.filter(tag => tag !== mergeSourceTag);
        if (!updatedTags.includes(mergeTargetTag)) {
          updatedTags.push(mergeTargetTag);
        }
        updateArticle(article.id, { tags: updatedTags });
      }
    });

    setShowMergeModal(false);
    setMergeSourceTag('');
    setMergeTargetTag('');
  };

  // 選擇/取消選擇標籤
  const toggleSelectTag = (tagName: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tagName)) {
        newSet.delete(tagName);
      } else {
        newSet.add(tagName);
      }
      return newSet;
    });
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    if (selectedTags.size === filteredTags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(filteredTags.map(tag => tag.name)));
    }
  };

  // 取得標籤使用的文章
  const getTagArticles = (tagName: string) => {
    return articles.filter(article => article.tags.includes(tagName));
  };

  return (
    <AdminLayout currentView="tags">
      <div className="space-y-6">
        {/* 頁面標題 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">標籤管理</h1>
          <p className="text-gray-600 mt-1">管理文章標籤、重新命名和合併標籤</p>
        </div>

        {/* 統計資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-3">
                <TagIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總標籤數</p>
                <p className="text-2xl font-bold text-gray-900">{tagStats.totalTags}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總使用次數</p>
                <p className="text-2xl font-bold text-gray-900">{tagStats.totalUsages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <Hash className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">最熱門標籤</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {tagStats.mostUsedTag.name}
                </p>
                <p className="text-xs text-gray-500">{tagStats.mostUsedTag.count} 次使用</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">未使用標籤</p>
                <p className="text-2xl font-bold text-gray-900">{tagStats.unusedTags}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜尋和操作 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* 搜尋框 */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="搜尋標籤..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center space-x-3">
              {selectedTags.size > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    已選擇 {selectedTags.size} 個標籤
                  </span>
                  <button
                    onClick={handleBatchDelete}
                    className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"
                  >
                    批量刪除
                  </button>
                </>
              )}
              <button
                onClick={() => setShowMergeModal(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                <Merge className="h-4 w-4" />
                <span>合併標籤</span>
              </button>
            </div>
          </div>
        </div>

        {/* 標籤列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredTags.length > 0 ? (
            <>
              {/* 表頭 */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.size === filteredTags.length && filteredTags.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                  />
                  <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">標籤名稱</div>
                    <div className="col-span-2">使用次數</div>
                    <div className="col-span-3">相關文章</div>
                    <div className="col-span-2 text-right">操作</div>
                  </div>
                </div>
              </div>

              {/* 標籤列表 */}
              <div className="divide-y divide-gray-200">
                {filteredTags.map((tag) => (
                  <div key={tag.name} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.has(tag.name)}
                        onChange={() => toggleSelectTag(tag.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                      />
                      
                      <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                        {/* 標籤名稱 */}
                        <div className="col-span-5">
                          {editingTag === tag.name ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameTag(tag.name, newTagName);
                                  }
                                }}
                                onBlur={() => handleRenameTag(tag.name, newTagName)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                #{tag.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 使用次數 */}
                        <div className="col-span-2">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              tag.count === 0 ? 'text-red-600' : 
                              tag.count >= 10 ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {tag.count}
                            </span>
                            {tag.count >= 10 && (
                              <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                            )}
                          </div>
                        </div>

                        {/* 相關文章 */}
                        <div className="col-span-3">
                          <div className="flex flex-wrap gap-1">
                            {getTagArticles(tag.name).slice(0, 3).map((article) => (
                              <span
                                key={article.id}
                                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded truncate max-w-20"
                                title={article.title}
                              >
                                {article.title}
                              </span>
                            ))}
                            {getTagArticles(tag.name).length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{getTagArticles(tag.name).length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 操作按鈕 */}
                        <div className="col-span-2 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingTag(tag.name);
                              setNewTagName(tag.name);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                            title="重新命名"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.name)}
                            className={`p-1 rounded ${
                              deleteConfirm === tag.name
                                ? 'text-red-600 bg-red-50'
                                : 'text-gray-400 hover:text-red-600'
                            }`}
                            title={deleteConfirm === tag.name ? '再次點擊確認刪除' : '刪除標籤'}
                          >
                            {deleteConfirm === tag.name ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? '沒有找到符合的標籤' : '還沒有任何標籤'}
              </p>
              {!searchTerm && (
                <p className="text-gray-400 text-sm mt-2">
                  建立文章時會自動生成標籤
                </p>
              )}
            </div>
          )}
        </div>

        {/* 合併標籤對話框 */}
        {showMergeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">合併標籤</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    來源標籤（將被刪除）
                  </label>
                  <select
                    value={mergeSourceTag}
                    onChange={(e) => setMergeSourceTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選擇標籤</option>
                    {allTags.map(tag => (
                      <option key={tag.name} value={tag.name}>
                        #{tag.name} ({tag.count} 次使用)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目標標籤（將保留）
                  </label>
                  <select
                    value={mergeTargetTag}
                    onChange={(e) => setMergeTargetTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選擇標籤</option>
                    {allTags.map(tag => (
                      <option key={tag.name} value={tag.name}>
                        #{tag.name} ({tag.count} 次使用)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      來源標籤將被完全刪除，其文章將使用目標標籤
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMergeModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  onClick={handleMergeTags}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  合併標籤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}