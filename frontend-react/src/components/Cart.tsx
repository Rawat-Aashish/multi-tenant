import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

interface CartProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  allowPartialOrder: boolean;
  setAllowPartialOrder: (allow: boolean) => void;
  setLoading: (loading: boolean) => void;
  API_BASE_URL: string;
  IMAGE_BASE_URL: string;
}

const Cart: React.FC<CartProps> = ({
  isCartOpen,
  setIsCartOpen,
  cartItems,
  setCartItems,
  allowPartialOrder,
  setAllowPartialOrder,
  setLoading,
  API_BASE_URL,
  IMAGE_BASE_URL
}) => {
  const handleIncreaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (productId: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.info("Product removed from cart.", { position: "top-center" });
  };

  const handleOrder = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.dismiss();
      toast.error("Authentication failed. Please log in again.", { position: "top-center" });
      return;
    }

    if (cartItems.length === 0) {
      toast.warn("Your cart is empty!", { position: "bottom-center" });
      return;
    }

    const orderPayload = {
      products: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
      allow_partial_order: allowPartialOrder ? 1 : 0,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/place-order`, orderPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(response.data.message || "Order placed successfully!", { position: "top-center" });
      setCartItems([]);
      localStorage.removeItem('cart');
      setIsCartOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to place order.', {
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
  };

  const totalCartPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={() => {
              toast.dismiss(); // Dismiss all toasts before closing the cart
              setIsCartOpen(false);
            }} className="text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-2 mb-4 bg-gray-100 rounded-lg shadow-sm">
                  <img
                    src={`${IMAGE_BASE_URL}/64x64/e0e0e0/ffffff?text=${item.name.slice(0, 1)}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDecreaseQuantity(item.id)} className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">-</button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(item.id)} className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">+</button>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
            )}
          </div>
          <div className="p-4 border-t sticky bottom-0 bg-white">
            <div className="flex items-center justify-between font-bold mb-4">
              <span>Total:</span>
              <span>${totalCartPrice}</span>
            </div>
            <div className="flex items-center justify-center mb-4">
              <label htmlFor="partialOrder" className="mr-2 text-md text-gray-700 font-semibold">
                Allow partial order
              </label>
              <input
                type="checkbox"
                id="partialOrder"
                checked={allowPartialOrder}
                onChange={(e) => setAllowPartialOrder(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
            </div>
            <button
              onClick={handleOrder}
              disabled={cartItems.length === 0}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
