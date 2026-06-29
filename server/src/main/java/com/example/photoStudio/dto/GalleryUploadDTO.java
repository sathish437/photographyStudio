package com.example.photoStudio.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryUploadDTO {

    private String title;
    
    private String category;
    
    private String description;
    
    private MultipartFile image;
}
