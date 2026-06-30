package com.example.photoStudio.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String phone;

    @Column(length = 30)
    private String whatsapp;

    @Column(length = 150)
    private String email;

    @Column(length = 300)
    private String instagram;

    @Column(length = 300)
    private String youtube;

    @Column(columnDefinition = "TEXT")
    private String address;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "contact_addresses", joinColumns = @JoinColumn(name = "contact_id"))
    @Column(name = "address", columnDefinition = "TEXT")
    private List<String> addresses;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
