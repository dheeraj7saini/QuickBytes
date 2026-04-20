package com.sem6.foodordering.backend.dto.order;

import com.sem6.foodordering.backend.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;
}
