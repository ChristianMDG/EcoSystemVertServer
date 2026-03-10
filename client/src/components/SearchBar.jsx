import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Rechercher un produit écologique..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
      <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
    </div>
  );
}