package com.example.photoStudio.mapper;

import com.example.photoStudio.dto.ContactDTO;
import com.example.photoStudio.entity.Contact;

public class ContactMapper {

    private ContactMapper() {
    }

    public static ContactDTO toDTO(Contact entity) {
        return ContactDTO.builder()
                .id(entity.getId())
                .phone(entity.getPhone())
                .whatsapp(entity.getWhatsapp())
                .email(entity.getEmail())
                .instagram(entity.getInstagram())
                .youtube(entity.getYoutube())
                .address(entity.getAddress())
                .addresses(entity.getAddresses())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Contact entity, ContactDTO dto) {
        entity.setPhone(dto.getPhone());
        entity.setWhatsapp(dto.getWhatsapp());
        entity.setEmail(dto.getEmail());
        entity.setInstagram(dto.getInstagram());
        entity.setYoutube(dto.getYoutube());
        entity.setAddress(dto.getAddress());
        entity.setAddresses(dto.getAddresses());
    }
}
