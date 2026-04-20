package com.sem6.foodordering.backend.dto.shop;

import com.sem6.foodordering.backend.model.ShopStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateShopStatusRequest {

    @NotNull
    private ShopStatus status;
}
