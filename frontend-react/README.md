# Frontend Documentation

This folder contains the React-based frontend application that provides the user interface for the multi-tenant e-commerce system. It consumes the Laravel APIs to deliver a complete shopping and shop management experience.

## 🚀 Getting Started

After following the setup instructions in the main project README, you can access the application by opening your browser and navigating to:

**🌐 [http://localhost:5173](http://localhost:5173)**

## 🔐 Login & Authentication

The application opens with a **Login Form** featuring two tabs at the top:
- **Shop Owner** tab
- **Customer** tab

Toggle between these tabs to log in with the respective user role and access role-specific features.

### 🔑 Test Credentials

**Shop Owners:**
- `icecreams@havmore.com` | Password: `password`
- `waffles@belgian.com` | Password: `password`

**Customers:**
- `first@customer.com` | Password: `password`
- `second@customer.com` | Password: `password`

---

## 👑 Shop Owner Interface

When logged in as a **Shop Owner**, you'll have access to comprehensive shop management features:

### 🏪 Shop Dashboard
- **Shop Name Display** - Your shop name is prominently displayed at the top of the interface
- **Product List** - View all products belonging to your shop with pagination support
- **Product Navigation** - Browse through your inventory using the pagination controls

### 🔍 Navigation & Search
- **Top Navigation Bar** with centrally located search functionality
- **Search Bar** - Quickly find specific products in your inventory
- **Responsive Layout** - Clean and intuitive interface design

### ⚡ Action Buttons
**Right Side:**
- **"Add Product"** button - Create new products for your shop
- **"Logout"** button - Sign out of your account

**Left Side:**
- **Bell Icon (🔔)** - Access your notification center

### 📢 Notifications System
- **Order Notifications** - Receive alerts when customers order your products
- **Toast Messages** - Real-time popup notifications for new orders
- **Visual Indicators** - Red dot appears on the bell icon for unread notifications
- **Notification Center** - View all notifications related to orders from your shop

### 🛍️ Product Management
Each product card includes:
- **Delete Option** - Remove products from your inventory
- **Update Option** - Modify product details and information

---

## 🛒 Customer Interface

When logged in as a **Customer**, the interface adapts to provide a shopping-focused experience:

### 🏬 Shopping Experience
- **No Shop Name Display** - Interface focuses on browsing all available products
- **Product Browsing** - View products from all shops in the system
- **Clean Product Cards** - Streamlined design without management options

### 🧭 Customer Navigation
**Right Side:**
- **Cart Button** - Opens shopping cart sidebar (replaces "Add Product" button)
- **Logout Button** - Sign out of your account

**Left Side:**
- **Bell Icon (🔔)** - Access order notifications and updates

### 🛍️ Shopping Cart Features
- **Cart Sidebar** - View selected products before purchase
- **Product Management** - Add/remove items from cart
- **Frontend Cart Handling** - Currently managed client-side (can be enhanced with backend integration for production)

### 📦 Order Placement
**Advanced Order Options:**
- **"Allow Partial Orders" Checkbox** - Located at the bottom of cart, above the "Place Order" button
- **Flexible Ordering** - Choose whether to proceed with partial availability or require all products to be in stock
- **Order Confirmation** - Complete the purchase process with your selected preferences

### 📨 Customer Notifications
- **Order Status** - Notifications about successfully placed orders
- **Inventory Updates** - Alerts about skipped products due to unavailability
- **Real-time Updates** - Stay informed about your order processing

---

## 🔄 Shared Features

Both user roles enjoy:
- **Responsive Design** - Optimized for various screen sizes
- **Real-time Notifications** - Instant updates via toast messages
- **Intuitive Navigation** - User-friendly interface design
- **Secure Authentication** - Role-based access control
- **Seamless API Integration** - Smooth communication with Laravel backend

---

*This frontend application demonstrates modern React development practices with role-based UI adaptation and real-time user experience features.*