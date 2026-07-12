import { Search } from 'lucide-react';

interface SearchToolbarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchToolbar({ value, onChange, placeholder = 'Global Asset Search...' }: SearchToolbarProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 outline-none transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
