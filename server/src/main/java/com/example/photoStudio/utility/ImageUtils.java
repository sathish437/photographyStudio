package com.example.photoStudio.utility;

import com.example.photoStudio.entity.ImageType;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

public class ImageUtils {

    private ImageUtils() {}

    public static String getFullImagePath(String imagePath, ImageType imageType) {
        if (imagePath == null || imagePath.trim().isEmpty()) {
            return null;
        }
        if ((imageType == ImageType.LOCAL || imageType == null) && !imagePath.startsWith("http://") && !imagePath.startsWith("https://")) {
            try {
                String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
                return baseUrl + imagePath;
            } catch (Exception e) {
                return imagePath;
            }
        }
        return imagePath;
    }
}
