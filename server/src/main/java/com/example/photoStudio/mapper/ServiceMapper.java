package com.example.photoStudio.mapper;

import com.example.photoStudio.dto.ServiceDTO;
import com.example.photoStudio.entity.ServiceItem;

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
                .imageUrl(entity.getImageUrl())
                .imagePublicId(entity.getImagePublicId())
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
                .imageUrl(dto.getImageUrl())
                .imagePublicId(dto.getImagePublicId())
                .build();
    }

    public static void updateEntity(ServiceItem entity, ServiceDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setImageUrl(dto.getImageUrl());
        entity.setImagePublicId(dto.getImagePublicId());
    }
}
