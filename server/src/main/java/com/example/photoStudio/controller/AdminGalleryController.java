package com.example.photoStudio.controller;

import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.dto.GalleryUploadDTO;
import com.example.photoStudio.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gallery")
@RequiredArgsConstructor
@Slf4j
public class AdminGalleryController {

    private final GalleryService galleryService;

    @GetMapping
    public ResponseEntity<List<GalleryDTO>> getAll() {
        log.info("Request received: GET /api/admin/gallery");
        return ResponseEntity.ok(galleryService.getAll());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GalleryDTO> create(@ModelAttribute GalleryUploadDTO dto) {
        log.info("Request received: POST /api/admin/gallery");
        log.info("Validating request");
        
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            log.warn("Validation warning: title is empty");
        }
        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            log.warn("Validation warning: category is empty");
        }
        if (dto.getImage() == null || dto.getImage().isEmpty()) {
            log.warn("Validation warning: image is empty");
        }
        
        GalleryDTO created = galleryService.create(dto.getTitle(), dto.getCategory(), dto.getDescription(), dto.getImage());
        log.info("Gallery saved successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GalleryDTO> update(@PathVariable Long id, @ModelAttribute GalleryUploadDTO dto) {
        log.info("Request received: PUT /api/admin/gallery/{}", id);
        log.info("Validating request");
        
        GalleryDTO updated = galleryService.update(id, dto.getTitle(), dto.getCategory(), dto.getDescription(), dto.getImage());
        log.info("Gallery saved successfully");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Request received: DELETE /api/admin/gallery/{}", id);
        galleryService.delete(id);
        log.info("Gallery deleted successfully");
        return ResponseEntity.noContent().build();
    }
}
