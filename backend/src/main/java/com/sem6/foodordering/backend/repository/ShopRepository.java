package com.sem6.foodordering.backend.repository;

import com.sem6.foodordering.backend.model.Shop;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    Optional<Shop> findByNameIgnoreCase(String name);
}
