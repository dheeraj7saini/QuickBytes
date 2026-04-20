package com.sem6.foodordering.backend.dto.order;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class OrderItemResponse {
    Long menuItemId;
    String name;
    BigDecimal price;
    Integer quantity;
}
