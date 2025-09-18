export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  parentId?: string;  // 新增：父分類ID，主分類為 undefined，子分類有值
  order: number;      // 新增：排序，用於顯示順序
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;  // 只能是子分類的ID
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  published: boolean;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface EmbeddedBlock {
  id: string;
  type: 'link' | 'image' | 'quote';
  content: string;
  url?: string;
  title?: string;
}

// 新增：用於組織階層分類的輔助介面
export interface CategoryTree {
  category: Category;
  children: CategoryTree[];
}