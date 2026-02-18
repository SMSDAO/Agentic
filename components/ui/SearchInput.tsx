'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from './Input';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
}: SearchInputProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-12"
      />
    </div>
  );
}
