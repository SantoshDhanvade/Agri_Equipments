package backend.AGRIEQUIPMENTS.PostGet;

import backend.AGRIEQUIPMENTS.DataBaseHandle.SQLiteHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:5175" })
public class ApiControll {

    @Autowired
    private SQLiteHandler db;

    private String saveFile(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) return null;
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("Uploads/" + folder);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "http://localhost:8080/uploads/" + folder + "/" + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void deleteFileFromUrl(String url) {
        if (url == null || !url.contains("/uploads/")) return;
        try {
            String subPath = url.substring(url.lastIndexOf("uploads/") + 8);
            Path path = Paths.get("Uploads/" + subPath);
            Files.deleteIfExists(path);
        } catch (Exception e) { }
    }

    // ================= AUTH =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        try {
            String role = creds.get("role");
            String email = creds.get("username");
            String password = creds.get("password");

            Map<String, Object> user;
            user = db.login("customer", email, password);

            if (user != null) {
                Object suspendedObj = user.get("suspended");
                boolean isSuspended = false;
                if (suspendedObj != null) {
                    if (suspendedObj instanceof Integer) isSuspended = ((Integer) suspendedObj) == 1;
                    if (suspendedObj instanceof Boolean) isSuspended = (Boolean) suspendedObj;
                }
                if (isSuspended) return ResponseEntity.status(403).body("{\"error\": \"Account Suspended by Admin.\"}");
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.status(401).body("{\"error\": \"Invalid Credentials\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Login Error: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        try {
            String name = userData.get("name");
            String email = userData.get("email");
            String phone = userData.get("phone");
            String password = userData.get("password");
            String state = userData.get("state");
            String district = userData.get("district");
            String taluka = userData.get("taluka");

            Long customerId = db.addCustomer(name, email, phone, password, state, district, taluka);
            Map<String, Object> newCustomer = db.getById("customer", customerId);
            return ResponseEntity.ok(newCustomer);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Registration Error: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok("{\"message\": \"Password reset link sent (Mock).\"}");
    }

    // ================= CUSTOMER PROFILE =================
    @GetMapping("/customer/{id}")
    public ResponseEntity<?> getCustomerProfile(@PathVariable Long id) {
        Map<String, Object> customer = db.getById("customer", id);
        return customer != null ? ResponseEntity.ok(customer) : ResponseEntity.notFound().build();
    }

    @PutMapping("/customer/{id}")
    public ResponseEntity<?> updateCustomerProfile(@PathVariable Long id, @RequestParam String name, @RequestParam String email, @RequestParam String phone, @RequestParam String state, @RequestParam String district, @RequestParam String taluka, @RequestPart(required = false) MultipartFile image) {
        try {
            Map<String, Object> customer = db.getById("customer", id);
            if (customer == null) return ResponseEntity.notFound().build();

            String imageUrl = (String) customer.get("image");
            if (image != null && !image.isEmpty()) {
                deleteFileFromUrl(imageUrl);
                imageUrl = saveFile(image, "Customer");
            }

            db.updateCustomer(id, name, email, phone, state, district, taluka, imageUrl);
            return ResponseEntity.ok(db.getById("customer", id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ================= EQUIPMENT =================
    @GetMapping("/equipment")
    public ResponseEntity<List<Map<String, Object>>> getAllEquipment() {
        return ResponseEntity.ok(db.getAllEquipment());
    }

    @GetMapping("/equipment/category/{categoryId}")
    public ResponseEntity<List<Map<String, Object>>> getEquipmentByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(db.getEquipmentByCategory(categoryId));
    }

    @GetMapping("/equipment/{id}")
    public ResponseEntity<?> getEquipmentDetail(@PathVariable Long id) {
        Map<String, Object> equipment = db.getEquipmentDetail(id);
        return equipment != null ? ResponseEntity.ok(equipment) : ResponseEntity.notFound().build();
    }

    // ================= CATEGORIES =================
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        return ResponseEntity.ok(db.getAllCategories());
    }


    // ================= CART =================
    @PostMapping("/cart")
    public ResponseEntity<Map<String, String>> addToCart(@RequestBody Map<String, Object> payload) {
        Long customerId = ((Number) payload.get("customerId")).longValue();
        Long equipmentId = ((Number) payload.get("equipmentId")).longValue();
        Integer quantity = ((Number) payload.get("quantity")).intValue();
        db.addToCart(customerId, equipmentId, quantity);
        return ResponseEntity.ok(Map.of("message", "Added to cart"));
    }

    @PutMapping("/cart/{cartId}")
    public ResponseEntity<Map<String, String>> updateCartQuantity(@PathVariable Long cartId, @RequestBody Map<String, Object> payload) {
        Integer quantity = ((Number) payload.get("quantity")).intValue();
        db.updateCartQuantity(cartId, quantity);
        return ResponseEntity.ok(Map.of("message", "Cart updated"));
    }

    @DeleteMapping("/cart/{cartId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long cartId) {
        db.removeFromCart(cartId);
        return ResponseEntity.ok(Map.of("message", "Removed from cart"));
    }

    @GetMapping("/cart/{customerId}")
    public ResponseEntity<List<Map<String, Object>>> getCart(@PathVariable Long customerId) {
        return ResponseEntity.ok(db.getCartByCustomer(customerId));
    }

    // ================= ADDRESSES =================
    @GetMapping("/addresses/{customerId}")
    public ResponseEntity<List<Map<String, Object>>> getAddresses(@PathVariable Long customerId) {
        return ResponseEntity.ok(db.getAddressesByCustomer(customerId));
    }

    @PostMapping("/address")
    public ResponseEntity<?> addAddress(@RequestBody Map<String, Object> payload) {
        try {
            Long customerId = ((Number) payload.get("customerId")).longValue();
            String address = (String) payload.get("address");
            Long id = db.addAddress(customerId, address);
            return ResponseEntity.ok(Map.of("addressId", id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/address/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String address = (String) payload.get("address");
            db.updateAddress(id, address);
            return ResponseEntity.ok(Map.of("message", "Address updated"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/address/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        try {
            db.deleteAddress(id);
            return ResponseEntity.ok(Map.of("message", "Address deleted"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ================= ORDERS =================
    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("createOrder called with payload: " + payload);
            Long customerId = ((Number) payload.get("customerId")).longValue();
            Double totalAmount = ((Number) payload.get("totalAmount")).doubleValue();
            String shippingAddress = (String) payload.get("shippingAddress");
            Long paymentId = null;
            try { if (payload.get("paymentId") != null) paymentId = ((Number) payload.get("paymentId")).longValue(); } catch (Exception ex) { paymentId = null; }
            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");

            System.out.println("Creating order for customer " + customerId + ", amount " + totalAmount + ", address " + shippingAddress + ", paymentId " + paymentId);
            Long orderId = db.createOrder(customerId, totalAmount, shippingAddress, paymentId);
            System.out.println("Order created with ID: " + orderId);

            for (Map<String, Object> item : items) {
                Long equipmentId = ((Number) item.get("equipment_id")).longValue();
                Integer quantity = ((Number) item.get("quantity")).intValue();
                Double price = ((Number) item.get("price")).doubleValue();
                Boolean isRental = null;
                Integer rentDays = null;
                try { if (item.get("isRental") != null) isRental = (Boolean) item.get("isRental"); } catch (Exception ex) { try { isRental = ((Number) item.get("isRental")).intValue() == 1; } catch (Exception ignore) { } }
                try { if (item.get("rentDays") != null) rentDays = ((Number) item.get("rentDays")).intValue(); } catch (Exception ignore) { }
                System.out.println("Adding order item: equipment " + equipmentId + ", qty " + quantity + ", price " + price + ", isRental " + isRental + ", rentDays " + rentDays);
                db.addOrderItem(orderId, equipmentId, quantity, price, isRental, rentDays);
            }

            // Clear cart
            List<Map<String, Object>> cart = db.getCartByCustomer(customerId);
            for (Map<String, Object> cartItem : cart) {
                Long cartId = ((Number) cartItem.get("id")).longValue();
                db.removeFromCart(cartId);
            }

            return ResponseEntity.ok(Map.of("orderId", orderId, "message", "Order created successfully"));
        } catch (Exception e) {
            System.err.println("Error in createOrder: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }


    // ================= SAFE CONFIRM PAYMENT =================
    @PostMapping("/payment/{id}/confirm")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {
        try {
            Map<String, Object> p = db.getPayment(id);
            if (p == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Payment ID not found in database"));
            }
            db.updatePaymentStatus(id, "Paid");
            return ResponseEntity.ok(Map.of("message", "Payment confirmed", "paymentId", id));
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR IN confirmPayment: ");
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Database crash in confirmPayment: " + e.getMessage()));
        }
    }
    @GetMapping("/payment/{id}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long id) {
        Map<String, Object> p = db.getPayment(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    // ================= PAYMENT CREATION =================
    @PostMapping("/payment/create")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> payload) {
        try {
            Long customerId = ((Number) payload.get("customerId")).longValue();
            Double amount = ((Number) payload.get("amount")).doubleValue();
            String method = (String) payload.get("method");
            String cardNumber = payload.get("cardNumber") != null ? payload.get("cardNumber").toString() : null;
            String cardHolder = payload.get("cardHolder") != null ? payload.get("cardHolder").toString() : null;
            String expiry = payload.get("expiry") != null ? payload.get("expiry").toString() : null;
            String cvv = payload.get("cvv") != null ? payload.get("cvv").toString() : null;
            
            // Create payment in database (card info may be null)
            Long paymentId = db.createPayment(customerId, amount, method, cardNumber, cardHolder, expiry, cvv);
            
            return ResponseEntity.ok(Map.of("paymentId", paymentId, "message", "Payment created"));
        } catch (Exception e) {
            System.err.println("Error creating payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/orders/{customerId}")
    public ResponseEntity<List<Map<String, Object>>> getCustomerOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(db.getOrdersByCustomer(customerId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long orderId) {
        Map<String, Object> order = db.getOrderDetail(orderId);
        if (order != null) {
            Map<String, Object> response = new HashMap<>(order);
            response.put("items", db.getOrderItems(orderId));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // ================= REVIEWS =================
    @PostMapping("/review")
    public ResponseEntity<Map<String, String>> addReview(@RequestBody Map<String, Object> payload) {
        try {
            Long equipmentId = ((Number) payload.get("equipmentId")).longValue();
            Long customerId = ((Number) payload.get("customerId")).longValue();
            Integer rating = ((Number) payload.get("rating")).intValue();
            String feedback = (String) payload.get("feedback");

            db.addReview(equipmentId, customerId, rating, feedback);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Review submitted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/reviews/{equipmentId}")
    public ResponseEntity<List<Map<String, Object>>> getEquipmentReviews(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(db.getReviewsByEquipment(equipmentId));
    }

    // ================= FEEDBACK =================
    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> submitFeedback(@RequestBody Map<String, Object> payload) {
        try {
            String user = (String) payload.get("user");
            String role = (String) payload.get("role");
            Integer rating = ((Number) payload.get("rating")).intValue();
            String feedback = (String) payload.get("feedback");

            db.addFeedback(user, role, rating, feedback);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Feedback submitted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
