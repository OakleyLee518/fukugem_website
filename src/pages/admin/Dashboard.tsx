import React from 'react';
import { FileText, FolderOpen, Tags, Eye, Plus } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Article, Category, Tag } from '../../types/blog';

interface DashboardProps {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
}

export function Dashboard({ articles, categories, tags }: DashboardProps) {
  const publishedArticles = articles.filter(article => article.published);
  const draftArticles = articles.filter(article => !article.published);
  
  // 計算統計數據
  const stats = [
    {
      title: '已發布文章',
      value: publishedArticles.length,
      icon: FileText,
      color: 'bg-blue-500',
      description: `${draftArticles.length} 篇草稿`
    },
    {
      title: '文章分類',
      value: categories.length,
      icon: FolderOpen,
      color: 'bg-green-500',
      description: '個分類'
    },
    {
      title: '文章標籤',
      value: tags.length,
      icon: Tags,
      color: 'bg-purple-500',
      description: '個標籤'
    },
    {
      title: '總瀏覽數',
      value: '1,234', // 這裡可以加入真實的瀏覽數據
      icon: Eye,
      color: 'bg-orange-500',
      description: '次瀏覽'
    }
  ];

  // 最新文章
  const recentArticles = articles
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout currentView="dashboard">
      <div className="space-y-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">儀表板</h1>
            <p className="text-gray-600 mt-1">歡迎回來！這裡是您的網站總覽</p>
          </div>
          <a
            href="/admin/articles/new"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>新增文章</span>
          </a>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最新文章 */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">最新文章</h2>
            </div>
            <div className="p-6">
              {recentArticles.length > 0 ? (
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(article.updatedAt)} • {article.author}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-medium rounded-full
                          ${article.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        `}>
                          {article.published ? '已發布' : '草稿'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">暫無文章</p>
              )}
            </div>
          </div>

          {/* 分類概覽 */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">分類概覽</h2>
            </div>
            <div className="p-6">
              {categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => {
                    const articleCount = publishedArticles.filter(
                      article => article.categoryId === category.id
                    ).length;
                    
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {articleCount} 篇文章
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">暫無分類</p>
              )}
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/articles"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">管理文章</h3>
                <p className="text-sm text-gray-500">編輯或新增文章</p>
              </div>
            </a>
            <a
              href="/admin/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">管理分類</h3>
                <p className="text-sm text-gray-500">組織文章分類</p>
              </div>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">查看網站</h3>
                <p className="text-sm text-gray-500">預覽前台效果</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}