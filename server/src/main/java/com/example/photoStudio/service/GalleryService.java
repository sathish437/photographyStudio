package com.example.photoStudio.service;

import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.entity.GalleryItem;
import com.example.photoStudio.exception.InvalidFileException;
import com.example.photoStudio.exception.ResourceNotFoundException;
import com.example.photoStudio.mapper.GalleryMapper;
import com.example.photoStudio.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class GalleryService {

    private final GalleryRepository galleryRepository;
    private final CloudinaryService cloudinaryService;

    public List<GalleryDTO> getAll() {
        log.info("Fetching all gallery items from database");
        return galleryRepository.findAll()
                .stream()
                .map(GalleryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public GalleryDTO getById(Long id) {
        log.info("Fetching gallery item with ID: {}", id);
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Gallery item not found with ID: {}", id);
                    return new ResourceNotFoundException("Gallery item", id);
                });
        return GalleryMapper.toDTO(item);
    }

    @Transactional
    public GalleryDTO create(String title, String category, String description, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            log.error("Image upload failed: MultipartFile is null or empty");
            throw new InvalidFileException("Image file is required.");
        }

        try {
            log.info("Uploading image");
            Map<?, ?> uploadResult = cloudinaryService.upload(image);
            String imageUrl = cloudinaryService.getImageUrl(uploadResult);
            String publicId = cloudinaryService.getPublicId(uploadResult);
            log.info("Cloudinary upload success");

            log.info("Saving gallery");
            GalleryItem saved = galleryRepository.save(GalleryItem.builder()
                    .title(title)
                    .category(category)
                    .description(description)
                    .imageUrl(imageUrl)
                    .imagePublicId(publicId)
                    .build());
            log.info("Gallery saved successfully");
            return GalleryMapper.toDTO(saved);
        } catch (Exception e) {
            log.error("Full stack trace", e);
            throw e;
        }
    }

    @Transactional
    public GalleryDTO update(Long id, String title, String category, String description, MultipartFile image) {
        log.info("Updating gallery item with ID: {}", id);
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Gallery item not found with ID: {}", id);
                    return new ResourceNotFoundException("Gallery item", id);
                });

        item.setTitle(title);
        item.setCategory(category);
        item.setDescription(description);

        if (image != null && !image.isEmpty()) {
            try {
                // Delete old Cloudinary image using publicId if exists
                if (item.getImagePublicId() != null && !item.getImagePublicId().isEmpty()) {
                    log.info("Deleting old image: {}", item.getImagePublicId());
                    cloudinaryService.delete(item.getImagePublicId());
                }
                // Upload new image
                log.info("Uploading image");
                Map<?, ?> uploadResult = cloudinaryService.upload(image);
                String imageUrl = cloudinaryService.getImageUrl(uploadResult);
                String publicId = cloudinaryService.getPublicId(uploadResult);
                log.info("Cloudinary upload success");

                item.setImageUrl(imageUrl);
                item.setImagePublicId(publicId);
            } catch (Exception e) {
                log.error("Full stack trace", e);
                throw e;
            }
        }

        log.info("Saving gallery");
        GalleryItem updated = galleryRepository.save(item);
        log.info("Gallery saved successfully");
        return GalleryMapper.toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting gallery item with ID: {}", id);
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Gallery item not found with ID: {}", id);
                    return new ResourceNotFoundException("Gallery item", id);
                });

        // Delete from Cloudinary if exists
        if (item.getImagePublicId() != null && !item.getImagePublicId().isEmpty()) {
            try {
                log.info("Deleting image from Cloudinary: {}", item.getImagePublicId());
                cloudinaryService.delete(item.getImagePublicId());
            } catch (Exception e) {
                log.warn("Failed to delete image from Cloudinary for gallery item ID: {}. Error: {}", id, e.getMessage(), e);
            }
        }

        log.info("Removing gallery item from database...");
        galleryRepository.delete(item);
        log.info("Gallery item deleted successfully. ID: {}", id);
    }
}
