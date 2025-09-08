import React from 'react';
import { ArrowLeft, Tag as TagIcon, Calendar, User } from 'lucide-react';
import { Article, Category } from '../types/blog';

interface TaggedArticlesProps {
  tag: string;
  articles: Article[];
  categories: Category[];
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
}

export function TaggedArticles({ 
  tag, 
  articles, 
  categories, 
  onBack, 
  onSelectArticle 
}: TaggedArticlesProps) {
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
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to tags</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <TagIcon className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">#{tag}</h1>
        </div>
        <p className="text-gray-600">
          {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with "{tag}"
        </p>
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => {
            const category = getCategoryById(article.categoryId);
            return (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
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
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No articles found for this tag</p>
        </div>
      )}
    </div>
  );
}