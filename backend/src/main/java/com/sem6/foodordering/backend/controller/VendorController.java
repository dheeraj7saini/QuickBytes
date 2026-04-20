package com.sem6.foodordering.backend.controller;

import com.sem6.foodordering.backend.dto.order.OrderResponse;
import com.sem6.foodordering.backend.dto.order.UpdateOrderStatusRequest;
import com.sem6.foodordering.backend.dto.shop.CreateMenuItemRequest;
import com.sem6.foodordering.backend.dto.shop.MenuItemResponse;
import com.sem6.foodordering.backend.dto.shop.ShopResponse;
import com.sem6.foodordering.backend.dto.shop.UpdateMenuItemRequest;
import com.sem6.foodordering.backend.dto.shop.UpdateShopStatusRequest;
import com.sem6.foodordering.backend.security.AuthUser;
import com.sem6.foodordering.backend.service.OrderService;
import com.sem6.foodordering.backend.service.ShopService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorController {

    private final ShopService shopService;
    private final OrderService orderService;

    @GetMapping("/orders")
    public List<OrderResponse> getVendorOrders(@AuthenticationPrincipal AuthUser authUser) {
        return orderService.getVendorOrders(authUser);
    }

    @GetMapping("/shop")
    public ShopResponse getVendorShop(@AuthenticationPrincipal AuthUser authUser) {
        return shopService.getShopById(authUser.getShopId());
    }

    @PatchMapping("/shops/{shopId}/status")
    public ShopResponse updateShopStatus(
        @PathVariable Long shopId,
        @AuthenticationPrincipal AuthUser authUser,
        @Valid @RequestBody UpdateShopStatusRequest request
    ) {
        return shopService.updateShopStatus(shopId, request.getStatus(), authUser);
    }

    @PostMapping("/shops/{shopId}/menu-items")
    public MenuItemResponse addMenuItem(
        @PathVariable Long shopId,
        @AuthenticationPrincipal AuthUser authUser,
        @Valid @RequestBody CreateMenuItemRequest request
    ) {
        return shopService.addMenuItem(
            shopId,
            request.getName(),
            request.getPrice(),
            request.getImageUrl(),
            authUser
        );
    }

    @PatchMapping("/shops/{shopId}/menu-items/{menuItemId}")
    public MenuItemResponse updateMenuItem(
        @PathVariable Long shopId,
        @PathVariable Long menuItemId,
        @AuthenticationPrincipal AuthUser authUser,
        @Valid @RequestBody UpdateMenuItemRequest request
    ) {
        return shopService.updateMenuItem(
            shopId,
            menuItemId,
            request.getName(),
            request.getPrice(),
            request.getImageUrl(),
            authUser
        );
    }

    @PatchMapping("/orders/{orderId}/status")
    public OrderResponse updateOrderStatus(
        @PathVariable Long orderId,
        @AuthenticationPrincipal AuthUser authUser,
        @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateOrderStatus(orderId, request.getStatus(), authUser);
    }
}
