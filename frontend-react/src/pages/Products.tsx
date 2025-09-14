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
  shop?: {
    name: string;
  };
}

interface CartItem extends Product {
  quantity: number;
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(''); // ✅ new
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allowPartialOrder, setAllowPartialOrder] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [hasNewLogs, setHasNewLogs] = useState<boolean>(false);

  const userRole = sessionStorage.getItem('role');
  const token = sessionStorage.getItem("token");
  const shopName = sessionStorage.getItem("shop_name");

  // ✅ Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // reset to first page when query changes
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchProducts = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: currentPage,
          per_page: 16,
          search: debouncedSearchQuery, // ✅ use debounced value
        },
      });
      setProducts(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to fetch products.', {
          position: "top-center",
        });
        if (error.response.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");
          navigate('/login', { replace: true });
        }
      } else {
        toast.error('An unexpected error occurred.', {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, debouncedSearchQuery, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;

    if (!token) {
      toast.error("Authentication failed. Please log in again.", { position: "top-center" });
      navigate('/login', { replace: true });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/products/delete/${productToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success("Product deleted successfully!", { position: "top-center" });
      fetchProducts();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to delete product.', {
          position: "top-center",
        });
      } else {
        toast.error('An unexpected error occurred.', {
          position: "top-center",
        });
      }
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  }, [navigate, fetchProducts, productToDelete, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleLogout = async () => {
    if (!token) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("shop_name");
      navigate('/login', { replace: true });
      return;
    }
  
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success('Logged out successfully.', { position: "top-center" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Logout failed.', {
          position: "top-center",
        });
      } else {
        toast.error('An unexpected error occurred during logout.', {
          position: "top-center",
        });
      }
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("shop_name");
      toast.dismiss();
      navigate('/login', { replace: true });
    }
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

  const handleLogsClick = () => {
    setIsLogsOpen(true);
    setHasNewLogs(false);
  };

  const handleNewLogs = useCallback(() => {
    setHasNewLogs(true);
    toast.info("You have new notification!", { position: "top-center" });
  }, []);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        {/* Left: Notification bell */}
        <div className="relative text-gray-600 hover:text-gray-800 cursor-pointer" onClick={handleLogsClick}>
          <svg className="w-[36px] h-[36px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
          </svg>

          {hasNewLogs && (
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
          {userRole === 'SHOP OWNER' && (
            <button
              onClick={() => navigate('/products/create')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300"
            >
              Add Product
            </button>
          )}
          {userRole === 'CUSTOMER' && (
            <div
              className="relative text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 
                  13L5.4 5M7 13l-2.293 2.293c-.63.63-.116 
                  1.626.704 1.626H19"/>
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

      {/* Main content */}
      <div className="flex">
        {/* Products Grid */}
        <div className="p-8 flex-1">
          {userRole === "SHOP OWNER" && shopName && (
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-md">
                {shopName}
              </h2>
            </div>
          )}
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
                        <p className="text-sm text-gray-800 font-semibold mt-1">In Stock: {product.stock}</p>
                        {userRole === 'CUSTOMER' && (
                          <p className="text-sm text-gray-500 mt-1">Shop: {product?.shop?.name}</p>
                        )}
                        {userRole === 'CUSTOMER' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                          >
                            Add to Cart
                          </button>
                        )}

                        {userRole === 'SHOP OWNER' && (
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/edit/${product.id}`);
                              }}
                              className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-300"
                            >
                              Edit Product
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(product);
                              }}
                              className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                            >
                              Delete
                            </button>
                          </div>
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
                      className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
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

      {/* Side panels */}
      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        allowPartialOrder={allowPartialOrder}
        setAllowPartialOrder={setAllowPartialOrder}
        setLoading={() => { }}
        API_BASE_URL={API_BASE_URL}
        IMAGE_BASE_URL={IMAGE_BASE_URL}
      />
      <Logs
        isLogsOpen={isLogsOpen}
        setIsLogsOpen={setIsLogsOpen}
        onNewLogs={handleNewLogs}
      />
      <ToastContainer />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && productToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{productToDelete.name}</span>?
            </p>
            <p className="mt-1 text-sm text-red-500">This action cannot be undone.</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
