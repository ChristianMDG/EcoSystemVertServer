import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Save,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { getProductById, createProduct, updateProduct } from '../../services/adminApi';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  // Dans fetchProduct
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      const product = response.data || response;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
      });
      if (product.image) {
        setExistingImage(product.image);
        setImagePreview(product.imageUrl || `http://localhost:5000/uploads/products/${product.image}`);
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    
    if (!formData.price) {
      newErrors.price = "Le prix est requis";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Le prix doit être un nombre positif";
    }
    
    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
    }
    
    if (!formData.stock) {
      newErrors.stock = "Le stock est requis";
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = "Le stock doit être un nombre positif ou zéro";
    }
    
    if (!isEditing && !image) {
      newErrors.image = "L'image est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Le fichier doit être une image" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "L'image ne doit pas dépasser 5MB" });
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (isEditing) {
      setExistingImage(null);
    }
    document.getElementById('image-input').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      if (isEditing) {
        await updateProduct(id, formDataToSend);
      } else {
        await createProduct(formDataToSend);
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setErrors({ 
        submit: error.response?.data?.error || 'Erreur lors de la sauvegarde' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du produit {!isEditing && '*'}
            </label>
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition">
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-input').click()}
                    className="w-full py-8 flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Cliquez pour sélectionner une image
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, GIF jusqu'à 5MB
                    </span>
                  </button>
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {(imagePreview || existingImage) && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview || existingImage}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Prix et Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (Ar) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="100"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner</option>
                <option value="Panneaux solaires">Panneaux solaires</option>
                <option value="Batteries">Batteries</option>
                <option value="Onduleurs">Onduleurs</option>
                <option value="Kits complets">Kits complets</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Enregistrer
                </>
              )}
            </button>
            <Link
              to="/admin/products"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Annuler
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}