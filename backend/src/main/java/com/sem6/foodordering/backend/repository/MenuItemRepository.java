package com.sem6.foodordering.backend.repository;

import com.sem6.foodordering.backend.model.MenuItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByShopId(Long shopId);
}
