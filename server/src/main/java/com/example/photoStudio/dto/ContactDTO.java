package com.example.photoStudio.dto;

import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {

    private Long id;

    private String phone;

    private String whatsapp;

    @Email(message = "Please provide a valid email address")
    private String email;

    private String instagram;

    private String youtube;

    private String address;

    private LocalDateTime updatedAt;
}
