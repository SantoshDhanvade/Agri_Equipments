# AGRIEQUIPMENTS - Agricultural Equipment E-Commerce Platform

## Project Overview

AGRIEQUIPMENTS is a complete full-stack web application for an agricultural equipment e-commerce platform. It provides a comprehensive solution for farmers and agricultural businesses to browse, purchase, and manage agricultural equipment online. The platform features separate interfaces for customers and administrators, with robust backend API support and a modern React frontend.

## Features

### Customer Features
- **User Registration & Authentication**: Secure registration with location details (State, District, Taluka)
- **Equipment Browsing**: Browse equipment by categories with filtering options
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Place orders, view order history, and track order details
- **Review System**: Submit and view product reviews
- **Feedback System**: Submit general feedback
- **Wishlist**: Save favorite equipment for later
- **Profile Management**: Update personal information

### Admin Features
- **Secure Admin Login**: Dedicated admin authentication
- **Equipment Management**: Add, edit, delete equipment with image uploads
- **Customer Management**: View, suspend, or delete customer accounts
- **Review Moderation**: Approve or reject customer reviews
- **Feedback Management**: View and resolve customer feedback
- **Order Monitoring**: Track all orders and order details

### Equipment Categories
The platform includes 9 predefined equipment categories:
1. **Machines** - Farming and harvesting equipment
2. **Farms** - Farm management equipment
3. **Seeds** - High-quality crop seeds
4. **Trees** - Saplings and tree seedlings
5. **Fertilizers** - Chemical and organic fertilizers
6. **Micronutrients** - Trace elements for crop growth
7. **Bio-Stimulants** - Biological growth stimulants
8. **Soil Conditioners** - Soil improvement products
9. **Organic Amendments** - Natural soil amendments and compost

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Backend** | Spring Boot | 3.4.0 |
| **Language** | Java | 21 |
| **Database** | SQLite | - |
| **Build Tool** | Maven | - |
| **Frontend** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.2 |
| **HTTP Client** | Axios | - |
| **Styling** | CSS3 | - |
| **Password Hashing** | BCrypt | - |

## Project Structure

```
AGRIEQUIPMENTS/
├── BackEnd/                          # Spring Boot Backend
│   ├── pom.xml                       # Maven dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/backend/AGRIEQUIPMENTS/
│   │   │   │   ├── AgriEquipmentsApplication.java    # Main application class
│   │   │   │   ├── AppConfig.java                     # Configuration for uploads & security
│   │   │   │   ├── DataBaseHandle/
│   │   │   │   │   └── SQLiteHandler.java             # Database operations
│   │   │   │   ├── PostGet/
│   │   │   │   │   ├── ApiControll.java               # Customer API endpoints
│   │   │   │   │   └── AdminApiControll.java          # Admin API endpoints
│   │   │   │   └── Util/
│   │   │   │       └── PasswordUtil.java              # Password encryption utilities
│   │   │   └── resources/
│   │   │       └── application.properties            # Application configuration
│   │   └── test/                      # Unit tests
│   └── target/                        # Build output
├── FrountEnd/                         # React Frontend
│   ├── package.json                   # Node.js dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── Admin/                     # Admin components
│   │   │   ├── AdminCustomerDetail.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── EquipmentForm.jsx
│   │   ├── components/                # Shared components
│   │   │   └── Navbar.jsx
│   │   ├── css/                       # Stylesheets
│   │   │   ├── AdminDashboard.css
│   │   │   ├── AdminLogin.css
│   │   │   ├── Cart.css
│   │   │   ├── Equipment.css
│   │   │   ├── EquipmentForm.css
│   │   │   ├── Login.css
│   │   │   ├── Navbar.css
│   │   │   ├── OrderDetail.css
│   │   │   ├── Orders.css
│   │   │   ├── Register.css
│   │   │   └── Support.css
│   │   ├── javaScript/                # Utility scripts
│   │   ├── pages/                     # Customer pages
│   │   │   ├── About.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Equipment.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Support.jsx
│   │   ├── AdminAuthContext.jsx       # Admin authentication context
│   │   ├── App.css                    # Global styles
│   │   ├── App.jsx                    # Main application component
│   │   ├── AuthContext.jsx            # Customer authentication context
│   │   └── main.jsx                   # Application entry point
│   └── index.html                     # HTML template
├── LICENSE                            # MIT License
├── README.md                          # This file
└── .gitignore                         # Git ignore rules
```

## Database Schema

The application uses SQLite with 10 tables:

### 1. customer
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- name (TEXT)
- email (TEXT UNIQUE)
- phone (TEXT)
- state (TEXT)
- district (TEXT)
- taluka (TEXT)
- password (TEXT)
- profile_image (TEXT)
- created_at (TIMESTAMP)

### 2. equipment
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- name (TEXT)
- description (TEXT)
- price (REAL)
- category_id (INTEGER)
- image (TEXT)
- stock_quantity (INTEGER)
- created_at (TIMESTAMP)
- FOREIGN KEY (category_id) REFERENCES equipment_category(id)

### 3. equipment_category
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- name (TEXT)
- description (TEXT)

### 4. cart
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- customer_id (INTEGER)
- equipment_id (INTEGER)
- quantity (INTEGER)
- added_at (TIMESTAMP)
- FOREIGN KEY (customer_id) REFERENCES customer(id)
- FOREIGN KEY (equipment_id) REFERENCES equipment(id)

### 5. orders
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- customer_id (INTEGER)
- total_amount (REAL)
- status (TEXT)
- shipping_address (TEXT)
- order_date (TIMESTAMP)
- FOREIGN KEY (customer_id) REFERENCES customer(id)

### 6. order_items
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- order_id (INTEGER)
- equipment_id (INTEGER)
- quantity (INTEGER)
- price (REAL)
- FOREIGN KEY (order_id) REFERENCES orders(id)
- FOREIGN KEY (equipment_id) REFERENCES equipment(id)

### 7. wishlist
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- customer_id (INTEGER)
- equipment_id (INTEGER)
- added_at (TIMESTAMP)
- FOREIGN KEY (customer_id) REFERENCES customer(id)
- FOREIGN KEY (equipment_id) REFERENCES equipment(id)

### 8. review
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- customer_id (INTEGER)
- equipment_id (INTEGER)
- rating (INTEGER)
- comment (TEXT)
- status (TEXT)
- created_at (TIMESTAMP)
- FOREIGN KEY (customer_id) REFERENCES customer(id)
- FOREIGN KEY (equipment_id) REFERENCES equipment(id)

### 9. feedback
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- customer_id (INTEGER)
- subject (TEXT)
- message (TEXT)
- status (TEXT)
- created_at (TIMESTAMP)
- FOREIGN KEY (customer_id) REFERENCES customer(id)

### 10. admin
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- username (TEXT UNIQUE)
- password (TEXT)

## API Endpoints

### Customer Endpoints

#### Authentication
- `POST /login` - Customer login
- `POST /register` - Customer registration

#### Equipment
- `GET /equipment` - Get all equipment
- `GET /equipment/{id}` - Get equipment details
- `GET /equipment/category/{categoryId}` - Get equipment by category
- `GET /categories` - Get all categories

#### Cart Management
- `POST /cart` - Add item to cart
- `GET /cart/{customerId}` - Get cart items
- `PUT /cart/{cartId}` - Update cart item quantity
- `DELETE /cart/{cartId}` - Remove item from cart

#### Orders
- `POST /order` - Create new order
- `GET /orders/{customerId}` - Get customer orders
- `GET /order/{orderId}` - Get order details

#### Reviews & Feedback
- `POST /review` - Submit product review
- `GET /reviews/{equipmentId}` - Get equipment reviews
- `POST /feedback` - Submit feedback

### Admin Endpoints

#### Authentication
- `POST /admin/login` - Admin login

#### Equipment Management
- `GET /admin/equipment` - Get all equipment
- `POST /admin/equipment` - Add new equipment
- `PUT /admin/equipment/{id}` - Update equipment
- `DELETE /admin/equipment/{id}` - Delete equipment

#### Customer Management
- `GET /admin/customers` - Get all customers
- `POST /admin/customers/{id}/suspend` - Suspend customer
- `DELETE /admin/customers/{id}` - Delete customer

#### Review Management
- `GET /admin/reviews` - Get all reviews
- `POST /admin/reviews/{id}/approve` - Approve review

#### Feedback Management
- `GET /admin/feedbacks` - Get all feedbacks
- `POST /admin/feedbacks/{id}/solve` - Resolve feedback

#### Order Management
- `GET /admin/orders` - Get all orders

## Setup Instructions

### Prerequisites
- Java JDK 21 or higher
- Node.js (v16 or higher)
- Maven
- Git (optional)

### Backend Setup

1. **Navigate to Backend Folder**
   ```bash
   cd AGRIEQUIPMENTS/BackEnd
   ```

2. **Install Dependencies**
   ```bash
   mvn clean install
   ```

3. **Start Backend Server**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

4. **Verify Backend**
   - Check console for: "AgriEquipmentsApplication started successfully"
   - Database file `db.sqlite` will be created automatically

### Frontend Setup

1. **Navigate to Frontend Folder**
   ```bash
   cd AGRIEQUIPMENTS/FrountEnd
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## Accessing the Application

### Customer Portal
1. Navigate to: `http://localhost:5173`
2. Register a new account or login
3. Browse equipment, manage cart, place orders

### Admin Panel
1. Navigate to: `http://localhost:5173/admin/login`
2. Login with:
   - Username: `AgriAdmin`
   - Password: `AgriEquipments@2025`

## File Upload Configuration

- **Equipment Images**: Stored in `BackEnd/Uploads/Equipment/`
- **Customer Profile Images**: Stored in `BackEnd/Uploads/Customer/`
- **Maximum File Size**: 50MB per file
- **Access URL**: `http://localhost:8080/uploads/[folder]/[filename]`

## Security Features

- **Password Hashing**: BCrypt encryption for all passwords
- **Admin Authentication**: Secure admin login system
- **CORS Configuration**: Configured for localhost development
- **File Upload Security**: Server-side file handling

## Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change port in `application.properties` or kill process
- **Maven issues**: Run `mvn clean install -U`
- **Database corruption**: Delete `db.sqlite` and restart

### Frontend Issues
- **Dependencies**: Run `npm cache clean --force && npm install`
- **CORS errors**: Ensure backend is running on port 8080
- **Port conflicts**: Vite will prompt for alternative port

## Development Workflow

### Backend Changes
1. Edit Java files in `BackEnd/src/main/java`
2. Restart with `mvn spring-boot:run`

### Frontend Changes
1. Edit React files in `FrountEnd/src`
2. Vite hot-reloads automatically

## Building for Production

### Backend
```bash
cd BackEnd
mvn clean package -DskipTests
java -jar target/AGRIEQUIPMENTS-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd FrountEnd
npm run build
# Deploy dist/ folder
```

## Default Admin Credentials
- Username: `AgriAdmin`
- Password: `AgriEquipments@2025`

## Learning Outcomes

This project demonstrates:
- Full-stack web development with Spring Boot and React
- Database design and SQLite integration
- RESTful API development
- Authentication and authorization
- File upload handling
- E-commerce functionality
- Admin dashboard implementation
- Responsive UI design

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Santosh Dhanvade

## Repository

https://github.com/SantoshDhanvade/Agri_Equipments