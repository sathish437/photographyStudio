package com.example.photoStudio.mapper;

import com.example.photoStudio.dto.ServiceDTO;
import com.example.photoStudio.entity.ServiceItem;
import com.example.photoStudio.utility.ImageUtils;

public class ServiceMapper {

    private ServiceMapper() {
    }

    public static ServiceDTO toDTO(ServiceItem entity) {
        if (entity == null) {
            return null;
        }
        return ServiceDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .imageType(entity.getImageType())
                .imageName(entity.getImageName())
                .imagePath(entity.getImagePath())
                .imageUrl(ImageUtils.getFullImagePath(entity.getImagePath(), entity.getImageType()))
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static ServiceItem toEntity(ServiceDTO dto) {
        if (dto == null) {
            return null;
        }
        return ServiceItem.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .imageType(dto.getImageType())
                .imageName(dto.getImageName())
                .imagePath(dto.getImagePath())
                .build();
    }

    public static void updateEntity(ServiceItem entity, ServiceDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setImageType(dto.getImageType());
        entity.setImageName(dto.getImageName());
        entity.setImagePath(dto.getImagePath());
    }
}
