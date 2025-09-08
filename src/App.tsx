import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { CategoryManager } from './components/CategoryManager';
import { TagManager } from './components/TagManager';
import { ArticleEditor } from './components/ArticleEditor';
import { ArticleView } from './components/ArticleView';
import { TaggedArticles } from './components/TaggedArticles';
import { useBlogData } from './hooks/useBlogData';

type View = 
  | { type: 'home' }
  | { type: 'categories' }
  | { type: 'tags' }
  | { type: 'editor'; articleId?: string }
  | { type: 'article'; articleId: string }
  | { type: 'tagged-articles'; tag: string };

function App() {
  const [currentView, setCurrentView] = useState<View>({ type: 'home' });
  const {
    categories,
    articles,
    addCategory,
    updateCategory,
    deleteCategory,
    addArticle,
    updateArticle,
    getArticlesByCategory,
    getArticlesByTag,
    getAllTags,
    getPublishedArticles,
  } = useBlogData();

  const handleNavigate = (view: 'home' | 'categories' | 'tags' | 'editor') => {
    setCurrentView({ type: view });
  };

  const handleSelectCategory = (categoryId: string) => {
    // For now, we'll just go to home and let the user filter there
    setCurrentView({ type: 'home' });
  };

  const handleSelectTag = (tag: string) => {
    setCurrentView({ type: 'tagged-articles', tag });
  };

  const handleSelectArticle = (articleId: string) => {
    setCurrentView({ type: 'article', articleId });
  };

  const handleEditArticle = (articleId: string) => {
    setCurrentView({ type: 'editor', articleId });
  };

  const handleSaveArticle = (articleData: any) => {
    if (currentView.type === 'editor' && currentView.articleId) {
      updateArticle(currentView.articleId, articleData);
    } else {
      addArticle(articleData);
    }
    setCurrentView({ type: 'home' });
  };

  const handleCancelEdit = () => {
    setCurrentView({ type: 'home' });
  };

  const handleBack = () => {
    setCurrentView({ type: 'home' });
  };

  const getArticleCount = (categoryId: string) => {
    return getArticlesByCategory(categoryId).length;
  };

  const publishedArticles = getPublishedArticles();
  const allTags = getAllTags();

  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'home':
        return (
          <HomePage
            articles={publishedArticles}
            categories={categories}
            onSelectCategory={handleSelectCategory}
            onSelectTag={handleSelectTag}
            onSelectArticle={handleSelectArticle}
          />
        );

      case 'categories':
        return (
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onSelectCategory={handleSelectCategory}
            getArticleCount={getArticleCount}
          />
        );

      case 'tags':
        return (
          <TagManager
            tags={allTags}
            onSelectTag={handleSelectTag}
          />
        );

      case 'editor':
        const editingArticle = currentView.articleId
          ? articles.find(a => a.id === currentView.articleId)
          : undefined;
        return (
          <ArticleEditor
            article={editingArticle}
            categories={categories}
            onSave={handleSaveArticle}
            onCancel={handleCancelEdit}
          />
        );

      case 'article':
        const article = articles.find(a => a.id === currentView.articleId);
        if (!article) return <div>Article not found</div>;
        const category = categories.find(c => c.id === article.categoryId);
        return (
          <ArticleView
            article={article}
            category={category}
            onBack={handleBack}
            onSelectTag={handleSelectTag}
          />
        );

      case 'tagged-articles':
        const taggedArticles = getArticlesByTag(currentView.tag);
        return (
          <TaggedArticles
            tag={currentView.tag}
            articles={taggedArticles}
            categories={categories}
            onBack={() => setCurrentView({ type: 'tags' })}
            onSelectArticle={handleSelectArticle}
          />
        );

      default:
        return null;
    }
  };

  const getCurrentLayoutView = () => {
    switch (currentView.type) {
      case 'home': return 'home';
      case 'categories': return 'categories';
      case 'tags': return 'tags';
      case 'editor': return 'editor';
      default: return 'home';
    }
  };

  return (
    <Layout currentView={getCurrentLayoutView()} onNavigate={handleNavigate}>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;