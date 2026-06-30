package com.example.photoStudio.mapper;

import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.entity.GalleryItem;

public class GalleryMapper {

    private GalleryMapper() {
    }

    public static GalleryDTO toDTO(GalleryItem entity) {
        if (entity == null) {
            return null;
        }
        return GalleryDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .imageUrl(entity.getImageUrl())
                .imagePublicId(entity.getImagePublicId())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static GalleryItem toEntity(GalleryDTO dto) {
        if (dto == null) {
            return null;
        }
        return GalleryItem.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .imagePublicId(dto.getImagePublicId())
                .description(dto.getDescription())
                .build();
    }

    public static void updateEntity(GalleryItem entity, GalleryDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        entity.setTitle(dto.getTitle());
        entity.setCategory(dto.getCategory());
        entity.setImageUrl(dto.getImageUrl());
        entity.setImagePublicId(dto.getImagePublicId());
        entity.setDescription(dto.getDescription());
    }
}
