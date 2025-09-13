import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProductsPage from './pages/Products';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/create" element={<CreateProductPage />} />
      <Route path="/products/edit/:id" element={<EditProductPage />} />
      <Route path="/" element={<ProductsPage />} />
    </Routes>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
