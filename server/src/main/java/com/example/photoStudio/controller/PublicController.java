package com.example.photoStudio.controller;

import com.example.photoStudio.dto.ContactDTO;
import com.example.photoStudio.dto.GalleryDTO;
import com.example.photoStudio.dto.ServiceDTO;
import com.example.photoStudio.service.ContactService;
import com.example.photoStudio.service.GalleryService;
import com.example.photoStudio.service.ServiceItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ServiceItemService serviceItemService;
    private final GalleryService galleryService;
    private final ContactService contactService;

    @GetMapping("/services")
    public ResponseEntity<List<ServiceDTO>> getServices() {
        return ResponseEntity.ok(serviceItemService.getAll());
    }

    @GetMapping("/gallery")
    public ResponseEntity<List<GalleryDTO>> getGallery() {
        return ResponseEntity.ok(galleryService.getAll());
    }

    @GetMapping("/contact")
    public ResponseEntity<List<ContactDTO>> getContact() {
        return ResponseEntity.ok(contactService.getAll());
    }
}
