import React, { useState, useEffect } from 'react';
import { Save, X, Eye, Image, Tag as TagIcon } from 'lucide-react';
import { Article, Category } from '../types/blog';
import { RichTextEditor } from './RichTextEditor';

interface ArticleEditorProps {
  article?: Article;
  categories: Category[];
  onSave: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ArticleEditor({ article, categories, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [categoryId, setCategoryId] = useState(article?.categoryId || categories[0]?.id || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState(article?.author || '');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || '');
  const [published, setPublished] = useState(article?.published || false);
  const [isPreview, setIsPreview] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      categoryId,
      tags,
      author: author.trim() || 'Anonymous',
      imageUrl: imageUrl.trim(),
      published,
    });
  };

  const generateExcerpt = () => {
    if (content) {
      const div = document.createElement('div');
      div.innerHTML = content;
      const text = div.textContent || div.innerText || '';
      const excerptText = text.substring(0, 150).trim();
      setExcerpt(excerptText + (text.length > 150 ? '...' : ''));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {article ? 'Edit Article' : 'Create New Article'}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{isPreview ? 'Edit' : 'Preview'}</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {isPreview ? (
          /* Preview Mode */
          <div className="prose prose-lg max-w-none">
            <div className="mb-6">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <span>By {author || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter article title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Author and Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <div className="flex">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                    title="Image URL"
                  >
                    <Image className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <button
                  type="button"
                  onClick={generateExcerpt}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Generate from content
                </button>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the article..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-400 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type tags and press Enter or comma to add"
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or comma to add tags
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your article content here..."
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Publish immediately
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}