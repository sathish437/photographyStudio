package com.example.photoStudio.service;

import com.example.photoStudio.dto.ServiceDTO;
import com.example.photoStudio.entity.ImageType;
import com.example.photoStudio.entity.ServiceItem;
import com.example.photoStudio.exception.InvalidFileException;
import com.example.photoStudio.exception.ResourceNotFoundException;
import com.example.photoStudio.mapper.ServiceMapper;
import com.example.photoStudio.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServiceItemService {

    private final ServiceRepository serviceRepository;
    private final FileStorageService fileStorageService;

    public List<ServiceDTO> getAll() {
        return serviceRepository.findAll()
                .stream()
                .map(ServiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ServiceDTO getById(Long id) {
        ServiceItem item = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        return ServiceMapper.toDTO(item);
    }

    @Transactional
    public ServiceDTO create(String title, String description, MultipartFile image, String imageUrl) {
        boolean hasImage = image != null && !image.isEmpty();
        boolean hasUrl = imageUrl != null && !imageUrl.trim().isEmpty();

        if (hasImage && hasUrl) {
            throw new InvalidFileException("Please provide either an uploaded image or an image URL, but not both.");
        }
        if (!hasImage && !hasUrl) {
            throw new InvalidFileException("Please provide either an uploaded image or an image URL, but not both.");
        }

        ServiceItem.ServiceItemBuilder builder = ServiceItem.builder()
                .title(title)
                .description(description);

        if (hasImage) {
            String path = fileStorageService.storeFile(image, "services");
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

        ServiceItem saved = serviceRepository.save(builder.build());
        return ServiceMapper.toDTO(saved);
    }

    @Transactional
    public ServiceDTO update(Long id, String title, String description, MultipartFile image, String imageUrl) {
        ServiceItem item = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));

        boolean hasImage = image != null && !image.isEmpty();
        boolean hasUrl = imageUrl != null && !imageUrl.trim().isEmpty();

        if (hasImage && hasUrl) {
            throw new InvalidFileException("Please provide either an uploaded image or an image URL, but not both.");
        }

        item.setTitle(title);
        item.setDescription(description);

        if (hasImage) {
            // Delete old file if it was LOCAL
            if (item.getImageType() == ImageType.LOCAL && item.getImagePath() != null) {
                fileStorageService.deleteFile(item.getImagePath());
            }
            String path = fileStorageService.storeFile(image, "services");
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

        ServiceItem updated = serviceRepository.save(item);
        return ServiceMapper.toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        ServiceItem item = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));

        // Delete physical file if type is LOCAL
        if (item.getImageType() == ImageType.LOCAL && item.getImagePath() != null) {
            fileStorageService.deleteFile(item.getImagePath());
        }

        serviceRepository.delete(item);
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
