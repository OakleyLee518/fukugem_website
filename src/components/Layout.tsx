import React from 'react';
import { PenTool, Home, Tags, FolderOpen, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'home' | 'categories' | 'tags' | 'editor';
  onNavigate: (view: 'home' | 'categories' | 'tags' | 'editor') => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <PenTool className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ModernBlog</h1>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => onNavigate('categories')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'categories'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Categories</span>
              </button>
              
              <button
                onClick={() => onNavigate('tags')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'tags'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Tags className="h-4 w-4" />
                <span>Tags</span>
              </button>
              
              <button
                onClick={() => onNavigate('editor')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Article</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}