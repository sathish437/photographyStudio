package com.example.photoStudio.repository;

import com.example.photoStudio.entity.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {
}
