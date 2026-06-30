package com.example.photoStudio.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.photoStudio.exception.InvalidFileException;
import com.example.photoStudio.exception.UploadException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Validates and uploads a file to Cloudinary.
     * @param file the MultipartFile to upload
     * @return the map containing upload results
     */
    public Map<?, ?> upload(MultipartFile file) {
        validateFile(file);
        try {
            return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new UploadException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    /**
     * Returns the secure image URL from the upload result map.
     * @param uploadResult the raw Cloudinary upload result map
     * @return the secure URL
     */
    public String getImageUrl(Map<?, ?> uploadResult) {
        if (uploadResult == null) {
            return null;
        }
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Returns the public ID from the upload result map.
     * @param uploadResult the raw Cloudinary upload result map
     * @return the public ID
     */
    public String getPublicId(Map<?, ?> uploadResult) {
        if (uploadResult == null) {
            return null;
        }
        return (String) uploadResult.get("public_id");
    }

    /**
     * Deletes an image from Cloudinary using its public ID.
     * @param publicId the public ID of the image to delete
     */
    public void delete(String publicId) {
        if (publicId == null || publicId.trim().isEmpty()) {
            return;
        }
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new UploadException("Cloudinary delete failed for public ID: " + publicId, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty or not provided");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File size exceeds the limit of 10 MB");
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.contains(".")) {
            throw new InvalidFileException("Invalid file name");
        }
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidFileException("Unsupported file format. Allowed formats: " + ALLOWED_EXTENSIONS);
        }
    }
}
