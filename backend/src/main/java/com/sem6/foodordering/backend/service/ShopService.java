package com.sem6.foodordering.backend.service;

import com.sem6.foodordering.backend.dto.shop.MenuItemResponse;
import com.sem6.foodordering.backend.dto.shop.ShopResponse;
import com.sem6.foodordering.backend.exception.BadRequestException;
import com.sem6.foodordering.backend.exception.ResourceNotFoundException;
import com.sem6.foodordering.backend.model.MenuItem;
import com.sem6.foodordering.backend.model.Role;
import com.sem6.foodordering.backend.model.Shop;
import com.sem6.foodordering.backend.model.ShopStatus;
import com.sem6.foodordering.backend.repository.MenuItemRepository;
import com.sem6.foodordering.backend.repository.ShopRepository;
import com.sem6.foodordering.backend.security.AuthUser;
import java.util.List;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public List<ShopResponse> getAllShops() {
        return shopRepository.findAll().stream().map(this::toShopResponse).toList();
    }

    @Transactional(readOnly = true)
    public ShopResponse getShopById(Long shopId) {
        return toShopResponse(findShop(shopId));
    }

    @Transactional
    public ShopResponse updateShopStatus(Long shopId, ShopStatus status, AuthUser authUser) {
        if (authUser.getRole() == Role.VENDOR && !shopId.equals(authUser.getShopId())) {
            throw new AccessDeniedException("You can update only your own shop");
        }

        Shop shop = findShop(shopId);
        shop.setStatus(status);
        return toShopResponse(shopRepository.save(shop));
    }

    public Shop findShop(Long shopId) {
        return shopRepository.findById(shopId)
            .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));
    }

    @Transactional
    public MenuItemResponse addMenuItem(
        Long shopId,
        String itemName,
        BigDecimal price,
        String imageUrl,
        AuthUser authUser
    ) {
        if (authUser.getRole() == Role.VENDOR && !shopId.equals(authUser.getShopId())) {
            throw new AccessDeniedException("You can update only your own shop");
        }

        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }

        Shop shop = findShop(shopId);
        MenuItem menuItem = menuItemRepository.save(MenuItem.builder()
            .name(itemName.trim())
            .price(price)
            .imageUrl(normalizeImageUrl(imageUrl))
            .shop(shop)
            .build());

        return MenuItemResponse.builder()
            .id(menuItem.getId())
            .name(menuItem.getName())
            .price(menuItem.getPrice())
            .imageUrl(menuItem.getImageUrl())
            .build();
    }

    @Transactional
    public MenuItemResponse updateMenuItem(
        Long shopId,
        Long menuItemId,
        String itemName,
        BigDecimal price,
        String imageUrl,
        AuthUser authUser
    ) {
        if (authUser.getRole() == Role.VENDOR && !shopId.equals(authUser.getShopId())) {
            throw new AccessDeniedException("You can update only your own shop");
        }

        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }

        Shop shop = findShop(shopId);
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        if (!menuItem.getShop().getId().equals(shop.getId())) {
            throw new BadRequestException("Menu item does not belong to this shop");
        }

        menuItem.setName(itemName.trim());
        menuItem.setPrice(price);
        menuItem.setImageUrl(normalizeImageUrl(imageUrl));

        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return MenuItemResponse.builder()
            .id(updatedMenuItem.getId())
            .name(updatedMenuItem.getName())
            .price(updatedMenuItem.getPrice())
            .imageUrl(updatedMenuItem.getImageUrl())
            .build();
    }

    private String normalizeImageUrl(String imageUrl) {
        if (imageUrl == null) {
            return null;
        }

        String trimmedImageUrl = imageUrl.trim();
        return trimmedImageUrl.isEmpty() ? null : trimmedImageUrl;
    }

    private ShopResponse toShopResponse(Shop shop) {
        return ShopResponse.builder()
            .id(shop.getId())
            .name(shop.getName())
            .category(shop.getCategory())
            .cuisine(shop.getCuisine())
            .eta(shop.getEta())
            .accent(shop.getAccent())
            .status(shop.getStatus())
            .menuItems(shop.getMenuItems().stream()
                .map(menuItem -> MenuItemResponse.builder()
                    .id(menuItem.getId())
                    .name(menuItem.getName())
                    .price(menuItem.getPrice())
                    .imageUrl(menuItem.getImageUrl())
                    .build())
                .toList())
            .build();
    }
}
