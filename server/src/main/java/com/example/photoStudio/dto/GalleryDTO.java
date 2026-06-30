package com.example.photoStudio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String category;

    private String imageUrl;

    private String imagePublicId;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
