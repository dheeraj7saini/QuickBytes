package com.sem6.foodordering.backend.dto.shop;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MenuItemResponse {
    Long id;
    String name;
    BigDecimal price;
    String imageUrl;
}
