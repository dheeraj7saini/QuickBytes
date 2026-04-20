package com.sem6.foodordering.backend.repository;

import com.sem6.foodordering.backend.model.CustomerOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    List<CustomerOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<CustomerOrder> findByShopIdOrderByCreatedAtAsc(Long shopId);
}
