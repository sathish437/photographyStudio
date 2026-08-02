package com.example.photoStudio.repository;

import com.example.photoStudio.entity.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findAllByOrderByIdAsc();
}
