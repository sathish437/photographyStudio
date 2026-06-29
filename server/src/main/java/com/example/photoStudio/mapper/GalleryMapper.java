package com.example.photoStudio.mapper;

import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.entity.GalleryItem;
import com.example.photoStudio.utility.ImageUtils;

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
                .imageType(entity.getImageType())
                .imageName(entity.getImageName())
                .imagePath(ImageUtils.getFullImagePath(entity.getImagePath(), entity.getImageType()))
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
                .imageType(dto.getImageType())
                .imageName(dto.getImageName())
                .imagePath(dto.getImagePath())
                .description(dto.getDescription())
                .build();
    }

    public static void updateEntity(GalleryItem entity, GalleryDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        entity.setTitle(dto.getTitle());
        entity.setCategory(dto.getCategory());
        entity.setImageType(dto.getImageType());
        entity.setImageName(dto.getImageName());
        entity.setImagePath(dto.getImagePath());
        entity.setDescription(dto.getDescription());
    }
}
