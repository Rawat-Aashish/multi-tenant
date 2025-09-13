import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ProductData {
  name: string;
  sku: string;
  price: string;
  stock: string;
}

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    sku: '',
    price: '',
    stock: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = sessionStorage.getItem('token');
      if (!token || !id) {
        toast.error("Authentication failed or invalid product ID.", { position: "top-center" });
        navigate('/products');
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/products/view/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const product = response.data.data;
        setFormData({
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock: product.stock,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || 'Failed to fetch product data.', { position: "top-center" });
        } else {
          toast.error('An unexpected error occurred.', { position: "top-center" });
        }
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error("Authentication failed. Please log in again.", { position: "top-center" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.patch(`${API_BASE_URL}/products/update/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success(response.data.message || 'Product updated successfully!', { position: "top-center" });
      navigate('/products');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to update product.', { position: "top-center" });
      } else {
        toast.error('An unexpected error occurred.', { position: "top-center" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 ring-2 ring-gray-200 outline-none"
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              id="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 ring-2 ring-gray-200 outline-none"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 ring-2 ring-gray-200 outline-none"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 ring-2 ring-gray-200 outline-none"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
