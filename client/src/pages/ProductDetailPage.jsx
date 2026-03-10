import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (!product) return <div className="text-center p-8">Produit non trouvé.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow" />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl text-green-600 font-bold mb-2">{product.price} Ar</p>
          <p className="mb-4">Stock disponible : {product.stock}</p>
          <p className="text-sm text-gray-500">Catégorie : {product.category}</p>
        </div>
      </div>
    </div>
  );
}