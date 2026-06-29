package com.example.photoStudio.dto;

import com.example.photoStudio.entity.ImageType;
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

    private ImageType imageType;

    private String imageName;

    private String imagePath;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
