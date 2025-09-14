# Backend APIs Documentation

This folder contains the Laravel-based REST API backend for the multi-tenant e-commerce evaluation project.

## 🚀 Getting Started

After setting up the project following the main README instructions, you can interact with these APIs using the provided Postman collection.

📎 **[Download Postman Collection](link-to-postman-collection)**

## 🔗 API Endpoints Overview

The following endpoints are available for interacting with the multi-tenant system:

```
POST       api/v1/login
POST       api/v1/logout
GET        api/v1/logs
POST       api/v1/place-order
POST       api/v1/products/create
DELETE     api/v1/products/delete/{product}
GET        api/v1/products/list
PATCH      api/v1/products/update/{product}
GET        api/v1/products/view/{product}
```

## 📖 API Documentation

### 🔐 Authentication Endpoints

#### `POST api/v1/login`
**Purpose:** User authentication endpoint  
**Description:** Allows users to log in and obtain access tokens for subsequent API calls. Required for accessing all protected endpoints.

#### `POST api/v1/logout`
**Purpose:** User logout  
**Description:** Terminates the current user session and invalidates the access token.

---

### 🛍️ Product Management Endpoints

#### `POST api/v1/products/create`
**Purpose:** Create new products  
**Access:** Shop Owner only  
**Description:** Allows shop owners to add new products to their inventory. Products are automatically associated with the authenticated shop owner's store, ensuring proper tenant isolation.

#### `DELETE api/v1/products/delete/{product}`
**Purpose:** Delete products  
**Access:** Shop Owner only  
**Description:** Removes a product from the shop's inventory. Only the shop owner associated with the product can delete it, ensuring data security across tenants.

#### `PATCH api/v1/products/update/{product}`
**Purpose:** Update existing products  
**Access:** Shop Owner only  
**Description:** Allows shop owners to modify their product details such as name, price, description, and inventory levels. Only products belonging to the authenticated shop owner can be updated.

#### `GET api/v1/products/list`
**Purpose:** Retrieve product listings  
**Access:** All authenticated users  
**Description:** Returns product data based on user role:
- **Shop Owners:** See only products from their own shop
- **Customers:** See products from all shops for browsing and purchasing

#### `GET api/v1/products/view/{product}`
**Purpose:** View specific product details  
**Access:** All authenticated users  
**Description:** Retrieves detailed information about a specific product, including specifications, pricing, and availability.

---

### 🛒 Order Management Endpoints

**⚠️ Important:** This API uses background jobs to process orders. Make sure to run the queue worker before calling this endpoint:
> ```bash
> php artisan queue:work
> # or
> php artisan queue:listen
> ```

#### `POST api/v1/place-order`
**Purpose:** Place new orders  
**Access:** Customer only  
**Description:** Allows customers to create orders for multiple products from different shops. Supports multi-product ordering with proper inventory management and shop notifications. Customers can choose whether to allow partial orders (proceed even if some products are unavailable) or require all products to be available before processing the order.

---

### 📊 Notification & Logging Endpoints

#### `GET api/v1/logs`
**Purpose:** Retrieve user notifications and activity logs  
**Access:** All authenticated users  
**Description:** Returns relevant notifications based on user role:
- **Customers:** Notifications about orders placed or skipped due to inventory unavailability
- **Shop Owners:** Notifications related to orders of their products

---

## 🔒 Security & Multi-Tenancy

This API implements robust multi-tenant architecture with the following security measures:

- **Role-based access control** (Shop Owner vs Customer permissions) implemented using a custom middleware named `RoleAccessControlMiddleware`
- **Data isolation** ensuring shops can only access and perform actions on their own resources, enforced through Laravel policies
- **Authentication required** for all endpoints except login, implemented with Laravel Sanctum
- **Tenant-specific filtering** on all data queries

## 🧪 Testing

### Postman Collection
Use the provided Postman collection to test all endpoints with pre-configured requests and proper authentication headers. Each endpoint includes example payloads and expected responses.

### Automated Tests
The project includes comprehensive automated tests for code quality assurance. You can review the following test files:

- `ProductApiTest.php` - API endpoint testing
- `ProductServiceTest.php` - Service layer testing

**Run tests with:**
```bash
php artisan test
```

---

*For frontend integration details, refer to the main project README and the frontend-react documentation.*