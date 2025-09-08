import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Tags, 
  LogOut, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView?: 'dashboard' | 'articles' | 'categories' | 'tags';
}

export function AdminLayout({ children, currentView = 'dashboard' }: AdminLayoutProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) {
      logout();
      window.location.href = '/admin/login';
    }
  };

  const navigateToFrontend = () => {
    window.open('/', '_blank');
  };

  const menuItems = [
    {
      id: 'dashboard',
      name: '總覽',
      icon: LayoutDashboard,
      href: '/admin/dashboard'
    },
    {
      id: 'articles',
      name: '文章管理',
      icon: FileText,
      href: '/admin/articles'
    },
    {
      id: 'categories',
      name: '分類管理',
      icon: FolderOpen,
      href: '/admin/categories'
    },
    {
      id: 'tags',
      name: '標籤管理',
      icon: Tags,
      href: '/admin/tags'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <h1 className="text-white text-lg font-semibold">管理後台</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={`
                  flex items-center px-6 py-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* 底部按鈕 */}
        <div className="absolute bottom-0 w-full p-4 space-y-2">
          <button
            onClick={navigateToFrontend}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <Home className="h-5 w-5 mr-3" />
            查看前台
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            登出
          </button>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部導航 */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">管理後台</h1>
            <div className="w-6"></div> {/* 平衡用的空白 */}
          </div>
        </header>

        {/* 內容區域 */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* 遮罩層 (手機版) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}