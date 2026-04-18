package backend.AGRIEQUIPMENTS.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Encodes a plain text password using BCrypt
     * @param rawPassword The plain text password
     * @return The hashed password
     */
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * Verifies that a plain text password matches the stored hashed password
     * @param rawPassword The plain text password to verify
     * @param encodedPassword The stored hashed password
     * @return True if the password matches, false otherwise
     */
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
