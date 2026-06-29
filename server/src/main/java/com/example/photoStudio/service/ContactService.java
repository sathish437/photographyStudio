package com.example.photoStudio.service;

import com.example.photoStudio.dto.ContactDTO;
import com.example.photoStudio.entity.Contact;
import com.example.photoStudio.exception.ResourceNotFoundException;
import com.example.photoStudio.mapper.ContactMapper;
import com.example.photoStudio.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public List<ContactDTO> getAll() {
        return contactRepository.findAll()
                .stream()
                .map(ContactMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ContactDTO getById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
        return ContactMapper.toDTO(contact);
    }

    public ContactDTO update(Long id, ContactDTO dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
        ContactMapper.updateEntity(contact, dto);
        Contact updated = contactRepository.save(contact);
        return ContactMapper.toDTO(updated);
    }
}
