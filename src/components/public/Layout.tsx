import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Category, CategoryTree } from '../../types/blog';

interface LayoutProps {
  children: React.ReactNode;
  categories: Category[];
  getCategoryTree: () => CategoryTree[];
}

export function Layout({ children, categories, getCategoryTree }: LayoutProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoryTree = getCategoryTree();

  // 處理下拉選單顯示/隱藏
  const handleMouseEnter = (categoryId: string) => {
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    // 加入較長延遲確保滑鼠可以移動到下拉選單
    setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // 導航到分類頁面（目前導向首頁並篩選分類）
  const handleCategoryClick = (categoryId: string) => {
    window.location.href = `/?category=${categoryId}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-light text-gray-900 tracking-wider">
                福寶｜福岡、九州慢遊體驗
              </a>
              <div className="ml-4 text-xs text-gray-500 font-light">
                KYUSHU FUKUOKA
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                首頁
              </a>
              
              {/* 動態分類導航 */}
              {categoryTree.map((mainCatTree) => (
                <div 
                  key={mainCatTree.category.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(mainCatTree.category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
                  >
                    {mainCatTree.category.name}
                    {mainCatTree.children.length > 0 && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>

                  {/* 下拉選單 */}
                  {mainCatTree.children.length > 0 && activeDropdown === mainCatTree.category.id && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                      onMouseEnter={() => setActiveDropdown(mainCatTree.category.id)}
                      onMouseLeave={handleMouseLeave}
                      style={{ 
                        // 確保下拉選單和按鈕之間沒有空隙
                        marginTop: '0px',
                        paddingTop: '4px'
                      }}
                    >
                      {mainCatTree.children.map((subCatTree) => (
                        <button
                          key={subCatTree.category.id}
                          onClick={() => handleCategoryClick(subCatTree.category.id)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-light flex items-center"
                        >
                          <div 
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: subCatTree.category.color }}
                          />
                          <div>
                            <div className="font-medium">{subCatTree.category.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {subCatTree.category.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a 
                href="/about" 
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
              >
                關於我們
              </a>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <div className="space-y-4">
                <a 
                  href="/"
                  className="block text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
                >
                  首頁
                </a>
                
                {/* 手機版分類選單 */}
                {categoryTree.map((mainCatTree) => (
                  <div key={mainCatTree.category.id} className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 tracking-wide">
                      {mainCatTree.category.name}
                    </div>
                    {mainCatTree.children.map((subCatTree) => (
                      <button
                        key={subCatTree.category.id}
                        onClick={() => handleCategoryClick(subCatTree.category.id)}
                        className="block ml-4 text-sm text-gray-600 hover:text-gray-900 transition-colors font-light flex items-center"
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: subCatTree.category.color }}
                        />
                        {subCatTree.category.name}
                      </button>
                    ))}
                  </div>
                ))}

                <a 
                  href="/about"
                  className="block text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide"
                >
                  關於我們
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wider">
                九州山口旅遊指南
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light max-w-md">
                探索九州與山口的隱藏魅力，從溫泉文化到絕美景色，
                我們為您精心策劃最道地的日式旅遊體驗。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-6 tracking-wide">快速連結</h4>
              <ul className="space-y-4">
                {categoryTree.map((mainCatTree) => (
                  <li key={mainCatTree.category.id}>
                    <div className="text-sm text-gray-600 font-light mb-2">
                      {mainCatTree.category.name}
                    </div>
                    <ul className="ml-3 space-y-1">
                      {mainCatTree.children.slice(0, 3).map((subCatTree) => (
                        <li key={subCatTree.category.id}>
                          <button
                            onClick={() => handleCategoryClick(subCatTree.category.id)}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-light"
                          >
                            {subCatTree.category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-6 tracking-wide">聯絡資訊</h4>
              <ul className="space-y-4">
                <li className="text-sm text-gray-600 font-light">九州・山口地區</li>
                <li className="text-sm text-gray-600 font-light">info@kyushu-yamaguchi.com</li>
                <li className="text-sm text-gray-600 font-light">+81-XX-XXXX-XXXX</li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 font-light">
              © 2024 九州山口旅遊指南. All rights reserved.
            </p>
            
            {/* Hidden Admin Link */}
            <div className="mt-4 md:mt-0">
              <a 
                href="/admin" 
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-light"
              >
                管理
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}