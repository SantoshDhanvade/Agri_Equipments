# AgriEquipments - Usage Guide

## Running the Application

### Backend
```bash
cd BackEnd
mvn -DskipTests spring-boot:run
```
Runs on: **http://localhost:8080**

### Frontend
```bash
cd FrountEnd
npm run dev
```
Runs on: **http://localhost:5173**

---

## Admin Login

**URL**: http://localhost:5173/admin/login

**Credentials:**
- Username: `AgriAdmin`
- Password: `AgriEquipments@2026`

### Admin Features
- **Equipment Management**: Add, edit, delete equipment with discount and rental options
- **Customer Management**: View all customers, suspend/unsuspend accounts, manage their cart items
- **Customer Detail**: Click "View" to see a customer's cart and edit/delete items
- **Order Management**: View all customer orders and update order status
- **Review Management**: Approve or reject customer reviews
- **Feedback Management**: View and resolve feedback

---

## Customer Features

### 1. Register & Login
- Create account or login at http://localhost:5173/login
- Fill in state, district, taluka for shipping

### 2. Browse Equipment
- Browse all equipment and categories
- Filter by category
- View detailed product information

### 3. Cart & Checkout
- Add items to cart (quantities can be adjusted)
- **Product images** now display in cart table (50x50px thumbnails)
- Proceed to checkout with shipping address
- Auto-generated mock payment (or Razorpay if keys are set in env vars)

### 4. Orders
- View all orders at http://localhost:5173/orders
- **View Details**: Click "View Details" to see order items and payment information
    - Formatted items table (Item / Qty / Price / Subtotal)
    - Total amount
    - Payment info (if available)
    - Company logo (if placed at `Uploads/Company/logo.png`)

---

## Discount & Rental Features

### Admin: Add/Edit Equipment with Discount & Rental
1. Go to **Equipment Management**
2. Click **Add New Equipment** or **Edit** an existing item
3. Fill in:
   - **Discount (%)**: Apply percentage discount on main price
   - **Rentable**: Checkbox to mark equipment as rentable
   - **Rent Price (per day)**: Daily rental rate (only shows if Rentable is checked)

### Customer: Purchase or Rent
- Cart and orders track whether item is purchased or rented
- Rental info (duration in days) is stored in order items

---

## Payment & Receipt

### Mock Payment (Default)
- Default flow auto-creates and confirms a mock payment
- Payment info included in receipts

### Razorpay Integration (Optional)
Set environment variables to enable real Razorpay payments:
```bash
set RAZORPAY_KEY=<your_key>
set RAZORPAY_SECRET=<your_secret>
```
Then restart backend. Payment endpoints will detect and use Razorpay.


---

## Database

SQLite database is automatically created at startup with:
- `customer` (users, login, profile)
- `equipment` (products, discount_percent, is_rentable, rent_price)
- `cart` (temporary shopping cart)
- `orders` (order history, linked to payments)
- `order_items` (items per order, includes is_rental, rent_days)
- `payments` (payment records)
- `wishlist`, `review`, `feedback`, `equipment_category` (supporting tables)

---

## Fixes Applied

### ✅ Cart Images
- Product images now display as 50x50px thumbnails
- Shows "No image" fallback if image URL is missing

### ✅ Order Details Navigation
- "View Details" button in Orders list now navigates to order detail page
- Shows payment information if payment was linked to order
- "Download Receipt (PDF)" button available on detail page

### ✅ Admin Cart Management
- Click "View" on any customer to manage their cart
- Admin can edit quantity or delete items from customer's cart

---

## API Endpoints (Key)

### Orders & Receipts
- `GET /receipt/{orderId}` - Get receipt JSON
- `POST /order` - Create order
- `GET /orders/{customerId}` - Get customer orders
- `GET /order/{orderId}` - Get order details

### Payments
- `POST /payment/create` - Create payment (mock or Razorpay)
- `GET /payment/{id}` - Get payment status
- `POST /payment/{id}/confirm` - Confirm payment

### Equipment (with Discount/Rental)
- `GET /equipment` - All equipment (includes discount_percent, is_rentable, rent_price)
- `POST /admin/equipment` - Add equipment (with discount/rental)
- `PUT /admin/equipment/{id}` - Update equipment

### Admin Cart Management
- `GET /admin/customers/{customerId}/cart` - View customer cart
- `PUT /admin/customers/{customerId}/cart/{cartId}` - Edit quantity
- `DELETE /admin/customers/{customerId}/cart/{cartId}` - Delete item

---

## Troubleshooting

**Q: Images not showing in cart?**
- A: Backend must be serving image files. Check `Uploads/Equipment/` folder for uploaded images.

**Q: Order detail page not opening?**
- A: Make sure you're logged in. CustomerID must match the order owner.

**Q: PDF download fails?**
- A: Ensure backend is running and `/receipt/{orderId}` endpoint is accessible.

**Q: Admin can't manage customer cart?**
- A: Use admin credentials (AgriAdmin / AgriEquipments@2026) and navigate to Admin Dashboard → Customers → View.

---

## Notes

- All prices are in Indian Rupees (₹)
- Sensitive payment data is not stored; only payment method and Razorpay order ID (if applicable)
- Watermark and logo are customizable in the PDF endpoint
- Multi-page support for receipts with long item lists

---

**Built with:**
- Spring Boot 3.4.0
- React 18 + Vite
- SQLite
- Apache PDFBox (PDF generation)
- Razorpay (optional payment gateway)

