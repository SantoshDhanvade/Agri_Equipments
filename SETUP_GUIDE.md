# AgriEquipments Platform - Setup Guide

## Quick Start

### Prerequisites
- Java JDK 21
- Node.js (v16 or higher)
- Maven
- Git (optional)

## Backend Setup

### Step 1: Navigate to Backend Folder
```bash
cd c:\my code\SpringBoot\AGRIEQUIPMENTS\BackEnd
```

### Step 2: Install Dependencies
```bash
mvn clean install
```

### Step 3: Start Backend Server
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Step 4: Verify Backend
- Check if you see: "AgriEquipmentsApplication started successfully"
- Database file will be created automatically in the backend folder

## Frontend Setup

### Step 1: Navigate to Frontend Folder
```bash
cd c:\my code\SpringBoot\AGRIEQUIPMENTS\FrountEnd
```

### Step 2: Install Dependencies
```bash
npm install
```

This will download all required packages from package.json

### Step 3: Start Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Accessing the Application

### Customer Portal
1. Navigate to: `http://localhost:5173`
2. Click "Register" to create a new account
3. Fill in your details:
   - Name
   - Email
   - Phone
   - State
   - District
   - Taluka
   - Password
4. Click Login and use your credentials
5. Browse equipment, add to cart, and place orders

### Admin Panel
1. Navigate to: `http://localhost:5173/admin/login`
2. Enter credentials:
   - Username: `AgriAdmin`
   - Password: `AgriEquipments@2025`
3. Access the admin dashboard to:
   - Manage equipment (add, edit, delete)
   - View customer accounts
   - Manage reviews
   - Handle feedbacks
   - Monitor orders

## Project Features

### Equipment Categories
The system includes 9 equipment categories:
1. **Machines** - Farming and harvesting equipment
2. **Farms** - Farm management equipment
3. **Seeds** - High-quality crop seeds
4. **Trees** - Saplings and tree seedlings
5. **Fertilizers** - Chemical and organic fertilizers
6. **Micronutrients** - Trace elements for crop growth
7. **Bio-Stimulants** - Biological growth stimulants
8. **Soil Conditioners** - Soil improvement products
9. **Organic Amendments** - Natural soil amendments and compost

### File Uploads
- **Equipment Images**: Stored in `BackEnd/Uploads/Equipment/`
- **Customer Profile Images**: Stored in `BackEnd/Uploads/Customer/`
- Images are accessible via `http://localhost:8080/uploads/[folder]/[filename]`

## Database Information

- **Type**: SQLite
- **Location**: `BackEnd/db.sqlite` (auto-created)
- **Tables**: 10 tables for complete e-commerce functionality
- **Features**: Auto-incremented IDs, foreign keys, timestamps

### Database Tables
1. **customer** - Customer registration and profiles
2. **equipment** - Product catalog
3. **equipment_category** - Product categories
4. **cart** - Shopping cart items
5. **orders** - Order records
6. **order_items** - Order line items
7. **wishlist** - Customer wishlists
8. **review** - Product reviews
9. **feedback** - General feedback
10. **admin** - Admin credentials

## API Endpoints Reference

### Customer Endpoints
```
POST   /login                              - Customer login
POST   /register                           - Customer registration
GET    /equipment                          - Get all equipment
GET    /equipment/:id                      - Get equipment details
GET    /equipment/category/:categoryId     - Get equipment by category
GET    /categories                         - Get all categories
POST   /cart                               - Add to cart
GET    /cart/:customerId                   - Get cart items
PUT    /cart/:cartId                       - Update quantity
DELETE /cart/:cartId                       - Remove from cart
POST   /order                              - Create order
GET    /orders/:customerId                 - Get customer orders
GET    /order/:orderId                     - Get order details
POST   /review                             - Submit review
GET    /reviews/:equipmentId               - Get equipment reviews
POST   /feedback                           - Submit feedback
```

### Admin Endpoints
```
POST   /admin/login                        - Admin login
GET    /admin/equipment                    - Get all equipment
POST   /admin/equipment                    - Add equipment
PUT    /admin/equipment/:id                - Update equipment
DELETE /admin/equipment/:id                - Delete equipment
GET    /admin/customers                    - Get all customers
POST   /admin/customers/:id/suspend        - Suspend customer
DELETE /admin/customers/:id                - Delete customer
GET    /admin/reviews                      - Get all reviews
POST   /admin/reviews/:id/approve          - Approve review
GET    /admin/feedbacks                    - Get all feedbacks
POST   /admin/feedbacks/:id/solve          - Resolve feedback
GET    /admin/orders                       - Get all orders
```

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find process using port 8080 and terminate it
netstat -ano | findstr :8080
taskkill /PID [PID] /F
```

**Maven dependencies not downloading:**
```bash
mvn clean install -U
```

**Database corruption:**
- Delete the `db.sqlite` file in BackEnd folder
- Restart the backend (database will be recreated)

### Frontend Issues

**Port 5173 already in use:**
```bash
# Vite will ask to use a different port
# Or manually specify: npm run dev -- --port 3000
```

**Dependencies not installing:**
```bash
npm cache clean --force
npm install
```

**CORS errors:**
- Ensure backend is running on http://localhost:8080
- Check API endpoints in axios calls

## Building for Production

### Backend Build
```bash
mvn clean package -DskipTests
java -jar target/AGRIEQUIPMENTS-0.0.1-SNAPSHOT.jar
```

### Frontend Build
```bash
npm run build
# Output will be in dist/ folder
```

## Development Workflow

### Making Changes to Backend
1. Edit files in `BackEnd/src/main/java`
2. Spring Boot will auto-reload on restart
3. Restart using `mvn spring-boot:run`

### Making Changes to Frontend
1. Edit files in `FrountEnd/src`
2. Vite will automatically hot-reload
3. Changes visible immediately in browser

## Testing the Flow

### Customer Flow
1. Register → Login → Browse Equipment
2. Filter by Category → Add to Cart
3. View Cart → Checkout → Place Order
4. View Orders → Order History

### Admin Flow
1. Admin Login
2. Add new equipment with image
3. Manage inventory
4. Review customer accounts
5. Manage reviews and feedback

## Support & Documentation

- Backend: Spring Boot Official Docs
- Frontend: React & Vite Official Docs
- Database: SQLite Official Docs
- API Testing: Use Postman or similar tools

## Default Test Account

You can create a test account using these credentials:
- Email: test@example.com
- Password: Test@123
- Phone: 9876543210

## Security Notes

- Passwords are hashed using BCrypt
- Admin credentials are stored securely
- File uploads are stored server-side
- CORS is configured for localhost development only
