import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from '../components/Cart';
import Logs from '../components/Logs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

interface Product {
  id: number;
  shop_id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  image_path?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Simple debounce function to limit API calls on search input
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allowPartialOrder, setAllowPartialOrder] = useState<boolean>(false);
  const [showLogsDot, setShowLogsDot] = useState<boolean>(false);
  
  const userRole = sessionStorage.getItem('role');

  const fetchProducts = useCallback(async (page: number, search: string) => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.dismiss(); // Dismiss all toasts before navigating
      toast.error("Authentication failed. Please log in again.", { position: "top-center" });
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/products/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: page,
          per_page: 16,
          search: search
        }
      });
      setProducts(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to fetch products.', {
          position: "top-center",
        });
      } else {
        toast.error('An unexpected error occurred.', {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setCurrentPage(1); // Reset to first page on new search
      fetchProducts(1, query);
    }, 500),
    [fetchProducts]
  );

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [currentPage, fetchProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    toast.dismiss(); // Dismiss all toasts before navigating
    toast.info('Logged out successfully.', {
      position: "top-center",
    });
    navigate('/login', { replace: true });
  };

  const handleAddToCart = (product: Product) => {
    const newCart = [...cartItems];
    const existingItem = newCart.find(item => item.id === product.id);

    if (existingItem) {
      toast.warn("Product is already in the cart!", { position: "top-center" });
    } else {
      newCart.push({ ...product, quantity: 1 });
      setCartItems(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      toast.success(`${product.name} added to cart!`, { position: "top-center" });
    }
  };

  const handleOrderSuccess = useCallback(() => {
    setShowLogsDot(true);
    const timer = setTimeout(() => {
      setShowLogsDot(false);
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);

  const totalCartPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        {/* Left: Notification bell */}
        <div className="relative text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => setIsLogsOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a6 6 0 006-6v-3a2 2 0 012-2h1m-14 0h1a2 2 0 012-2v3a6 6 0 006 6v3"
            />
          </svg>
          {showLogsDot && (
            <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </div>
        {/* Center: Search bar */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {/* Right: Cart and Logout button */}
        <div className="flex items-center space-x-4">
          {userRole === 'CUSTOMER' && (
            <div
              className="relative text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.116 1.626.704 1.626H19"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content and Cart side panel */}
      <div className="flex">
        {/* Products Grid */}
        <div className="p-8 flex-1">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Products</h1>
          {loading ? (
            <div className="text-center text-gray-500">Loading products...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={`${IMAGE_BASE_URL}/400x300/e0e0e0/ffffff?text=${product.name}`}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="font-bold text-lg">{product.name}</h2>
                        <p className="text-gray-600 mt-1">${product.price}</p>
                        <p className="text-sm text-gray-500 mt-1">In Stock: {product.stock}</p>
                        
                        {userRole === 'CUSTOMER' && (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-gray-500">No products found.</div>
                )}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        allowPartialOrder={allowPartialOrder}
        setAllowPartialOrder={setAllowPartialOrder}
        setLoading={setLoading}
        API_BASE_URL={API_BASE_URL}
        IMAGE_BASE_URL={IMAGE_BASE_URL}
        onOrderSuccess={handleOrderSuccess}
      />
      <Logs
        isLogsOpen={isLogsOpen}
        setIsLogsOpen={setIsLogsOpen}
        API_BASE_URL={API_BASE_URL}
      />
      <ToastContainer />
    </div>
  );
};

export default ProductsPage;