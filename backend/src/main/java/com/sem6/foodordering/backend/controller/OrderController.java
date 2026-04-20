package com.sem6.foodordering.backend.controller;

import com.sem6.foodordering.backend.dto.order.OrderResponse;
import com.sem6.foodordering.backend.dto.order.PlaceOrderRequest;
import com.sem6.foodordering.backend.dto.order.RateOrderRequest;
import com.sem6.foodordering.backend.security.AuthUser;
import com.sem6.foodordering.backend.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public OrderResponse placeOrder(
        @AuthenticationPrincipal AuthUser authUser,
        @Valid @RequestBody PlaceOrderRequest request
    ) {
        return orderService.placeOrder(authUser, request);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal AuthUser authUser) {
        return orderService.getCustomerOrders(authUser);
    }

    @PostMapping("/{orderId}/rating")
    @PreAuthorize("hasRole('CUSTOMER')")
    public OrderResponse rateOrder(
        @PathVariable Long orderId,
        @AuthenticationPrincipal AuthUser authUser,
        @Valid @RequestBody RateOrderRequest request
    ) {
        return orderService.rateOrder(orderId, request.getRating(), authUser);
    }
}
