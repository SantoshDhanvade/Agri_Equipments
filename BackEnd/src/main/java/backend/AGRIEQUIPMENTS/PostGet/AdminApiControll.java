package backend.AGRIEQUIPMENTS.PostGet;

import backend.AGRIEQUIPMENTS.DataBaseHandle.SQLiteHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:5175" })
public class AdminApiControll {

    @Autowired
    private SQLiteHandler db;

    private boolean isTrue(Object value) {
        if (value == null) return false;
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof Integer) return ((Integer) value) == 1;
        return false;
    }

    private Long getLongId(Object idObj) {
        if (idObj instanceof Integer) return ((Integer) idObj).longValue();
        if (idObj instanceof Long) return (Long) idObj;
        return null;
    }

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
            System.out.println("Admin deleted file: " + path.toString());
        } catch (Exception e) {
            System.err.println("Failed to delete file: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> creds) {
        Map<String, Object> admin = db.login("admin", creds.get("userId"), creds.get("password"));
        return admin != null ? ResponseEntity.ok(admin) : ResponseEntity.status(401).body(Map.of("error", "Invalid Credentials"));
    }

    // ================= CUSTOMER MANAGEMENT =================
    @GetMapping("/customers")
    public List<Map<String, Object>> getAllCustomers() { 
        return db.getAll("customer"); 
    }

    @PostMapping("/customers/{id}/suspend")
    public ResponseEntity<Map<String, Object>> suspendCustomer(@PathVariable Long id) {
        Map<String, Object> customer = db.getById("customer", id);
        if (customer == null) return ResponseEntity.notFound().build();

        boolean currentStatus = isTrue(customer.get("suspended"));
        boolean newStatus = !currentStatus;

        db.updateCustomerSuspension(id, newStatus);
        return ResponseEntity.ok(Map.of("message", newStatus ? "Suspended" : "Active", "suspended", newStatus));
    }

    @PostMapping("/customers/{id}/delete")
    public ResponseEntity<Map<String, String>> deleteCustomer(@PathVariable Long id) {
        Map<String, Object> customer = db.getById("customer", id);
        if (customer != null) {
            // Delete Customer Profile Image
            deleteFileFromUrl((String) customer.get("image"));

            // Delete all customer orders
            db.deleteAllOrdersByCustomer(id);

            // Delete customer reviews
            List<Map<String, Object>> reviews = db.getAllReviews();
            for (Map<String, Object> r : reviews) {
                Long customerId = getLongId(r.get("customer_id"));
                if (customerId != null && customerId.equals(id)) {
                    Long reviewId = getLongId(r.get("id"));
                    if (reviewId != null) db.deleteReview(reviewId);
                }
            }

            db.delete("customer", id);
        }
        return ResponseEntity.ok(Map.of("message", "Customer and associated data Deleted"));
    }

    // ================= EQUIPMENT MANAGEMENT =================
    @GetMapping("/equipment")
    public List<Map<String, Object>> getAllEquipment() { 
        // return equipment with category name for admin
        try {
            return db.getAllEquipment();
        } catch (Exception e) {
            // fall back to raw data
            return db.getAll("equipment");
        }
    }

    @PostMapping("/equipment")
    public ResponseEntity<?> addEquipment(
            @RequestParam Long categoryId,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String specifications,
            @RequestParam(required = false) Double discountPercent,
            @RequestParam(required = false) Boolean isRentable,
            @RequestParam(required = false) Double rentPrice,
            @RequestPart(required = false) MultipartFile image) {
        try {
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = saveFile(image, "Equipment");
            }

            Long equipmentId = db.addEquipment(categoryId, name, description, price, quantity, specifications, imageUrl, discountPercent, isRentable, rentPrice);
            return ResponseEntity.ok(Map.of("id", equipmentId, "message", "Equipment added successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/equipment/{id}")
    public ResponseEntity<?> updateEquipment(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String specifications,
            @RequestParam(required = false) Double discountPercent,
            @RequestParam(required = false) Boolean isRentable,
            @RequestParam(required = false) Double rentPrice,
            @RequestPart(required = false) MultipartFile image) {
        try {
            Map<String, Object> equipment = db.getById("equipment", id);
            if (equipment == null) return ResponseEntity.notFound().build();

            String imageUrl = (String) equipment.get("image");
            if (image != null && !image.isEmpty()) {
                deleteFileFromUrl(imageUrl);
                imageUrl = saveFile(image, "Equipment");
            }

            db.updateEquipment(id, name, description, price, quantity, specifications, imageUrl, discountPercent, isRentable, rentPrice);
            return ResponseEntity.ok(Map.of("message", "Equipment updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/equipment/{id}")
    public ResponseEntity<Map<String, String>> deleteEquipment(@PathVariable Long id) {
        Map<String, Object> equipment = db.getById("equipment", id);
        if (equipment != null) {
            deleteFileFromUrl((String) equipment.get("image"));
            db.deleteEquipment(id);
        }
        return ResponseEntity.ok(Map.of("message", "Equipment deleted"));
    }

    // ================= CATEGORY MANAGEMENT =================
    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return db.getAllCategories();
    }

    // ================= REVIEW MANAGEMENT =================
    @GetMapping("/reviews")
    public List<Map<String, Object>> getAllReviews() { 
        return db.getAllReviews(); 
    }

    @PostMapping("/reviews/{id}/approve")
    public ResponseEntity<Map<String, String>> approveReview(@PathVariable Long id) {
        db.updateReviewStatus(id, "Approved");
        return ResponseEntity.ok(Map.of("message", "Review Approved"));
    }

    @PostMapping("/reviews/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectReview(@PathVariable Long id) {
        db.updateReviewStatus(id, "Rejected");
        return ResponseEntity.ok(Map.of("message", "Review Rejected"));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long id) {
        db.deleteReview(id);
        return ResponseEntity.ok(Map.of("message", "Review Deleted"));
    }

    // ================= FEEDBACK MANAGEMENT =================
    @GetMapping("/feedbacks")
    public List<Map<String, Object>> getAllFeedbacks() { 
        return db.getAllFeedbacks(); 
    }

    @PostMapping("/feedbacks/{id}/solve")
    public ResponseEntity<Map<String, String>> solveFeedback(@PathVariable Long id) {
        db.solveFeedback(id);
        return ResponseEntity.ok(Map.of("message", "Feedback Resolved"));
    }

    @DeleteMapping("/feedbacks/{id}")
    public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Long id) {
        db.delete("feedback", id);
        return ResponseEntity.ok(Map.of("message", "Feedback Deleted"));
    }

    // ================= ORDERS MANAGEMENT =================
    @GetMapping("/orders")
    public List<Map<String, Object>> getAllOrders() {
        return db.getAll("orders");
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Map<String, String>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        db.updateOrderStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Order status updated"));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long id) {
        Map<String, Object> order = db.getOrderDetail(id);
        if (order != null) {
            Map<String, Object> response = new HashMap<>(order);
            response.put("items", db.getOrderItems(id));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // ================= SALES SUMMARY =================
    @GetMapping("/sales-summary")
    public ResponseEntity<Map<String, Object>> getSalesSummary() {
        try {
            Map<String, Object> summary = db.getSalesSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ================= ADMIN: Customer Cart Management =================
    @GetMapping("/customers/{customerId}/cart")
    public ResponseEntity<?> getCustomerCart(@PathVariable Long customerId) {
        try {
            List<Map<String, Object>> cart = db.getCartByCustomer(customerId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/customers/{customerId}/cart/{cartId}")
    public ResponseEntity<?> adminUpdateCartItem(@PathVariable Long customerId, @PathVariable Long cartId, @RequestBody Map<String, Object> payload) {
        try {
            Integer quantity = ((Number) payload.get("quantity")).intValue();
            db.updateCartQuantity(cartId, quantity);
            return ResponseEntity.ok(Map.of("message", "Cart item updated"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/customers/{customerId}/cart/{cartId}")
    public ResponseEntity<?> adminDeleteCartItem(@PathVariable Long customerId, @PathVariable Long cartId) {
        try {
            db.removeFromCart(cartId);
            return ResponseEntity.ok(Map.of("message", "Cart item deleted"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
