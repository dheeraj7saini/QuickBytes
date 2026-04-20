package com.sem6.foodordering.backend.controller;

import com.sem6.foodordering.backend.dto.shop.ShopResponse;
import com.sem6.foodordering.backend.service.ShopService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping
    public List<ShopResponse> getShops() {
        return shopService.getAllShops();
    }

    @GetMapping("/{shopId}")
    public ShopResponse getShop(@PathVariable Long shopId) {
        return shopService.getShopById(shopId);
    }
}
