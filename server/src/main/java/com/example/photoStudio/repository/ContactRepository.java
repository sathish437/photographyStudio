package com.example.photoStudio.repository;

import com.example.photoStudio.entity.Contact;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    @Override
    @EntityGraph(attributePaths = {"addresses"})
    List<Contact> findAll();
}
