# 📚 AgriEquipments Platform - Complete Documentation Index

## 🎯 Start Here

### For First-Time Users
👉 **Start with**: [QUICK_START.md](./QUICK_START.md)
- 2-minute setup
- Login credentials
- Main features overview
- Quick troubleshooting

### For Detailed Setup
👉 **Read**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Prerequisites and requirements
- Step-by-step backend setup
- Step-by-step frontend setup
- Detailed API endpoints
- Comprehensive troubleshooting

### For Project Overview
👉 **Read**: [README.md](./README.md)
- Complete feature list
- Project structure
- Technology stack
- Database schema
- All API endpoints

### For Technical Details
👉 **Read**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- What has been built
- File structure
- Component breakdown
- Key features implemented
- Security implementation

---

## 📂 Project Structure Overview

```
AGRIEQUIPMENTS/
├── 📄 README.md                      ← Project documentation
├── 📄 SETUP_GUIDE.md                 ← Installation guide  
├── 📄 QUICK_START.md                 ← Quick reference
├── 📄 IMPLEMENTATION_SUMMARY.md       ← Technical details
├── 📄 This File (INDEX.md)            ← You are here
│
├── 🔧 BackEnd/                       ← Spring Boot Application
│   ├── Uploads/                      ← Uploaded images directory
│   │   ├── Equipment/                ← Equipment images
│   │   └── Customer/                 ← Customer profile images
│   │
│   ├── src/main/java/backend/AGRIEQUIPMENTS/
│   │   ├── AppConfig.java            ← Spring configuration
│   │   ├── AgriEquipmentsApplication.java
│   │   │
│   │   ├── DataBaseHandle/
│   │   │   └── SQLiteHandler.java    ← All database operations
│   │   │
│   │   ├── PostGet/
│   │   │   ├── ApiControll.java      ← Customer API endpoints
│   │   │   └── AdminApiControll.java ← Admin API endpoints
│   │   │
│   │   └── Util/
│   │       └── PasswordUtil.java     ← Password hashing
│   │
│   ├── pom.xml                       ← Maven dependencies
│   └── target/                       ← Compiled files
│
└── 🎨 FrountEnd/                      ← React Application
    ├── public/                        ← Static assets
    ├── src/
    │   ├── Admin/                     ← Admin panel components
    │   │   ├── AdminLogin.jsx         ← Admin login page
    │   │   ├── AdminDashboard.jsx     ← Admin main dashboard
    │   │   └── EquipmentForm.jsx      ← Add/Edit equipment
    │   │
    │   ├── pages/                     ← Customer pages
    │   │   ├── Login.jsx              ← Customer login
    │   │   ├── Register.jsx           ← Customer registration
    │   │   ├── Equipment.jsx          ← Product catalog
    │   │   ├── Cart.jsx               ← Shopping cart
    │   │   ├── Orders.jsx             ← Order history
    │   │   └── OrderDetail.jsx        ← Order details
    │   │
    │   ├── components/                ← Reusable components
    │   │   └── Navbar.jsx             ← Navigation bar
    │   │
    │   ├── css/                       ← Stylesheets
    │   │   ├── Navbar.css
    │   │   ├── Login.css
    │   │   ├── Register.css
    │   │   ├── Equipment.css
    │   │   ├── Cart.css
    │   │   ├── Orders.css
    │   │   ├── OrderDetail.css
    │   │   ├── AdminLogin.css
    │   │   ├── AdminDashboard.css
    │   │   └── EquipmentForm.css
    │   │
    │   ├── App.jsx                    ← Main routing
    │   ├── AuthContext.jsx            ← Customer auth state
    │   ├── AdminAuthContext.jsx       ← Admin auth state
    │   ├── App.css                    ← Global styles
    │   ├── main.jsx                   ← Entry point
    │   └── index.css                  ← Global CSS
    │
    ├── package.json                   ← NPM dependencies
    ├── vite.config.js                 ← Vite configuration
    ├── index.html                     ← HTML template
    └── node_modules/                  ← Dependencies (after npm install)
```

---

## 🚀 Quick Navigation

### I want to...

**🔧 Set up the project locally**
→ [QUICK_START.md](./QUICK_START.md) (2 min) or [SETUP_GUIDE.md](./SETUP_GUIDE.md) (detailed)

**📚 Understand the project structure**
→ [README.md](./README.md) - Full overview

**💻 Find technical details**
→ [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

**🔌 Know all API endpoints**
→ [README.md - API Endpoints Section](./README.md#api-endpoints)

**🗄️ Understand database schema**
→ [README.md - Database Schema](./README.md#database-schema)

**🎓 Learn about features**
→ [README.md - Features](./README.md#features)

**🐛 Fix an issue**
→ [SETUP_GUIDE.md - Troubleshooting](./SETUP_GUIDE.md#troubleshooting)

---

## 📋 Documentation by Purpose

### For Developers

| Goal | Document | Section |
|------|----------|---------|
| Set up environment | SETUP_GUIDE.md | Prerequisites |
| Backend structure | IMPLEMENTATION_SUMMARY.md | Backend (Spring Boot + SQLite) |
| Frontend structure | IMPLEMENTATION_SUMMARY.md | Frontend (React + Vite) |
| API development | README.md | API Endpoints |
| Database queries | IMPLEMENTATION_SUMMARY.md | Database Handler |
| File uploads | SETUP_GUIDE.md | File Upload System |

### For Administrators

| Goal | Document | Section |
|------|----------|---------|
| Run the application | QUICK_START.md | Quick Start |
| Login credentials | QUICK_START.md | Login Credentials |
| Start/stop services | SETUP_GUIDE.md | Backend/Frontend Setup |
| Manage data | README.md | Features → Admin Features |
| Deploy to production | SETUP_GUIDE.md | Building for Production |

### For Testers

| Goal | Document | Section |
|------|----------|---------|
| Test customer flow | QUICK_START.md | Customer Demo / Usage Example |
| Test admin flow | QUICK_START.md | Admin Flow / Usage Example |
| Test all features | README.md | Features |
| Report bugs | SETUP_GUIDE.md | Troubleshooting |

---

## 🎯 Main Features

### Customer Features
- User registration with location details
- Secure login/logout
- Browse equipment by 9 categories
- Shopping cart management
- Order placement and tracking
- Product reviews
- Feedback submission

### Admin Features
- Secure admin login
- Equipment management (CRUD)
- Image upload capability
- Customer account management
- Review moderation
- Feedback handling
- Order management

### Equipment Categories
1. Machines
2. Farms
3. Seeds
4. Trees
5. Fertilizers
6. Micronutrients
7. Bio-Stimulants
8. Soil Conditioners
9. Organic Amendments

---

## 🔐 Default Credentials

### Admin Account
```
Username: AgriAdmin
Password: AgriEquipments@2025
URL: http://localhost:5173/admin/login
```

### Customer Account
- Create via registration form
- Test URL: http://localhost:5173/register

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend Framework | Spring Boot | 3.4.0 |
| Language (Backend) | Java | 21 |
| Database | SQLite | Latest |
| Frontend Framework | React | 19.2.0 |
| Build Tool | Vite | 7.2.2 |
| HTTP Client | Axios | 1.13.2 |
| Routing | React Router | 7.9.6 |
| CSS | CSS3 | Native |

---

## 📊 Database Overview

### Tables (10 Total)
1. **customer** - User profiles
2. **equipment** - Product catalog
3. **equipment_category** - Categories (9 pre-loaded)
4. **cart** - Shopping cart
5. **orders** - Order records
6. **order_items** - Order line items
7. **wishlist** - Customer wishlists
8. **review** - Product reviews
9. **feedback** - General feedback
10. **admin** - Admin credentials

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:8080 | API server |
| Admin Login | http://localhost:5173/admin/login | Admin panel |
| Customer Login | http://localhost:5173/login | Customer area |

---

## 📖 File-by-File Documentation

### Backend Files

| File | Purpose | Key Methods |
|------|---------|------------|
| SQLiteHandler.java | Database layer | CRUD, cart, orders, reviews |
| ApiControll.java | Customer API | Login, register, equipment, cart, orders |
| AdminApiControll.java | Admin API | Equipment CRUD, customer mgmt, reviews |
| AppConfig.java | Spring config | File upload, password encoder |
| PasswordUtil.java | Security | Encrypt, verify passwords |

### Frontend Files

| File | Purpose | Key Components |
|------|---------|----------------|
| App.jsx | Main routing | All routes defined |
| AuthContext.jsx | State mgmt | Customer auth state |
| AdminAuthContext.jsx | State mgmt | Admin auth state |
| AdminDashboard.jsx | Admin UI | 4 management tabs |
| Equipment.jsx | Customer UI | Category filter, product grid |

---

## 🎓 Getting Started Checklist

- [ ] Read QUICK_START.md (5 min)
- [ ] Read SETUP_GUIDE.md prerequisites
- [ ] Install Java 21 and Node.js
- [ ] Navigate to BackEnd and run mvn clean install
- [ ] Start backend: mvn spring-boot:run
- [ ] Navigate to FrountEnd and run npm install
- [ ] Start frontend: npm run dev
- [ ] Open http://localhost:5173
- [ ] Test customer registration and login
- [ ] Test admin login (AgriAdmin / AgriEquipments@2025)
- [ ] Read README.md for full feature overview
- [ ] Explore IMPLEMENTATION_SUMMARY.md for technical details

---

## 💡 Common Tasks

### Add new equipment (As Admin)
1. Login with AgriAdmin credentials
2. Click "Equipment" tab
3. Click "Add New Equipment"
4. Fill form and upload image
5. Click "Add Equipment"

### Register as customer
1. Go to /register
2. Fill form with location details
3. Create account
4. Login with email and password

### Place an order (As Customer)
1. Login
2. Browse equipment
3. Add items to cart
4. Go to cart
5. Checkout with shipping address

### View all orders (As Admin)
1. Login with admin credentials
2. System shows order list
3. Click order to see details

---

## 🔄 Development Workflow

### Make Backend Changes
```bash
# Edit files in BackEnd/src/main/java
# Restart backend
mvn spring-boot:run
```

### Make Frontend Changes
```bash
# Edit files in FrountEnd/src
# Vite auto-reloads
# Just save and refresh browser
```

### Database Changes
```bash
# Edit SQLiteHandler.java
# Restart backend
# Old data preserved
```

---

## 🚀 Deployment Checklist

- [ ] Change admin password in code
- [ ] Update CORS origins for production
- [ ] Build backend: mvn clean package -DskipTests
- [ ] Build frontend: npm run build
- [ ] Configure production database
- [ ] Set up file upload directory permissions
- [ ] Deploy backend JAR
- [ ] Deploy frontend dist/ folder
- [ ] Test all APIs
- [ ] Monitor logs

---

## 📞 Questions? 

Refer to the relevant documentation:

| Question | Document |
|----------|----------|
| How do I start? | QUICK_START.md |
| How do I install? | SETUP_GUIDE.md |
| What can it do? | README.md |
| How is it built? | IMPLEMENTATION_SUMMARY.md |
| Where is feature X? | This file (INDEX.md) |

---

## 📝 Document Versions

- README.md - Version 1.0 (Project Overview)
- SETUP_GUIDE.md - Version 1.0 (Installation)
- QUICK_START.md - Version 1.0 (Quick Reference)
- IMPLEMENTATION_SUMMARY.md - Version 1.0 (Technical Details)
- INDEX.md (This file) - Version 1.0 (Navigation Guide)

---

## ✅ What's Included

✅ Complete Spring Boot backend
✅ SQLite database with 10 tables
✅ RESTful API endpoints
✅ React frontend with routing
✅ Admin panel
✅ Customer portal
✅ File upload system
✅ Authentication & authorization
✅ Shopping cart & orders
✅ Product reviews
✅ Complete documentation
✅ Setup guides
✅ Quick start guide
✅ Implementation details

---

## 🎉 Ready?

**Start here:** [QUICK_START.md](./QUICK_START.md)

Good luck! 🚀
