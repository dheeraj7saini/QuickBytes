package com.sem6.foodordering.backend.dto.shop;

import com.sem6.foodordering.backend.model.ShopStatus;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ShopResponse {
    Long id;
    String name;
    String category;
    String cuisine;
    String eta;
    String accent;
    ShopStatus status;
    List<MenuItemResponse> menuItems;
}
