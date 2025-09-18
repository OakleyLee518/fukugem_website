import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-12">
              <a href="/" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide">
                首頁
              </a>
              <a href="/travel" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide">
                旅遊景點
              </a>
              <a href="/food" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide">
                美食推薦
              </a>
              <a href="/accommodation" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide">
                住宿體驗
              </a>
              <a href="/activities" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide">
                活動體驗
              </a>
              <a href="/about" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wide">
                關於我們
              </a>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden">
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
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
                <li><a href="/travel" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">旅遊景點</a></li>
                <li><a href="/food" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">美食推薦</a></li>
                <li><a href="/accommodation" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">住宿體驗</a></li>
                <li><a href="/activities" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">活動體驗</a></li>
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
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-light"
                style={{ opacity: 0.3 }}
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