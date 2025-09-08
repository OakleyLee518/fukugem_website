export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
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