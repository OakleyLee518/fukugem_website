import { useState, useEffect } from 'react';
import { Category, Article, Tag, CategoryTree } from '../types/blog';

const STORAGE_KEYS = {
  categories: 'blog_categories',
  articles: 'blog_articles',
};

const defaultCategories: Category[] = [
  // 主分類
  {
    id: '1',
    name: '旅遊景點',
    description: '探索九州山口的絕美景點',
    color: '#3B82F6',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '美食推薦',
    description: '品嚐道地的九州山口美食',
    color: '#F59E0B',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: '住宿體驗',
    description: '精選優質住宿推薦',
    color: '#8B5CF6',
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: '活動體驗',
    description: '獨特的文化與戶外體驗',
    color: '#10B981',
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  // 子分類 - 旅遊景點
  {
    id: '11',
    name: '福岡市區',
    description: '福岡市內的熱門景點',
    color: '#3B82F6',
    parentId: '1',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '12',
    name: '九州其他地區',
    description: '九州其他縣市的精彩景點',
    color: '#3B82F6',
    parentId: '1',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '13',
    name: '山口縣',
    description: '山口縣的自然與歷史景點',
    color: '#3B82F6',
    parentId: '1',
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  // 子分類 - 美食推薦
  {
    id: '21',
    name: '拉麵',
    description: '九州著名的拉麵文化',
    color: '#F59E0B',
    parentId: '2',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '22',
    name: '海鮮料理',
    description: '新鮮的海產美食',
    color: '#F59E0B',
    parentId: '2',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '23',
    name: '地方特色',
    description: '當地特色料理與小吃',
    color: '#F59E0B',
    parentId: '2',
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  // 子分類 - 住宿體驗
  {
    id: '31',
    name: '溫泉旅館',
    description: '傳統日式溫泉住宿體驗',
    color: '#8B5CF6',
    parentId: '3',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '32',
    name: '商務酒店',
    description: '便利的商務住宿選擇',
    color: '#8B5CF6',
    parentId: '3',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '33',
    name: '民宿',
    description: '體驗當地生活的民宿住宿',
    color: '#8B5CF6',
    parentId: '3',
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  // 子分類 - 活動體驗
  {
    id: '41',
    name: '文化體驗',
    description: '深度體驗日本傳統文化',
    color: '#10B981',
    parentId: '4',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '42',
    name: '戶外活動',
    description: '親近自然的戶外體驗',
    color: '#10B981',
    parentId: '4',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '43',
    name: '季節限定',
    description: '特定季節的限定活動',
    color: '#10B981',
    parentId: '4',
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// 更新預設文章，改為使用子分類ID
const defaultArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    content: `
      <h2>Introduction</h2>
      <p>Web development continues to evolve at a rapid pace. From new frameworks to emerging technologies, developers need to stay ahead of the curve.</p>
      
      <h3>Key Technologies to Watch</h3>
      <p>Several technologies are shaping the future of web development:</p>
      <ul>
        <li><strong>React Server Components</strong> - Revolutionizing how we think about server-side rendering</li>
        <li><strong>WebAssembly</strong> - Bringing near-native performance to web applications</li>
        <li><strong>Edge Computing</strong> - Reducing latency with distributed computing</li>
      </ul>
      
      <blockquote>
        "The best way to predict the future is to invent it." - Alan Kay
      </blockquote>
      
      <p>These technologies will continue to shape how we build and deploy web applications in the coming years.</p>
    `,
    excerpt: 'Explore the cutting-edge technologies that will define the future of web development.',
    categoryId: '11', // 改為子分類：福岡市區
    tags: ['React', 'WebAssembly', 'Future Tech'],
    author: 'Alex Chen',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    published: true,
  },
  {
    id: '2',
    title: 'Mastering Modern CSS Grid',
    content: `
      <h2>Understanding CSS Grid</h2>
      <p>CSS Grid is one of the most powerful layout systems available to web developers today. It provides a two-dimensional system for handling both rows and columns.</p>
      
      <h3>Basic Grid Concepts</h3>
      <p>Before diving into advanced techniques, let's understand the fundamentals:</p>
      <ul>
        <li><strong>Grid Container</strong> - The parent element with display: grid</li>
        <li><strong>Grid Items</strong> - The direct children of the grid container</li>
        <li><strong>Grid Lines</strong> - The dividing lines that make up the structure</li>
      </ul>
      
      <p>With these basics, you can create complex layouts that were previously difficult or impossible with older CSS methods.</p>
    `,
    excerpt: 'Learn how to create powerful, responsive layouts with CSS Grid.',
    categoryId: '21', // 改為子分類：拉麵
    tags: ['CSS', 'Layout', 'Web Design'],
    author: 'Sarah Johnson',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    published: true,
  },
  {
    id: '3',
    title: 'Building Healthy Daily Habits',
    content: `
      <h2>The Power of Small Changes</h2>
      <p>Building healthy habits doesn't require dramatic life changes. Small, consistent actions can lead to remarkable transformations over time.</p>
      
      <h3>Start with Micro-Habits</h3>
      <p>The key to lasting change is starting small:</p>
      <ul>
        <li>Read one page of a book daily</li>
        <li>Do 5 minutes of exercise</li>
        <li>Write three things you're grateful for</li>
        <li>Drink an extra glass of water</li>
      </ul>
      
      <blockquote>
        "Success is the sum of small efforts repeated day in and day out." - Robert Collier
      </blockquote>
      
      <p>Remember, consistency beats perfection. Focus on showing up every day, even if it's just for a few minutes.</p>
    `,
    excerpt: 'Discover how small, consistent actions can transform your daily routine.',
    categoryId: '31', // 改為子分類：溫泉旅館
    tags: ['Habits', 'Productivity', 'Self-Improvement'],
    author: 'Mike Davis',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    published: true,
  },
];

export function useBlogData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_KEYS.categories);
      const savedArticles = localStorage.getItem(STORAGE_KEYS.articles);

      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } else {
        setCategories(defaultCategories);
      }

      if (savedArticles) {
        const parsedArticles = JSON.parse(savedArticles);
        setArticles(parsedArticles);
      } else {
        setArticles(defaultArticles);
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // 如果 localStorage 有問題，使用預設資料
      setCategories(defaultCategories);
      setArticles(defaultArticles);
      setIsLoaded(true);
    }
  }, []);

  // Save categories to localStorage
  useEffect(() => {
    if (isLoaded && categories.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
      } catch (error) {
        console.error('Error saving categories to localStorage:', error);
      }
    }
  }, [categories, isLoaded]);

  // Save articles to localStorage
  useEffect(() => {
    if (isLoaded && articles.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(articles));
      } catch (error) {
        console.error('Error saving articles to localStorage:', error);
      }
    }
  }, [articles, isLoaded]);

  // === 新增：階層分類相關函數 ===
  
  // 取得主分類（沒有 parentId 的分類）
  const getMainCategories = () => {
    return categories
      .filter(cat => !cat.parentId)
      .sort((a, b) => a.order - b.order);
  };

  // 取得子分類
  const getSubCategories = (parentId?: string) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  };

  // 建立分類樹狀結構
  const getCategoryTree = (): CategoryTree[] => {
    const mainCategories = getMainCategories();
    
    return mainCategories.map(mainCat => ({
      category: mainCat,
      children: getSubCategories(mainCat.id).map(subCat => ({
        category: subCat,
        children: [] // 目前只支援兩層，子分類沒有再下一層
      }))
    }));
  };

  // 檢查是否可以刪除分類（主分類不能有子分類）
  const canDeleteCategory = (categoryId: string): boolean => {
    const hasSubCategories = categories.some(cat => cat.parentId === categoryId);
    const hasArticles = articles.some(article => article.categoryId === categoryId);
    return !hasSubCategories && !hasArticles;
  };

  // 取得分類路徑（主分類 > 子分類）
  const getCategoryPath = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    if (category.parentId) {
      const parentCategory = categories.find(cat => cat.id === category.parentId);
      return parentCategory ? `${parentCategory.name} > ${category.name}` : category.name;
    }
    
    return category.name;
  };

  // === 原有函數，保持不變但加入排序 ===

  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      order: category.order || 999, // 確保有排序值
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    if (!canDeleteCategory(id)) {
      throw new Error('無法刪除分類：請先刪除底下的子分類和文章');
    }
    
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // 刪除該分類下的所有文章
    setArticles(prev => prev.filter(article => article.categoryId !== id));
  };

  // 移動分類（更新順序或父分類）
  const moveCategory = (categoryId: string, newParentId?: string, newOrder?: number) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          parentId: newParentId,
          order: newOrder !== undefined ? newOrder : cat.order
        };
      }
      return cat;
    }));
  };

  const addArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    // 確保文章只能歸類到子分類
    const category = categories.find(cat => cat.id === article.categoryId);
    if (!category || !category.parentId) {
      throw new Error('文章只能歸類到子分類');
    }
    
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setArticles(prev => [...prev, newArticle]);
    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    // 如果更新分類，確保是子分類
    if (updates.categoryId) {
      const category = categories.find(cat => cat.id === updates.categoryId);
      if (!category || !category.parentId) {
        throw new Error('文章只能歸類到子分類');
      }
    }
    
    setArticles(prev => prev.map(article => 
      article.id === id 
        ? { ...article, ...updates, updatedAt: new Date().toISOString() }
        : article
    ));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  };

  const getArticlesByCategory = (categoryId: string) => {
    return articles.filter(article => article.categoryId === categoryId && article.published);
  };

  const getArticlesByTag = (tag: string) => {
    return articles.filter(article => 
      article.tags.includes(tag) && article.published
    );
  };

  const getAllTags = (): Tag[] => {
    const tagCounts: { [key: string]: number } = {};
    
    articles.forEach(article => {
      if (article.published) {
        article.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }));
  };

  const getPublishedArticles = () => {
    return articles.filter(article => article.published);
  };

  return {
    categories,
    articles,
    // 原有函數
    addCategory,
    updateCategory,
    deleteCategory,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticlesByCategory,
    getArticlesByTag,
    getAllTags,
    getPublishedArticles,
    // 新增：階層分類函數
    getMainCategories,
    getSubCategories,
    getCategoryTree,
    canDeleteCategory,
    getCategoryPath,
    moveCategory,
  };
}