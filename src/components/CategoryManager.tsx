import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { Category } from '../types/blog';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onSelectCategory: (categoryId: string) => void;
  getArticleCount: (categoryId: string) => number;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onSelectCategory,
  getArticleCount,
}: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
  ];

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      onUpdateCategory(editingId, formData);
    } else {
      onAddCategory(formData);
    }
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setEditingId(category.id);
    setIsCreating(true);
  };

  const handleDelete = (category: Category) => {
    const articleCount = getArticleCount(category.id);
    if (articleCount > 0) {
      const confirmed = window.confirm(
        `This category contains ${articleCount} article${articleCount > 1 ? 's' : ''}. Deleting it will also delete all articles in this category. Are you sure?`
      );
      if (!confirmed) return;
    }
    onDeleteCategory(category.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">Organize your articles by category</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of this category"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const articleCount = getArticleCount(category.id);
          return (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">
                {category.description || 'No description'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {articleCount} article{articleCount !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>View Articles</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No categories yet</p>
          <p className="text-gray-400">Create your first category to get started</p>
        </div>
      )}
    </div>
  );
}