package com.sem6.foodordering.backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
public class PlaceOrderRequest {

    @NotNull
    private Long shopId;

    @Valid
    @NotEmpty
    private List<PlaceOrderItemRequest> items;
}
