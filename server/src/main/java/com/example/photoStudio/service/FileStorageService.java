package com.example.photoStudio.service;

import com.example.photoStudio.exception.InvalidFileException;
import com.example.photoStudio.exception.UploadException;
import com.example.photoStudio.exception.FileNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path rootLocation;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new UploadException("Could not initialize storage directory", e);
        }
    }

    public String sanitizeCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return "general";
        }
        return category.trim().toLowerCase()
                .replaceAll("[^a-z0-9-_]", "-")
                .replaceAll("-+", "-");
    }

    public String storeFile(MultipartFile file, String category) {
        validateFile(file);

        String sanitizedCategory = sanitizeCategory(category);
        Path categoryLocation = this.rootLocation.resolve(sanitizedCategory);

        try {
            Files.createDirectories(categoryLocation);
        } catch (IOException e) {
            throw new UploadException("Could not create category directory: " + sanitizedCategory, e);
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + "." + extension;

        Path destinationFile = categoryLocation.resolve(uniqueFilename).normalize();

        if (!destinationFile.getParent().equals(categoryLocation.toAbsolutePath())) {
            throw new InvalidFileException("Cannot store file outside current directory.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            // Return public resource path (e.g. /uploads/wedding/uuid.jpg)
            return "/uploads/" + sanitizedCategory + "/" + uniqueFilename;
        } catch (IOException e) {
            throw new UploadException("Failed to store file " + uniqueFilename, e);
        }
    }

    public void deleteFile(String imagePath) {
        if (imagePath == null || imagePath.trim().isEmpty()) {
            return;
        }

        // Exclude absolute external URLs if they are seeded before download is implemented
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return;
        }

        // Expected format: /uploads/category/filename
        if (imagePath.startsWith("/uploads/")) {
            String relativePath = imagePath.substring("/uploads/".length());
            Path filePath = this.rootLocation.resolve(relativePath).normalize();
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new UploadException("Failed to delete file: " + imagePath, e);
            }
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Failed to store empty file.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File size exceeds the limit of 10MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new InvalidFileException("Filename is invalid.");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new InvalidFileException("Only JPG, JPEG, PNG, and WEBP files are allowed.");
        }
    }

    private String getFileExtension(String filename) {
        int lastIndex = filename.lastIndexOf('.');
        if (lastIndex == -1) {
            return "jpg"; // Default standard fallback
        }
        return filename.substring(lastIndex + 1);
    }
}
