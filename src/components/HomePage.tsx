import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Article, Category } from '../types/blog';

interface HomePageProps {
  articles: Article[];
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onSelectTag: (tag: string) => void;
  onSelectArticle: (articleId: string) => void;
}

export function HomePage({ 
  articles, 
  categories, 
  onSelectCategory, 
  onSelectTag, 
  onSelectArticle 
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? articles.filter(article => article.categoryId === selectedCategory)
    : articles;

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const extractTextFromHTML = (html: string, maxLength: number = 150) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to ModernBlog
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Discover insightful articles, tutorials, and stories across technology, design, and lifestyle.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Articles
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => {
          const category = getCategoryById(article.categoryId);
          return (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => onSelectArticle(article.id)}
            >
              {article.imageUrl && (
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Category Badge */}
                {category && (
                  <div className="mb-3">
                    <span
                      className="inline-block px-3 py-1 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt || extractTextFromHTML(article.content)}
                </p>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTag(tag);
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}