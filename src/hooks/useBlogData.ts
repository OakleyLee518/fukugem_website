import { useState, useEffect } from 'react';
import { Category, Article, Tag } from '../types/blog';

const STORAGE_KEYS = {
  categories: 'blog_categories',
  articles: 'blog_articles',
};

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    description: 'Latest tech trends and insights',
    color: '#3B82F6',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Design',
    description: 'UI/UX design principles and trends',
    color: '#8B5CF6',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Lifestyle',
    description: 'Life tips and personal growth',
    color: '#10B981',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

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
    categoryId: '1',
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
    categoryId: '2',
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
    categoryId: '3',
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem(STORAGE_KEYS.categories);
    const savedArticles = localStorage.getItem(STORAGE_KEYS.articles);

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
    }

    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    } else {
      setArticles(defaultArticles);
    }
  }, []);

  // Save categories to localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    }
  }, [categories]);

  // Save articles to localStorage
  useEffect(() => {
    if (articles.length > 0) {
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(articles));
    }
  }, [articles]);

  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
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
    setCategories(prev => prev.filter(cat => cat.id !== id));
    setArticles(prev => prev.filter(article => article.categoryId !== id));
  };

  const addArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
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
  };
}