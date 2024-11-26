import { useState, useEffect } from 'react';
import { Tag, X, Plus } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
}

export default function TagsInput({ tags, onTagsChange, suggestions = [] }: TagsInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (input) {
      const filtered = suggestions.filter(
        tag => tag.toLowerCase().includes(input.toLowerCase()) && !tags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input, suggestions, tags]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-primary-500/20 text-primary-400"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-primary-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tags..."
            className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => addTag(input)}
            disabled={!input}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg">
            <ul className="py-1">
              {filteredSuggestions.map(suggestion => (
                <li key={suggestion}>
                  <button
                    onClick={() => addTag(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-dark-600"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}