import { useState } from 'react';
import { Image } from 'lucide-react';

const AdminImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  // Placeholder SVG local
  const fallbackSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='14' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial'%3E${alt?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;

  if (error || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} {...props}>
        <Image className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default AdminImageWithFallback;