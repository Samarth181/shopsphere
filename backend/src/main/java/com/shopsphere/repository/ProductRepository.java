package com.shopsphere.repository;

import com.shopsphere.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT p FROM Product p
            WHERE p.active = true
              AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:categoryId IS NULL OR p.category.id = :categoryId)
            ORDER BY p.name ASC
            """)
    List<Product> searchActiveProducts(@Param("search") String search,
                                       @Param("categoryId") Long categoryId);

    List<Product> findAllByOrderByIdAsc();

    Optional<Product> findByIdAndActiveTrue(Long id);
}
