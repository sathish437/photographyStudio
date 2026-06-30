package com.example.photoStudio.service;

import com.example.photoStudio.dto.ServiceDTO;
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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServiceItemService {

    private final ServiceRepository serviceRepository;
    private final CloudinaryService cloudinaryService;

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
    public ServiceDTO create(String title, String description, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new InvalidFileException("Image file is required.");
        }

        Map<?, ?> uploadResult = cloudinaryService.upload(image);
        String imageUrl = cloudinaryService.getImageUrl(uploadResult);
        String publicId = cloudinaryService.getPublicId(uploadResult);

        ServiceItem saved = serviceRepository.save(ServiceItem.builder()
                .title(title)
                .description(description)
                .imageUrl(imageUrl)
                .imagePublicId(publicId)
                .build());
        return ServiceMapper.toDTO(saved);
    }

    @Transactional
    public ServiceDTO update(Long id, String title, String description, MultipartFile image) {
        ServiceItem item = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));

        item.setTitle(title);
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

        ServiceItem updated = serviceRepository.save(item);
        return ServiceMapper.toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        ServiceItem item = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));

        // Delete from Cloudinary if exists
        if (item.getImagePublicId() != null && !item.getImagePublicId().isEmpty()) {
            cloudinaryService.delete(item.getImagePublicId());
        }

        serviceRepository.delete(item);
    }
}
