package com.example.photoStudio.config;

import com.example.photoStudio.entity.Admin;
import com.example.photoStudio.entity.Contact;
import com.example.photoStudio.entity.GalleryItem;
import com.example.photoStudio.entity.ImageType;
import com.example.photoStudio.entity.ServiceItem;
import com.example.photoStudio.repository.AdminRepository;
import com.example.photoStudio.repository.ContactRepository;
import com.example.photoStudio.repository.GalleryRepository;
import com.example.photoStudio.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final ContactRepository contactRepository;
    private final ServiceRepository serviceRepository;
    private final GalleryRepository galleryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        // Clean up legacy services table columns for schema migration
        try {
            jdbcTemplate.execute("ALTER TABLE services DROP COLUMN IF EXISTS image_url");
            log.info("Altered services table: dropped legacy image_url column.");
        } catch (Exception e) {
            log.warn("Could not drop legacy image_url column: {}", e.getMessage());
        }

        // Seed default admin if none exists
        if (!adminRepository.existsByUsername("admin")) {
            Admin admin = Admin.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build();
            adminRepository.save(admin);
            log.info("Default admin user created: admin / admin123");
        }

        // Seed default contact if table is empty
        if (contactRepository.count() == 0) {
            Contact contact = Contact.builder()
                    .phone("9500328838")
                    .whatsapp("9500379678")
                    .email("kuttydigital.tmg@gmail.com")
                    .instagram("https://www.instagram.com/kutty_photography_official")
                    .youtube("")
                    .address("12, Olive Grove Avenue, Near Art District, Chennai, Tamil Nadu - 600018")
                    .build();
            contactRepository.save(contact);
            log.info("Default contact info seeded.");
        }

        // Seed default services if table is empty or contains null imagePath entries
        boolean needsServiceSeed = serviceRepository.count() == 0;
        if (!needsServiceSeed) {
            needsServiceSeed = serviceRepository.findAll().stream()
                    .anyMatch(item -> item.getImagePath() == null || item.getImagePath().trim().isEmpty());
            if (needsServiceSeed) {
                log.info("Legacy/null schema entries detected in services table. Clearing table to re-seed.");
                serviceRepository.deleteAll();
            }
        }

        if (needsServiceSeed) {
            serviceRepository.save(ServiceItem.builder()
                    .title("Wedding Photography")
                    .description("Documenting your sacred promises and grand celebrations with an elegant, fine-art editorial perspective.")
                    .imageType(ImageType.URL)
                    .imageName(null)
                    .imagePath("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop")
                    .build());
            serviceRepository.save(ServiceItem.builder()
                    .title("Pre Wedding Photography")
                    .description("Capturing organic romance, soft frames, and candid emotions in dreamy golden hour locations.")
                    .imageType(ImageType.URL)
                    .imageName(null)
                    .imagePath("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop")
                    .build());
            serviceRepository.save(ServiceItem.builder()
                    .title("Birthday Photography")
                    .description("Bright, energetic candid shots highlighting joy, laughter, and milestones of your loved ones.")
                    .imageType(ImageType.URL)
                    .imageName(null)
                    .imagePath("https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop")
                    .build());
            serviceRepository.save(ServiceItem.builder()
                    .title("Baby Photography")
                    .description("Artistic, gentle frames preserving the pure, sweet milestones of your baby's earliest chapters.")
                    .imageType(ImageType.URL)
                    .imageName(null)
                    .imagePath("https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop")
                    .build());
            serviceRepository.save(ServiceItem.builder()
                    .title("Event Photography")
                    .description("Professional coverage for corporate summits, visual galas, and high-profile private celebrations.")
                    .imageType(ImageType.URL)
                    .imageName(null)
                    .imagePath("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop")
                    .build());
            log.info("Default services seeded (5 items).");
        }

        // Seed default gallery if table is empty or contains null image_path
        boolean needsGallerySeed = galleryRepository.count() == 0;
        if (!needsGallerySeed) {
            needsGallerySeed = galleryRepository.findAll().stream()
                    .anyMatch(item -> item.getImagePath() == null || item.getImagePath().trim().isEmpty());
            if (needsGallerySeed) {
                log.info("Legacy/null schema entries detected in gallery table. Clearing table to re-seed.");
                galleryRepository.deleteAll();
            }
        }

        if (needsGallerySeed) {
            seedGalleryItem("The Sacred Walk", "Wedding", "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", "The Royal Udaipur Vows");
            seedGalleryItem("Ethereal Whispers", "Pre Wedding", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", "Florence Sunrises");
            seedGalleryItem("Aria's First Sparkler", "Birthday", "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop", "Golden Milestones");
            seedGalleryItem("Sweet Anticipation", "Baby Shower", "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop", "Blossom Cradles");
            seedGalleryItem("The Engagement Ring Glow", "Engagement", "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop", "Gilded Promises");
            seedGalleryItem("Bridal Portrait Elegance", "Wedding", "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop", "The Royal Udaipur Vows");
            seedGalleryItem("Misty Lakeside Hug", "Pre Wedding", "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop", "Florence Sunrises");
            seedGalleryItem("Sleeping Cherub", "New Born Baby", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop", "Cozy Tiny Toes");
            seedGalleryItem("Graceful Silk Saree Gaze", "Puberty", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop", "Traditional Portraiture");
            log.info("Default gallery items seeded (9 items).");
        }
    }

    private void seedGalleryItem(String title, String category, String url, String description) {
        galleryRepository.save(GalleryItem.builder()
                .title(title)
                .category(category)
                .imageType(ImageType.URL)
                .imageName(null)
                .imagePath(url)
                .description(description)
                .build());
    }
}
