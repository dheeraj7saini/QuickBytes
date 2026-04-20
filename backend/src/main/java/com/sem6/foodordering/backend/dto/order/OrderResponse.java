package com.sem6.foodordering.backend.dto.order;

import com.sem6.foodordering.backend.model.OrderStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class OrderResponse {
    Long id;
    Long shopId;
    String shopName;
    String customerName;
    OrderStatus status;
    Instant createdAt;
    Integer rating;
    List<OrderItemResponse> items;
}
