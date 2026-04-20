package com.sem6.foodordering.backend.dto.order;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RateOrderRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
}
