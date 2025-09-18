import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Article, Category, CategoryTree } from '../../types/blog';

interface HomePageProps {
  articles: Article[];
  categories: Category[];
  getCategoryTree: () => CategoryTree[];
  getSubCategories: (parentId?: string) => Category[];
  onSelectCategory: (categoryId: string) => void;
  onSelectTag: (tag: string) => void;
  onSelectArticle: (articleId: string) => void;
}

export function HomePage({ 
  articles, 
  categories, 
  getCategoryTree,
  getSubCategories,
  onSelectCategory, 
  onSelectTag, 
  onSelectArticle 
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 檢查 URL 參數中是否有分類篩選
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const categoryTree = getCategoryTree();
  const allSubCategories = getSubCategories(); // 取得所有子分類

  // 篩選文章：只顯示選中分類的文章，如果沒選則顯示全部
  const filteredArticles = selectedCategory
    ? articles.filter(article => article.categoryId === selectedCategory)
    : articles;

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const extractTextFromHTML = (html: string, maxLength: number = 100) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 處理分類選擇
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      onSelectCategory(categoryId);
      // 更新 URL 但不重新載入頁面
      const newUrl = categoryId ? `/?category=${categoryId}` : '/';
      window.history.pushState({}, '', newUrl);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=2000&q=80)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-5xl md:text-6xl font-light mb-8 tracking-wider">
              福寶｜福岡、九州慢遊體驗
            </h1>
            <div className="text-lg md:text-xl font-light tracking-wide mb-8 opacity-90">
              FUKUOKA LIFE GEM
            </div>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-80">
              探索日本西南部的隱藏魅力，體驗最道地的文化與絕美自然景觀
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
              旅遊主題
            </h2>
            <div className="w-16 h-px bg-gray-300 mx-auto"></div>
          </div>
          
          {/* 分類篩選按鈕 */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部文章
            </button>
            
            {/* 只顯示子分類作為篩選選項 */}
            {allSubCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </button>
            ))}
          </div>

          {/* 顯示目前選中的分類資訊 */}
          {selectedCategory && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gray-50 rounded-full px-6 py-3">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: getCategoryById(selectedCategory)?.color }}
                />
                <span className="text-gray-700 font-light">
                  正在瀏覽：{getCategoryById(selectedCategory)?.name}
                </span>
                <button 
                  onClick={() => handleCategorySelect(null)}
                  className="ml-3 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredArticles.map(article => {
                const category = getCategoryById(article.categoryId);
                // 取得主分類資訊（用於顯示完整路徑）
                const parentCategory = category?.parentId 
                  ? getCategoryById(category.parentId) 
                  : null;

                return (
                  <article
                    key={article.id}
                    className="group cursor-pointer"
                    onClick={() => onSelectArticle(article.id)}
                  >
                    <div className="bg-white overflow-hidden transition-all duration-500 hover:shadow-lg">
                      {/* Image */}
                      {article.imageUrl && (
                        <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-8">
                        {/* Category Path */}
                        {category && (
                          <div className="mb-4 flex items-center">
                            {parentCategory && (
                              <>
                                <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                                  {parentCategory.name}
                                </span>
                                <span className="text-gray-300 mx-2">›</span>
                              </>
                            )}
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-xs font-medium text-gray-500 tracking-widest uppercase">
                                {category.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-light text-gray-900 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm leading-relaxed font-light mb-6">
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
                                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            {formatDate(article.createdAt)}
                          </div>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg font-light">
                {selectedCategory ? '此分類暫無文章' : '暫無文章'}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-light"
                >
                  查看全部文章
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
            開始您的九州之旅
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            讓我們為您規劃一趟難忘的旅程，探索這片土地的獨特魅力與深厚文化底蘊
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 text-white px-12 py-4 text-sm font-light tracking-widest hover:bg-gray-800 transition-colors"
          >
            聯絡我們
          </a>
        </div>
      </section>
    </div>
  );
}