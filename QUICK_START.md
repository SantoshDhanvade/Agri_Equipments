# AgriEquipments Platform - Quick Reference

## 🚀 Quick Start (2 Minutes)

### Open 2 Terminal Windows

**Terminal 1 - Backend:**
```bash
cd c:\my code\SpringBoot\AGRIEQUIPMENTS\BackEnd
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd c:\my code\SpringBoot\AGRIEQUIPMENTS\FrountEnd
npm install
npm run dev
```

Wait for both to start, then open `http://localhost:5173`

---

## 📋 Login Credentials

### Admin Panel
```
URL: http://localhost:5173/admin/login
Username: AgriAdmin
Password: AgriEquipments@2026
```

### Customer Demo
```
Register here: http://localhost:5173/register
Example credentials to create:
  Name: John Farmer
  Email: john@example.com
  Phone: 9876543210
  State: Maharashtra
  District: Pune
  Taluka: Pune
  Password: Test@123
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.4.0 |
| Language | Java 21 |
| Database | SQLite |
| Frontend | React 19.2.0 |
| Build Tool | Vite 7.2.2 |
| HTTP Client | Axios |
| Styling | CSS3 |

---

## 📦 Project Structure Quick View

```
AGRIEQUIPMENTS/
├── BackEnd/                    (Spring Boot)
│   ├── Uploads/
│   │   ├── Equipment/          ← Images saved here
│   │   └── Customer/           ← Profile images here
│   └── src/main/java/...       ← Java source code
├── FrountEnd/                  (React)
│   └── src/
│       ├── Admin/              ← Admin components
│       ├── pages/              ← Customer pages
│       ├── components/         ← Reusable components
│       ├── css/                ← Stylesheets
│       └── App.jsx             ← Main app file
├── README.md                   ← Full documentation
├── SETUP_GUIDE.md             ← Detailed setup
└── IMPLEMENTATION_SUMMARY.md  ← What was built
```

---

## 🎯 Main Features

### Customer Can:
- ✅ Register with location details
- ✅ Login/Logout
- ✅ Browse 9 equipment categories
- ✅ Add items to cart
- ✅ Place orders
- ✅ Track orders
- ✅ Write reviews

### Admin Can:
- ✅ Login with secure credentials
- ✅ Add/Edit/Delete equipment
- ✅ Upload equipment images
- ✅ Manage customers
- ✅ Approve/Reject reviews
- ✅ Manage feedback
- ✅ Track orders

---

## 🗂️ Equipment Categories

1. **Machines** - Tractors, harvesters, etc.
2. **Farms** - Farm equipment
3. **Seeds** - Crop seeds
4. **Trees** - Saplings
5. **Fertilizers** - Chemical & organic
6. **Micronutrients** - Trace elements
7. **Bio-Stimulants** - Growth boosters
8. **Soil Conditioners** - Soil improvement
9. **Organic Amendments** - Natural amendments

---

## 🔗 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | Check browser |
| Backend | http://localhost:8080 | Check terminal |
| Admin Panel | http://localhost:5173/admin/login | After startup |
| API Docs | http://localhost:8080/swagger-ui.html | Optional |

---

## 📝 Database

- **Type**: SQLite
- **Location**: Auto-created in BackEnd folder
- **Tables**: 10 (customer, equipment, cart, orders, etc.)
- **Features**: Auto-increment IDs, timestamps, foreign keys

---

## 🔐 Security

- ✅ Passwords encrypted with BCrypt
- ✅ Admin credentials secure
- ✅ File uploads server-side
- ✅ CORS configured for development

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is free
netstat -ano | findstr :8080

# Or use different port in application.properties
server.port=8081
```

### Frontend dependencies error
```bash
npm cache clean --force
npm install
```

### CORS error
- Ensure backend is running
- Check backend is on port 8080
- Verify in ApiControll.java: @CrossOrigin origins

### Database corruption
- Delete `db.sqlite` file in BackEnd
- Restart backend (will recreate)

---

## 📊 API Quick Reference

### Customer Endpoints
```
GET    /equipment              - Get all products
GET    /equipment/:id          - Get product details
POST   /cart                   - Add to cart
GET    /cart/:id              - View cart
POST   /order                  - Place order
GET    /orders/:id            - View orders
```

### Admin Endpoints
```
POST   /admin/login            - Admin login
POST   /admin/equipment        - Add equipment
PUT    /admin/equipment/:id    - Update equipment
DELETE /admin/equipment/:id    - Delete equipment
GET    /admin/customers        - View customers
GET    /admin/reviews          - View reviews
```

---

## 💡 Usage Example

### Customer Flow:
1. Go to http://localhost:5173
2. Click "Register" → Fill form → Register
3. Login with credentials
4. Browse equipment by category
5. Click "Add to Cart"
6. Go to Cart → "Proceed to Checkout"
7. Enter address → Place order
8. View in "My Orders"

### Admin Flow:
1. Go to http://localhost:5173/admin/login
2. Enter: AgriAdmin / AgriEquipments@2025
3. Click "Equipment" tab
4. Click "Add New Equipment"
5. Fill form → Upload image → Save
6. View dashboard with 4 tabs

---

## 🚀 Deployment Tips

### Build Backend JAR
```bash
cd BackEnd
mvn clean package -DskipTests
java -jar target/AGRIEQUIPMENTS-0.0.1-SNAPSHOT.jar
```

### Build Frontend
```bash
cd FrountEnd
npm run build
# Deploy dist/ folder to web server
```

---

## 📞 Support Files

| File | Purpose |
|------|---------|
| README.md | Full feature documentation |
| SETUP_GUIDE.md | Detailed installation guide |
| IMPLEMENTATION_SUMMARY.md | Technical overview |
| This file | Quick reference |

---

## ✨ What's Included

- ✅ Complete backend with 10 database tables
- ✅ RESTful API for customers and admins
- ✅ File upload system for images
- ✅ React frontend with routing
- ✅ Authentication & authorization
- ✅ Shopping cart & order system
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Documentation & guides
- ✅ Ready to run locally

---

## 🎓 Learning Points

This project demonstrates:
- Spring Boot REST API development
- SQLite database design
- React component architecture
- File upload handling
- Authentication & authorization
- CORS configuration
- E-commerce workflow
- Admin panel design

---

## Next Steps After Setup

1. **Add Sample Data**
   - Use admin panel to add equipment
   - Upload product images

2. **Test Features**
   - Create customer account
   - Add items to cart
   - Place test orders

3. **Customize**
   - Change company name
   - Adjust color scheme
   - Add company logo
   - Modify categories

4. **Deploy**
   - Set up production database
   - Configure API endpoints
   - Deploy to server

---

**Ready to run?** Start with the Quick Start section at the top! 🚀
