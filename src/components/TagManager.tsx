import React from 'react';
import { Tag as TagIcon, Hash } from 'lucide-react';
import { Tag } from '../types/blog';

interface TagManagerProps {
  tags: Tag[];
  onSelectTag: (tag: string) => void;
}

export function TagManager({ tags, onSelectTag }: TagManagerProps) {
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tags</h2>
        <p className="text-gray-600 mt-1">Explore articles by topic</p>
      </div>

      {sortedTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag.name)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <TagIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {tag.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {tag.count} article{tag.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tags found</p>
          <p className="text-gray-400">Tags will appear here as you add them to articles</p>
        </div>
      )}
    </div>
  );
}