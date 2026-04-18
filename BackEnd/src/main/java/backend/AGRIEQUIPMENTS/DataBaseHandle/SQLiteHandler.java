package backend.AGRIEQUIPMENTS.DataBaseHandle;

import backend.AGRIEQUIPMENTS.Util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;

@Service
public class SQLiteHandler {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PasswordUtil passwordUtil;

    @PostConstruct
    public void init() {
        try {
            jdbcTemplate.execute("PRAGMA journal_mode=WAL;");
            jdbcTemplate.execute("PRAGMA foreign_keys = ON;");
        } catch (Exception e) { }

        // ensure old wishlist table removed
        try {
            jdbcTemplate.execute("DROP TABLE IF EXISTS wishlist");
        } catch (Exception ignore) { }

        // Customer Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS customer (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "name TEXT, email TEXT, phone TEXT, password TEXT, " +
                "state TEXT, district TEXT, taluka TEXT, image TEXT, " +
                "active BOOLEAN DEFAULT 1, suspended BOOLEAN DEFAULT 0)");

        // Equipment Categories Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS equipment_category (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "category_name TEXT UNIQUE, description TEXT)");

        // Equipment Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS equipment (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "category_id INTEGER, " +
                "name TEXT, description TEXT, " +
                "price REAL, quantity_available INTEGER, " +
                "specifications TEXT, image TEXT, " +
                "discount_percent REAL DEFAULT 0, " +
                "is_rentable BOOLEAN DEFAULT 0, " +
                "rent_price REAL, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "active BOOLEAN DEFAULT 1, " +
                "FOREIGN KEY (category_id) REFERENCES equipment_category(id) ON DELETE CASCADE)");

        // Ensure columns exist for older DBs (add if missing)
        try {
            jdbcTemplate.queryForList("SELECT discount_percent FROM equipment LIMIT 1");
        } catch (Exception e) {
            try { jdbcTemplate.execute("ALTER TABLE equipment ADD COLUMN discount_percent REAL DEFAULT 0"); } catch (Exception ex) { }
        }
        try {
            jdbcTemplate.queryForList("SELECT is_rentable FROM equipment LIMIT 1");
        } catch (Exception e) {
            try { jdbcTemplate.execute("ALTER TABLE equipment ADD COLUMN is_rentable BOOLEAN DEFAULT 0"); } catch (Exception ex) { }
        }
        try {
            jdbcTemplate.queryForList("SELECT rent_price FROM equipment LIMIT 1");
        } catch (Exception e) {
            try { jdbcTemplate.execute("ALTER TABLE equipment ADD COLUMN rent_price REAL"); } catch (Exception ex) { }
        }


        // Cart Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS cart (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "customer_id INTEGER, equipment_id INTEGER, " +
                "quantity INTEGER, " +
                "added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE, " +
                "FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE)");

        // Order Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS orders (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "customer_id INTEGER, total_amount REAL, " +
                "payment_id INTEGER, " +
                "order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "status TEXT DEFAULT 'Pending', " +
                "shipping_address TEXT, " +
                "FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE, " +
                "FOREIGN KEY (payment_id) REFERENCES payments(id))");

        // Ensure payment_id column exists for older DBs
        try {
            jdbcTemplate.queryForList("SELECT payment_id FROM orders LIMIT 1");
        } catch (Exception e) {
            try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN payment_id INTEGER"); } catch (Exception ex) { }
        }

        // Order Items Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS order_items (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "order_id INTEGER, equipment_id INTEGER, " +
            "quantity INTEGER, price REAL, is_rental BOOLEAN DEFAULT 0, rent_days INTEGER, " +
            "FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, " +
            "FOREIGN KEY (equipment_id) REFERENCES equipment(id))");

        // Ensure columns exist for older DBs
        try { jdbcTemplate.queryForList("SELECT is_rental FROM order_items LIMIT 1"); } catch (Exception e) { try { jdbcTemplate.execute("ALTER TABLE order_items ADD COLUMN is_rental BOOLEAN DEFAULT 0"); } catch (Exception ex) { } }
        try { jdbcTemplate.queryForList("SELECT rent_days FROM order_items LIMIT 1"); } catch (Exception e) { try { jdbcTemplate.execute("ALTER TABLE order_items ADD COLUMN rent_days INTEGER"); } catch (Exception ex) { } }

        // Payments Table (now supports simple card details storage)
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS payments (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "customer_id INTEGER, amount REAL, method TEXT, status TEXT DEFAULT 'Pending', " +
            "card_number TEXT, card_holder TEXT, expiry TEXT, cvv TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE)");
        // Ensure new columns exist for older DBs
        try { jdbcTemplate.queryForList("SELECT card_number FROM payments LIMIT 1"); } catch (Exception e) { try { jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN card_number TEXT"); } catch (Exception ex) { } }
        try { jdbcTemplate.queryForList("SELECT card_holder FROM payments LIMIT 1"); } catch (Exception e) { try { jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN card_holder TEXT"); } catch (Exception ex) { } }
        try { jdbcTemplate.queryForList("SELECT expiry FROM payments LIMIT 1"); } catch (Exception e) { try { jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN expiry TEXT"); } catch (Exception ex) { } }
        try { jdbcTemplate.queryForList("SELECT cvv FROM payments LIMIT 1"); } catch (Exception e) { try { jdbcTemplate.execute("ALTER TABLE payments ADD COLUMN cvv TEXT"); } catch (Exception ex) { } }

        // Review Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS review (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "equipment_id INTEGER, customer_id INTEGER, " +
                "rating INTEGER, feedback TEXT, status TEXT DEFAULT 'Pending', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE, " +
                "FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE)");

        // Feedback Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS feedback (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "user TEXT, role TEXT, rating INTEGER, feedback TEXT, " +
                "status TEXT DEFAULT 'Pending', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");

        // Admin Table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS admin (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "username TEXT UNIQUE, password TEXT)");

        List<Map<String, Object>> admins = jdbcTemplate.queryForList("SELECT * FROM admin");
        if (admins.isEmpty()) {
            String hashedPassword = passwordUtil.encodePassword("AgriEquipments@2026");
            jdbcTemplate.update("INSERT INTO admin (username, password) VALUES (?, ?)",
                    "AgriAdmin", hashedPassword);
        }

        // Addresses table for storing multiple shipping entries per customer
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS address (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "customer_id INTEGER, " +
                "address TEXT, " +
                "FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE)");

        // Initialize default categories
        initializeCategories();
    }

    private void initializeCategories() {
        try {
            List<Map<String, Object>> categories = jdbcTemplate.queryForList("SELECT * FROM equipment_category");
            if (categories.isEmpty()) {
                String[][] defaultCategories = {
                    {"Machines", "Farming and harvesting machines"},
                    {"Farms", "Farm management and land equipment"},
                    {"Seeds", "High quality crop seeds"},
                    {"Trees", "Saplings and tree seedlings"},
                    {"Fertilizers", "Chemical and organic fertilizers"},
                    {"Micronutrients", "Trace elements for crop growth"},
                    {"Bio-Stimulants", "Biological growth stimulants"},
                    {"Soil Conditioners", "Soil improvement products"},
                    {"Organic Amendments", "Natural soil amendments and compost"}
                };

                for (String[] cat : defaultCategories) {
                    jdbcTemplate.update("INSERT INTO equipment_category (category_name, description) VALUES (?, ?)",
                            cat[0], cat[1]);
                }
            }
        } catch (Exception e) {
            System.err.println("Error initializing categories: " + e.getMessage());
        }
    }

    // --- HELPERS ---
    public List<Map<String, Object>> getAll(String table) {
        return jdbcTemplate.queryForList("SELECT * FROM " + table);
    }

    public Map<String, Object> getById(String table, Long id) {
        try {
            return jdbcTemplate.queryForMap("SELECT * FROM " + table + " WHERE id = ?", id);
        } catch (Exception e) { return null; }
    }

    public Map<String, Object> login(String table, String email, String password) {
        try {
            String col = table.equals("admin") ? "username" : "email";
            Map<String, Object> user = jdbcTemplate.queryForMap("SELECT * FROM " + table + " WHERE " + col + " = ?", email);
            if (user != null && passwordUtil.verifyPassword(password, (String) user.get("password"))) {
                return user;
            }
            return null;
        } catch (Exception e) { return null; }
    }

    // --- CUSTOMER OPERATIONS ---
    public Long addCustomer(String name, String email, String phone, String password, String state, String district, String taluka) {
        String hashedPassword = passwordUtil.encodePassword(password);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO customer (name, email, phone, password, state, district, taluka) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, phone);
            ps.setString(4, hashedPassword);
            ps.setString(5, state);
            ps.setString(6, district);
            ps.setString(7, taluka);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }

    public void updateCustomer(Long id, String name, String email, String phone, String state, String district, String taluka, String image) {
        jdbcTemplate.update("UPDATE customer SET name=?, email=?, phone=?, state=?, district=?, taluka=?, image=? WHERE id=?",
                name, email, phone, state, district, taluka, image, id);
    }

    public void updateCustomerImage(Long id, String imageUrl) {
        jdbcTemplate.update("UPDATE customer SET image=? WHERE id=?", imageUrl, id);
    }

    public void updateCustomerSuspension(Long id, boolean suspended) {
        jdbcTemplate.update("UPDATE customer SET suspended=? WHERE id=?", suspended, id);
    }

    // --- EQUIPMENT OPERATIONS ---
    public List<Map<String, Object>> getAllEquipment() {
        return jdbcTemplate.queryForList("SELECT e.*, c.category_name FROM equipment e LEFT JOIN equipment_category c ON e.category_id = c.id WHERE e.active = 1");
    }

    public List<Map<String, Object>> getEquipmentByCategory(Long categoryId) {
        return jdbcTemplate.queryForList("SELECT e.*, c.category_name FROM equipment e LEFT JOIN equipment_category c ON e.category_id = c.id WHERE e.category_id = ? AND e.active = 1", categoryId);
    }

    public Map<String, Object> getEquipmentDetail(Long equipmentId) {
        try {
            return jdbcTemplate.queryForMap("SELECT e.*, c.category_name FROM equipment e LEFT JOIN equipment_category c ON e.category_id = c.id WHERE e.id = ?", equipmentId);
        } catch (Exception e) { return null; }
    }

    public Long addEquipment(Long categoryId, String name, String description, Double price, Integer quantity, String specifications, String imageUrl, Double discountPercent, Boolean isRentable, Double rentPrice) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO equipment (category_id, name, description, price, quantity_available, specifications, image, discount_percent, is_rentable, rent_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, categoryId);
            ps.setString(2, name);
            ps.setString(3, description);
            ps.setDouble(4, price);
            ps.setInt(5, quantity);
            ps.setString(6, specifications);
            ps.setString(7, imageUrl);
            ps.setDouble(8, discountPercent == null ? 0.0 : discountPercent);
            ps.setBoolean(9, isRentable != null && isRentable);
            if (rentPrice != null) ps.setDouble(10, rentPrice); else ps.setObject(10, null);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }

    public void updateEquipment(Long id, String name, String description, Double price, Integer quantity, String specifications, String imageUrl, Double discountPercent, Boolean isRentable, Double rentPrice) {
        jdbcTemplate.update("UPDATE equipment SET name=?, description=?, price=?, quantity_available=?, specifications=?, image=?, discount_percent=?, is_rentable=?, rent_price=? WHERE id=?",
                name, description, price, quantity, specifications, imageUrl, discountPercent == null ? 0.0 : discountPercent, isRentable != null && isRentable, rentPrice, id);
    }

    public void deleteEquipment(Long id) {
        jdbcTemplate.update("UPDATE equipment SET active=0 WHERE id=?", id);
    }

    // --- CATEGORY OPERATIONS ---
    public List<Map<String, Object>> getAllCategories() {
        return jdbcTemplate.queryForList("SELECT * FROM equipment_category");
    }


    // --- CART OPERATIONS ---
    public void addToCart(Long customerId, Long equipmentId, Integer quantity) {
        try {
            Map<String, Object> existing = jdbcTemplate.queryForMap("SELECT * FROM cart WHERE customer_id=? AND equipment_id=?", customerId, equipmentId);
            Integer currentQty = (Integer) existing.get("quantity");
            jdbcTemplate.update("UPDATE cart SET quantity=? WHERE customer_id=? AND equipment_id=?", currentQty + quantity, customerId, equipmentId);
        } catch (Exception e) {
            jdbcTemplate.update("INSERT INTO cart (customer_id, equipment_id, quantity) VALUES (?, ?, ?)", customerId, equipmentId, quantity);
        }
    }

    public void updateCartQuantity(Long cartId, Integer quantity) {
        jdbcTemplate.update("UPDATE cart SET quantity=? WHERE id=?", quantity, cartId);
    }

    public void removeFromCart(Long cartId) {
        jdbcTemplate.update("DELETE FROM cart WHERE id=?", cartId);
    }

    public List<Map<String, Object>> getCartByCustomer(Long customerId) {
        return jdbcTemplate.queryForList("SELECT c.*, e.name, e.price, e.image, e.is_rentable, e.rent_price FROM cart c INNER JOIN equipment e ON c.equipment_id = e.id WHERE c.customer_id = ?", customerId);
    }

    // --- ORDER OPERATIONS ---
    public Long createOrder(Long customerId, Double totalAmount, String shippingAddress, Long paymentId) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO orders (customer_id, total_amount, payment_id, shipping_address) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, customerId);
            ps.setDouble(2, totalAmount);
            if (paymentId != null) ps.setLong(3, paymentId); else ps.setObject(3, null);
            ps.setString(4, shippingAddress);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }

    public void addOrderItem(Long orderId, Long equipmentId, Integer quantity, Double price, Boolean isRental, Integer rentDays) {
        try {
            jdbcTemplate.update("INSERT INTO order_items (order_id, equipment_id, quantity, price, is_rental, rent_days) VALUES (?, ?, ?, ?, ?, ?)",
                    orderId, equipmentId, quantity, price, isRental != null && isRental, rentDays);
        } catch (Exception e) {
            jdbcTemplate.update("INSERT INTO order_items (order_id, equipment_id, quantity, price) VALUES (?, ?, ?, ?)",
                    orderId, equipmentId, quantity, price);
        }
    }

    public List<Map<String, Object>> getOrdersByCustomer(Long customerId) {
        return jdbcTemplate.queryForList("SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC", customerId);
    }

    public Map<String, Object> getOrderDetail(Long orderId) {
        try {
            return jdbcTemplate.queryForMap("SELECT * FROM orders WHERE id = ?", orderId);
        } catch (Exception e) { return null; }
    }

    public List<Map<String, Object>> getOrderItems(Long orderId) {
        return jdbcTemplate.queryForList("SELECT oi.*, e.name, e.image, e.is_rentable, e.rent_price FROM order_items oi INNER JOIN equipment e ON oi.equipment_id = e.id WHERE oi.order_id = ?", orderId);
    }

    public void updateOrderStatus(Long orderId, String status) {
        jdbcTemplate.update("UPDATE orders SET status=? WHERE id=?", status, orderId);
    }

    public Map<String, Object> getSalesSummary() {
        Double daily = jdbcTemplate.queryForObject(
                "SELECT IFNULL(SUM(total_amount),0) FROM orders WHERE date(order_date) = date('now')", Double.class);
        Double monthly = jdbcTemplate.queryForObject(
                "SELECT IFNULL(SUM(total_amount),0) FROM orders WHERE strftime('%Y-%m', order_date) = strftime('%Y-%m','now')", Double.class);
        Double yearly = jdbcTemplate.queryForObject(
                "SELECT IFNULL(SUM(total_amount),0) FROM orders WHERE strftime('%Y', order_date) = strftime('%Y','now')", Double.class);

        Map<String, Object> summary = new HashMap<>();
        summary.put("daily", daily);
        summary.put("monthly", monthly);
        summary.put("yearly", yearly);
        summary.put("dailyProfit", daily * 0.12);
        summary.put("monthlyProfit", monthly * 0.12);
        summary.put("yearlyProfit", yearly * 0.12);
        return summary;
    }

    // --- PAYMENTS ---
    public Long createPayment(Long customerId, Double amount, String method,
                                  String cardNumber, String cardHolder, String expiry, String cvv) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO payments (customer_id, amount, method, status, card_number, card_holder, expiry, cvv) VALUES (?, ?, ?, 'Pending', ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, customerId);
            ps.setDouble(2, amount);
            ps.setString(3, method);
            ps.setString(4, cardNumber);
            ps.setString(5, cardHolder);
            ps.setString(6, expiry);
            ps.setString(7, cvv);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }

    public Map<String, Object> getPayment(Long paymentId) {
        try {
            return jdbcTemplate.queryForMap("SELECT * FROM payments WHERE id = ?", paymentId);
        } catch (Exception e) { return null; }
    }

    public void updatePaymentStatus(Long paymentId, String status) {
        jdbcTemplate.update("UPDATE payments SET status=? WHERE id=?", status, paymentId);
    }

    // --- REVIEW OPERATIONS ---
    public void addReview(Long equipmentId, Long customerId, Integer rating, String feedback) {
        jdbcTemplate.update("INSERT INTO review (equipment_id, customer_id, rating, feedback) VALUES (?, ?, ?, ?)",
                equipmentId, customerId, rating, feedback);
    }

    public List<Map<String, Object>> getReviewsByEquipment(Long equipmentId) {
        return jdbcTemplate.queryForList("SELECT r.*, c.name FROM review r INNER JOIN customer c ON r.customer_id = c.id WHERE r.equipment_id = ? AND r.status = 'Approved' ORDER BY r.created_at DESC", equipmentId);
    }

    public List<Map<String, Object>> getAllReviews() {
        return jdbcTemplate.queryForList("SELECT * FROM review ORDER BY created_at DESC");
    }

    public void updateReviewStatus(Long reviewId, String status) {
        jdbcTemplate.update("UPDATE review SET status=? WHERE id=?", status, reviewId);
    }

    public void deleteReview(Long reviewId) {
        jdbcTemplate.update("DELETE FROM review WHERE id=?", reviewId);
    }

    // --- FEEDBACK OPERATIONS ---
    public void addFeedback(String user, String role, Integer rating, String feedback) {
        jdbcTemplate.update("INSERT INTO feedback (user, role, rating, feedback) VALUES (?, ?, ?, ?)",
                user, role, rating, feedback);
    }

    public List<Map<String, Object>> getAllFeedbacks() {
        return jdbcTemplate.queryForList("SELECT * FROM feedback ORDER BY created_at DESC");
    }

    public void solveFeedback(Long feedbackId) {
        jdbcTemplate.update("UPDATE feedback SET status='Resolved' WHERE id=?", feedbackId);
    }

    // --- DELETE OPERATIONS ---
    public void delete(String table, Long id) {
        jdbcTemplate.update("DELETE FROM " + table + " WHERE id=?", id);
    }

    public void deleteAllOrdersByCustomer(Long customerId) {
        List<Map<String, Object>> orders = getOrdersByCustomer(customerId);
        for (Map<String, Object> order : orders) {
            Object idObj = order.get("id");
            Long orderId;
            if (idObj instanceof Integer) {
                orderId = ((Integer) idObj).longValue();
            } else {
                orderId = (Long) idObj;
            }
            jdbcTemplate.update("DELETE FROM order_items WHERE order_id=?", orderId);
            jdbcTemplate.update("DELETE FROM orders WHERE id=?", orderId);
        }
    }

    // --- ADDRESS OPERATIONS ---
    public Long addAddress(Long customerId, String address) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO address (customer_id, address) VALUES (?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, customerId);
            ps.setString(2, address);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }

    public List<Map<String, Object>> getAddressesByCustomer(Long customerId) {
        return jdbcTemplate.queryForList("SELECT * FROM address WHERE customer_id = ?", customerId);
    }

    public void updateAddress(Long id, String address) {
        jdbcTemplate.update("UPDATE address SET address=? WHERE id=?", address, id);
    }

    public void deleteAddress(Long id) {
        jdbcTemplate.update("DELETE FROM address WHERE id=?", id);
    }
}
