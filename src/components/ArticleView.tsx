import React from 'react';
import { Calendar, User, Tag as TagIcon, ArrowLeft } from 'lucide-react';
import { Article, Category } from '../types/blog';

interface ArticleViewProps {
  article: Article;
  category?: Category;
  onBack: () => void;
  onSelectTag: (tag: string) => void;
}

export function ArticleView({ article, category, onBack, onSelectTag }: ArticleViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to articles</span>
      </button>

      {/* Article */}
      <article className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Featured Image */}
        {article.imageUrl && (
          <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Category Badge */}
          {category && (
            <div className="mb-4">
              <span
                className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(article.createdAt)}
            </div>
            {article.updatedAt !== article.createdAt && (
              <div className="text-gray-500">
                Updated {formatDate(article.updatedAt)}
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(tag)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
    </div>
  );
}