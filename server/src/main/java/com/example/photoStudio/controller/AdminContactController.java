package com.example.photoStudio.controller;

import com.example.photoStudio.dto.ContactDTO;
import com.example.photoStudio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contact")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAll() {
        return ResponseEntity.ok(contactService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> update(@PathVariable Long id, @Valid @RequestBody ContactDTO dto) {
        ContactDTO updated = contactService.update(id, dto);
        return ResponseEntity.ok(updated);
    }
}
