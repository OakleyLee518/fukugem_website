import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { useBlogData } from './hooks/useBlogData';

// 前台頁面
import { HomePage } from './pages/public/HomePage';
import { ArticleView } from './pages/public/ArticleView';
import { TaggedArticles } from './pages/public/TaggedArticles';
import { Layout } from './components/public/Layout';

// 後台頁面
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { CategoriesManagement } from './pages/admin/CategoriesManagement';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function App() {
  const {
    categories,
    articles,
    addCategory,
    updateCategory,
    deleteCategory,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticlesByCategory,
    getArticlesByTag,
    getAllTags,
    getPublishedArticles,
    // 階層分類相關函數
    getMainCategories,
    getSubCategories,
    getCategoryTree,
    canDeleteCategory,
    getCategoryPath,
    moveCategory,
  } = useBlogData();

  // 檢查資料是否載入完成
  if (!categories || !articles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  const publishedArticles = getPublishedArticles();
  const allTags = getAllTags();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 前台路由 */}
          <Route path="/" element={
            <Layout 
              categories={categories}
              getCategoryTree={getCategoryTree}
            >
              <HomePage
                articles={publishedArticles}
                categories={categories}
                getCategoryTree={getCategoryTree}
                getSubCategories={getSubCategories}
                onSelectCategory={(categoryId) => {
                  console.log('Selected category:', categoryId);
                }}
                onSelectTag={(tag) => {
                  window.location.href = `/tags/${tag}`;
                }}
                onSelectArticle={(articleId) => {
                  window.location.href = `/article/${articleId}`;
                }}
              />
            </Layout>
          } />

          <Route path="/article/:id" element={
            <Layout 
              categories={categories}
              getCategoryTree={getCategoryTree}
            >
              <ArticleViewWrapper 
                articles={articles} 
                categories={categories}
              />
            </Layout>
          } />

          <Route path="/tags/:tag" element={
            <Layout 
              categories={categories}
              getCategoryTree={getCategoryTree}
            >
              <TaggedArticlesWrapper 
                articles={articles} 
                categories={categories}
                getArticlesByTag={getArticlesByTag}
              />
            </Layout>
          } />

          {/* 後台路由 */}
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard 
                articles={articles}
                categories={categories}
                tags={allTags}
              />
            </ProtectedRoute>
          } />

          {/* 分類管理路由 */}
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <CategoriesManagement
                categories={categories}
                articles={articles}
                getCategoryTree={getCategoryTree}
                canDeleteCategory={canDeleteCategory}
                getCategoryPath={getCategoryPath}
                addCategory={addCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                moveCategory={moveCategory}
              />
            </ProtectedRoute>
          } />

          {/* 預設重導向 */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* 404 頁面 */}
          <Route path="*" element={
            <Layout 
              categories={categories}
              getCategoryTree={getCategoryTree}
            >
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">頁面不存在</p>
                <a href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                  回到首頁
                </a>
              </div>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// 包裝組件來處理路由參數
function ArticleViewWrapper({ articles, categories }: { articles: any[], categories: any[] }) {
  const articleId = window.location.pathname.split('/').pop();
  const article = articles.find(a => a.id === articleId);
  const category = article ? categories.find(c => c.id === article.categoryId) : undefined;

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
        <a href="/" className="text-blue-600 hover:text-blue-700">回到首頁</a>
      </div>
    );
  }

  return (
    <ArticleView
      article={article}
      category={category}
      onBack={() => window.history.back()}
      onSelectTag={(tag) => window.location.href = `/tags/${tag}`}
    />
  );
}

function TaggedArticlesWrapper({ 
  articles, 
  categories, 
  getArticlesByTag 
}: { 
  articles: any[], 
  categories: any[], 
  getArticlesByTag: (tag: string) => any[] 
}) {
  const tag = window.location.pathname.split('/').pop();
  const taggedArticles = tag ? getArticlesByTag(decodeURIComponent(tag)) : [];

  return (
    <TaggedArticles
      tag={tag || ''}
      articles={taggedArticles}
      categories={categories}
      onBack={() => window.history.back()}
      onSelectArticle={(articleId) => window.location.href = `/article/${articleId}`}
    />
  );
}

export default App;