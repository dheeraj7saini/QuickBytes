package com.sem6.foodordering.backend.dto.shop;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class CreateMenuItemRequest {

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    private String imageUrl;
}
