package com.sem6.foodordering.backend.service;

import com.sem6.foodordering.backend.dto.order.OrderItemResponse;
import com.sem6.foodordering.backend.dto.order.OrderResponse;
import com.sem6.foodordering.backend.dto.order.PlaceOrderItemRequest;
import com.sem6.foodordering.backend.dto.order.PlaceOrderRequest;
import com.sem6.foodordering.backend.exception.BadRequestException;
import com.sem6.foodordering.backend.exception.ResourceNotFoundException;
import com.sem6.foodordering.backend.model.CustomerOrder;
import com.sem6.foodordering.backend.model.MenuItem;
import com.sem6.foodordering.backend.model.OrderLineItem;
import com.sem6.foodordering.backend.model.OrderStatus;
import com.sem6.foodordering.backend.model.Role;
import com.sem6.foodordering.backend.model.Shop;
import com.sem6.foodordering.backend.model.ShopStatus;
import com.sem6.foodordering.backend.model.UserAccount;
import com.sem6.foodordering.backend.repository.CustomerOrderRepository;
import com.sem6.foodordering.backend.repository.MenuItemRepository;
import com.sem6.foodordering.backend.repository.UserAccountRepository;
import com.sem6.foodordering.backend.security.AuthUser;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerOrderRepository customerOrderRepository;
    private final UserAccountRepository userAccountRepository;
    private final MenuItemRepository menuItemRepository;
    private final ShopService shopService;

    @Transactional
    public OrderResponse placeOrder(AuthUser authUser, PlaceOrderRequest request) {
        if (authUser.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("Only customers can place orders");
        }

        UserAccount customer = userAccountRepository.findById(authUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Shop shop = shopService.findShop(request.getShopId());
        if (shop.getStatus() == ShopStatus.PAUSED) {
            throw new BadRequestException("This shop is currently paused");
        }

        List<OrderLineItem> items = new ArrayList<>();
        for (PlaceOrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

            if (!menuItem.getShop().getId().equals(shop.getId())) {
                throw new BadRequestException("All items in an order must belong to the selected shop");
            }

            items.add(OrderLineItem.builder()
                .menuItemId(menuItem.getId())
                .itemName(menuItem.getName())
                .price(menuItem.getPrice())
                .quantity(itemRequest.getQuantity())
                .build());
        }

        CustomerOrder order = CustomerOrder.builder()
            .customer(customer)
            .shop(shop)
            .status(OrderStatus.PLACED)
            .createdAt(Instant.now())
            .rating(null)
            .items(new ArrayList<>())
            .build();

        items.forEach(item -> item.setOrder(order));
        order.getItems().addAll(items);

        return toOrderResponse(customerOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(AuthUser authUser) {
        return customerOrderRepository.findByCustomerIdOrderByCreatedAtDesc(authUser.getId()).stream()
            .map(this::toOrderResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getVendorOrders(AuthUser authUser) {
        if (authUser.getShopId() == null) {
            throw new AccessDeniedException("Vendor does not have an assigned shop");
        }

        return customerOrderRepository.findByShopIdOrderByCreatedAtAsc(authUser.getShopId()).stream()
            .map(this::toOrderResponse)
            .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status, AuthUser authUser) {
        CustomerOrder order = findOrder(orderId);

        if (authUser.getRole() == Role.VENDOR && !order.getShop().getId().equals(authUser.getShopId())) {
            throw new AccessDeniedException("You can update only orders for your own shop");
        }

        order.setStatus(status);
        return toOrderResponse(customerOrderRepository.save(order));
    }

    @Transactional
    public OrderResponse rateOrder(Long orderId, Integer rating, AuthUser authUser) {
        CustomerOrder order = findOrder(orderId);
        if (!order.getCustomer().getId().equals(authUser.getId())) {
            throw new AccessDeniedException("You can rate only your own orders");
        }

        order.setRating(rating);
        return toOrderResponse(customerOrderRepository.save(order));
    }

    private CustomerOrder findOrder(Long orderId) {
        return customerOrderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private OrderResponse toOrderResponse(CustomerOrder order) {
        return OrderResponse.builder()
            .id(order.getId())
            .shopId(order.getShop().getId())
            .shopName(order.getShop().getName())
            .customerName(order.getCustomer().getName())
            .status(order.getStatus())
            .createdAt(order.getCreatedAt())
            .rating(order.getRating())
            .items(order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                    .menuItemId(item.getMenuItemId())
                    .name(item.getItemName())
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .build())
                .toList())
            .build();
    }
}
