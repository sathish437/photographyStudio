package com.example.photoStudio.service;

import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.entity.GalleryItem;
import com.example.photoStudio.exception.InvalidFileException;
import com.example.photoStudio.exception.ResourceNotFoundException;
import com.example.photoStudio.mapper.GalleryMapper;
import com.example.photoStudio.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryService {

    private final GalleryRepository galleryRepository;
    private final CloudinaryService cloudinaryService;

    public List<GalleryDTO> getAll() {
        return galleryRepository.findAll()
                .stream()
                .map(GalleryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public GalleryDTO getById(Long id) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));
        return GalleryMapper.toDTO(item);
    }

    @Transactional
    public GalleryDTO create(String title, String category, String description, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new InvalidFileException("Image file is required.");
        }

        Map<?, ?> uploadResult = cloudinaryService.upload(image);
        String imageUrl = cloudinaryService.getImageUrl(uploadResult);
        String publicId = cloudinaryService.getPublicId(uploadResult);

        GalleryItem saved = galleryRepository.save(GalleryItem.builder()
                .title(title)
                .category(category)
                .description(description)
                .imageUrl(imageUrl)
                .imagePublicId(publicId)
                .build());
        return GalleryMapper.toDTO(saved);
    }

    @Transactional
    public GalleryDTO update(Long id, String title, String category, String description, MultipartFile image) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));

        item.setTitle(title);
        item.setCategory(category);
        item.setDescription(description);

        if (image != null && !image.isEmpty()) {
            // Delete old Cloudinary image using publicId if exists
            if (item.getImagePublicId() != null && !item.getImagePublicId().isEmpty()) {
                cloudinaryService.delete(item.getImagePublicId());
            }
            // Upload new image
            Map<?, ?> uploadResult = cloudinaryService.upload(image);
            String imageUrl = cloudinaryService.getImageUrl(uploadResult);
            String publicId = cloudinaryService.getPublicId(uploadResult);

            item.setImageUrl(imageUrl);
            item.setImagePublicId(publicId);
        }

        GalleryItem updated = galleryRepository.save(item);
        return GalleryMapper.toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));

        // Delete from Cloudinary if exists
        if (item.getImagePublicId() != null && !item.getImagePublicId().isEmpty()) {
            cloudinaryService.delete(item.getImagePublicId());
        }

        galleryRepository.delete(item);
    }
}
