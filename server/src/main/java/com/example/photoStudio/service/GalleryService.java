package com.example.photoStudio.service;

import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.entity.GalleryItem;
import com.example.photoStudio.entity.ImageType;
import com.example.photoStudio.exception.InvalidFileException;
import com.example.photoStudio.exception.ResourceNotFoundException;
import com.example.photoStudio.mapper.GalleryMapper;
import com.example.photoStudio.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryService {

    private final GalleryRepository galleryRepository;
    private final FileStorageService fileStorageService;

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
    public GalleryDTO create(String title, String category, String description, MultipartFile image, String imageUrl) {
        boolean hasImage = image != null && !image.isEmpty();
        boolean hasUrl = imageUrl != null && !imageUrl.trim().isEmpty();

        if (hasImage && hasUrl) {
            throw new InvalidFileException("Please provide either an uploaded image or an image URL, but not both.");
        }
        if (!hasImage && !hasUrl) {
            throw new InvalidFileException("Please provide either an uploaded image or an image URL, but not both.");
        }

        GalleryItem.GalleryItemBuilder builder = GalleryItem.builder()
                .title(title)
                .category(category)
                .description(description);

        if (hasImage) {
            String path = fileStorageService.storeFile(image, category);
            String name = path.substring(path.lastIndexOf('/') + 1);
            builder.imageType(ImageType.LOCAL)
                    .imageName(name)
                    .imagePath(path);
        } else {
            validateUrl(imageUrl);
            builder.imageType(ImageType.URL)
                    .imageName(null)
                    .imagePath(imageUrl.trim());
        }

        GalleryItem saved = galleryRepository.save(builder.build());
        return GalleryMapper.toDTO(saved);
    }

    @Transactional
    public GalleryDTO update(Long id, String title, String category, String description, MultipartFile image, String imageUrl) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));

        boolean hasImage = image != null && !image.isEmpty();
        boolean hasUrl = imageUrl != null && !imageUrl.trim().isEmpty();

        if (hasImage && hasUrl) {
            throw new InvalidFileException("Please provide either an uploaded image or an image URL, but not both.");
        }

        item.setTitle(title);
        item.setCategory(category);
        item.setDescription(description);

        if (hasImage) {
            // Delete old file if it was LOCAL
            if (item.getImageType() == ImageType.LOCAL && item.getImagePath() != null) {
                fileStorageService.deleteFile(item.getImagePath());
            }
            String path = fileStorageService.storeFile(image, category);
            String name = path.substring(path.lastIndexOf('/') + 1);
            item.setImageType(ImageType.LOCAL);
            item.setImageName(name);
            item.setImagePath(path);
        } else if (hasUrl) {
            validateUrl(imageUrl);
            // Delete old file if it was LOCAL
            if (item.getImageType() == ImageType.LOCAL && item.getImagePath() != null) {
                fileStorageService.deleteFile(item.getImagePath());
            }
            item.setImageType(ImageType.URL);
            item.setImageName(null);
            item.setImagePath(imageUrl.trim());
        }

        GalleryItem updated = galleryRepository.save(item);
        return GalleryMapper.toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));

        // Delete physical file if type is LOCAL
        if (item.getImageType() == ImageType.LOCAL && item.getImagePath() != null) {
            fileStorageService.deleteFile(item.getImagePath());
        }

        galleryRepository.delete(item);
    }

    private void validateUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new InvalidFileException("URL is invalid or empty");
        }
        try {
            java.net.URI uri = java.net.URI.create(url);
            if (uri.getScheme() == null || (!uri.getScheme().equalsIgnoreCase("http") && !uri.getScheme().equalsIgnoreCase("https"))) {
                throw new InvalidFileException("URL must use HTTP or HTTPS protocol");
            }
        } catch (Exception e) {
            throw new InvalidFileException("Please provide a valid image URL");
        }
    }
}
