# Multi-Tenant E-commerce System

Welcome! This repository contains my code for a technical interview assignment focused on building a multi-tenant inventory and order management system.

## 📋 Task Overview

**Objective:** Build a multi-tenant Inventory & Order Management system where multiple shops can independently manage their products and orders with complete data isolation between tenants.

This implementation demonstrates:
- Multi-tenant architecture with data isolation
- RESTful API design
- Modern frontend-backend separation
- Scalable e-commerce functionality

## Repository Structure

This project is organized into two main components:

```
multi-tenant/
├── backend-apis/     # Laravel API backend
└── frontend-react/   # React frontend application
```

- **`backend-apis/`** - Contains the Laravel-based REST API that handles all business logic, authentication, and data management
- **`frontend-react/`** - Houses the React frontend that consumes the APIs and provides the user interface

## 🛠️ Prerequisites

Before running this project, ensure you have the following installed on your system:

- **XAMPP** (or any local server environment)
- **Composer** (PHP package manager)
- **Laravel** (PHP framework)
- **Node.js** (JavaScript runtime)
- **npm** (Node package manager)
- **Code Editor** (VS Code recommended)

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/Rawat-Aashish/multi-tenant.git
cd multi-tenant
```

### Step 2: Backend Setup (Laravel APIs)

Navigate to the backend directory and open it in your preferred code editor, then run the following commands in the terminal:

```bash
# Copy environment configuration
cp .env.example .env

# Install PHP dependencies
composer install --ignore-platform-reqs

# Generate application key
php artisan key:generate

# Run database migrations (add --seed for dummy data)
php artisan migrate:fresh

# Start the Laravel development server
php artisan serve
```

🎉 Your APIs are now running! For detailed API documentation and usage examples, check the README in the `backend-apis` folder.

### Step 3: Frontend Setup (React)

Open the frontend directory in a separate code editor window and run these commands:

```bash
# Install Node dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the React development server
npm run dev
```

## ✅ You're All Set!

Both the backend and frontend should now be running successfully. The React application will automatically connect to the Laravel API endpoints to provide a complete multi-tenant e-commerce experience.

## 📚 Additional Resources

- Backend API documentation: See [Readme.md](./backend-apis/README.md)
- Frontend component guide: See [Readme.md](./frontend-react/README.md)

---
