# AgriEquipments Platform

A complete agricultural equipment marketplace platform with customer and admin panels.

## Project Structure

### Backend (Spring Boot)

```
BackEnd/
├── src/main/java/backend/AGRIEQUIPMENTS/
│   ├── AppConfig.java                 # Spring configuration
│   ├── DataBaseHandle/
│   │   └── SQLiteHandler.java        # Database operations
│   ├── PostGet/
│   │   ├── ApiControll.java          # Customer API endpoints
│   │   └── AdminApiControll.java     # Admin API endpoints
│   └── Util/
│       └── PasswordUtil.java         # Password hashing utility
├── Uploads/
│   ├── Equipment/                     # Equipment images
│   └── Customer/                      # Customer profile images
└── pom.xml                           # Maven dependencies
```

### Frontend (React + Vite)

```
FrountEnd/
├── src/
│   ├── App.jsx                       # Main app with routing
│   ├── AuthContext.jsx               # Customer authentication context
│   ├── AdminAuthContext.jsx          # Admin authentication context
│   ├── Admin/
│   │   ├── AdminLogin.jsx            # Admin login page
│   │   ├── AdminDashboard.jsx        # Admin panel
│   │   └── EquipmentForm.jsx         # Add/Edit equipment form
│   ├── pages/
│   │   ├── Login.jsx                 # Customer login
│   │   ├── Register.jsx              # Customer registration
│   │   ├── Equipment.jsx             # Equipment catalog
│   │   ├── Cart.jsx                  # Shopping cart
│   │   ├── Orders.jsx                # Order history
│   │   └── OrderDetail.jsx           # Order details
│   ├── components/
│   │   └── Navbar.jsx                # Navigation bar
│   └── css/                          # Stylesheets
├── package.json
└── vite.config.js
```

## Features

### Customer Features
- User Registration and Login
- Browse agricultural equipment by categories:
  - Machines
  - Farms
  - Seeds
  - Trees
  - Fertilizers
  - Micronutrients
  - Bio-Stimulants
  - Soil Conditioners
  - Organic Amendments
- Shopping Cart Management
- Order Placement
- Order History and Tracking
- Product Reviews

### Admin Features
- Admin Login with credentials
- Equipment Management (Add, Edit, Delete)
- Customer Management (Suspend/Delete)
- Review Management (Approve/Reject)
- Feedback Management
- Order Management

## Database Schema

### Tables
- **customer**: Customer profiles and authentication
- **equipment**: Product catalog
- **equipment_category**: Product categories
- **cart**: Shopping cart items
- **orders**: Order records
- **order_items**: Order line items
- **wishlist**: Customer wishlists
- **review**: Product reviews
- **feedback**: General feedback
- **admin**: Admin credentials

## API Endpoints

### Authentication
- `POST /login` - Customer login
- `POST /register` - Customer registration
- `POST /admin/login` - Admin login

### Equipment
- `GET /equipment` - Get all equipment
- `GET /equipment/:id` - Get equipment details
- `GET /equipment/category/:categoryId` - Get equipment by category
- `GET /categories` - Get all categories

### Cart & Orders
- `POST /cart` - Add to cart
- `GET /cart/:customerId` - Get cart
- `PUT /cart/:cartId` - Update quantity
- `DELETE /cart/:cartId` - Remove from cart
- `POST /order` - Create order
- `GET /orders/:customerId` - Get customer orders
- `GET /order/:orderId` - Get order details

### Admin Operations
- `GET /admin/equipment` - Get all equipment
- `POST /admin/equipment` - Add equipment
- `PUT /admin/equipment/:id` - Update equipment
- `DELETE /admin/equipment/:id` - Delete equipment
- `GET /admin/customers` - Get all customers
- `POST /admin/customers/:id/suspend` - Suspend customer
- `GET /admin/reviews` - Get all reviews
- `POST /admin/reviews/:id/approve` - Approve review

## Default Credentials

**Admin Login:**
- Username: `AgriAdmin`
- Password: `AgriEquipments@2025`

## Setup Instructions

### Backend Setup
1. Navigate to `BackEnd` folder
2. Run: `mvn clean install`
3. Run: `mvn spring-boot:run`
4. Backend will be available at `http://localhost:8080`

### Frontend Setup
1. Navigate to `FrountEnd` folder
2. Run: `npm install`
3. Run: `npm run dev`
4. Frontend will be available at `http://localhost:5173`

## File Upload
- Equipment images are stored in `BackEnd/Uploads/Equipment/`
- Customer profile images are stored in `BackEnd/Uploads/Customer/`
- Images are accessible via `http://localhost:8080/uploads/`

## Technologies Used

### Backend
- Spring Boot 3.4.0
- Java 21
- SQLite Database
- Spring Security (BCrypt password hashing)
- Maven

### Frontend
- React 19.2.0
- Vite 7.2.2
- React Router 7.9.6
- Axios for API calls
- CSS3 for styling

## Color Scheme
- Primary Green: `#2c5f2d`
- Dark Green: `#1e4620`
- Light Green: `#4a8f50`
- Accent Red: `#e74c3c`
- Danger Red: `#c1392b`

## Future Enhancements
- Payment gateway integration
- Email notifications
- Advanced search and filtering
- Wishlist management
- Product recommendations
- User ratings and analytics
- SMS notifications
