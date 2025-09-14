import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'customer' | 'shop'>('customer');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const isShopOwner = activeTab === 'shop' ? 1 : 0;

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password,
                is_shop_owner: isShopOwner,
            });
            if (response.data.status == 1) {
                const { token, data } = response.data;
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("role", data.role);
                sessionStorage.setItem("shop_name", data?.shop?.name);
                toast.success('Login successful!', {
                    position: "top-center",
                    autoClose: 1000,
                });
                navigate('/products', { replace: true });
            } else {
                toast.error(response.data.message ?? 'Login failed. something went wrong', {
                    position: "top-center",
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Login failed. Please check your credentials.', {
                    position: "top-center",
                });
            } else {
                toast.error('An unexpected error occurred.', {
                    position: "top-center",
                });
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
                <div className="flex mb-6 text-center">
                    <button
                        onClick={() => setActiveTab('customer')}
                        className={`flex-1 py-2 px-4 rounded-t-lg transition-colors duration-300 ${activeTab === 'customer'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`flex-1 py-2 px-4 rounded-t-lg transition-colors duration-300 ${activeTab === 'shop'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        Shop
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <h2 className="text-xl font-bold text-center mb-4">Login as {activeTab === 'customer' ? 'Customer' : 'Shop'}</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
