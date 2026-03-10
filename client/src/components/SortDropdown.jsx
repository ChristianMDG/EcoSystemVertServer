export default function SortDropdown({ value, onChange }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      >
        <option value="relevance">Pertinence</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="name-asc">Nom (A-Z)</option>
      </select>
    );
  }