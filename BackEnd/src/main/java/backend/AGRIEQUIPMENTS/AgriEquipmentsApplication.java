package backend.AGRIEQUIPMENTS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@SpringBootApplication
@ComponentScan(basePackages = {"backend.AGRIEQUIPMENTS.PostGet", "backend.AGRIEQUIPMENTS.DataBaseHandle", "backend.AGRIEQUIPMENTS.Util", "backend.AGRIEQUIPMENTS"})
public class AgriEquipmentsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgriEquipmentsApplication.class, args);
        createUploadDirs();
    }

    private static void createUploadDirs() {
        new File("Uploads/Equipment").mkdirs();
        new File("Uploads/Customer").mkdirs();
    }

    @Bean
    public WebMvcConfigurer configurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://localhost:5174",
                                "http://localhost:5175",
                                "http://localhost:5176"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:Uploads/");
            }
        };
    }
}
