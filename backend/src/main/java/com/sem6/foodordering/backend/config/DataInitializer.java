package com.sem6.foodordering.backend.config;

import com.sem6.foodordering.backend.model.MenuItem;
import com.sem6.foodordering.backend.model.Role;
import com.sem6.foodordering.backend.model.Shop;
import com.sem6.foodordering.backend.model.ShopStatus;
import com.sem6.foodordering.backend.model.UserAccount;
import com.sem6.foodordering.backend.repository.MenuItemRepository;
import com.sem6.foodordering.backend.repository.ShopRepository;
import com.sem6.foodordering.backend.repository.UserAccountRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ShopRepository shopRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Shop sharmaSnacks = createOrUpdateShop("Sharma Snacks", "Snacks", "North Indian", "10-15 min", "sunset");
        Shop campusCafe = createOrUpdateShop("Campus Cafe", "Cafe", "Cafe", "15-20 min", "ocean");
        Shop greenBowl = createOrUpdateShop("Green Bowl", "Healthy", "Healthy", "12-18 min", "leaf");
        Shop spiceRoute = createOrUpdateShop("Spice Route", "Meals", "Indian", "18-25 min", "sunset");
        Shop noodleNest = createOrUpdateShop("Noodle Nest", "Asian", "Chinese", "15-22 min", "berry");
        Shop tacoLane = createOrUpdateShop("Taco Lane", "Fast Food", "Mexican", "14-19 min", "sunset");
        Shop dosaCorner = createOrUpdateShop("Dosa Corner", "South Indian", "South Indian", "10-16 min", "ocean");
        Shop pizzaStudio = createOrUpdateShop("Pizza Studio", "Fast Food", "Italian", "20-28 min", "berry");
        Shop juiceJunction = createOrUpdateShop("Juice Junction", "Beverages", "Beverages", "8-12 min", "leaf");
        Shop rollRepublic = createOrUpdateShop("Roll Republic", "Street Food", "Rolls", "12-17 min", "sunset");
        Shop biryaniHub = createOrUpdateShop("Biryani Hub", "Meals", "Hyderabadi", "20-26 min", "berry");

        createMenuItemIfMissing(sharmaSnacks, "Aloo Tikki Burger", "80.00");
        createMenuItemIfMissing(sharmaSnacks, "Cheese Maggi", "70.00");
        createMenuItemIfMissing(campusCafe, "Cold Coffee", "90.00");
        createMenuItemIfMissing(campusCafe, "Grilled Sandwich", "75.00");
        createMenuItemIfMissing(greenBowl, "Paneer Wrap", "110.00");
        createMenuItemIfMissing(greenBowl, "Salad Bowl", "130.00");
        createMenuItemIfMissing(spiceRoute, "Mini Thali", "140.00");
        createMenuItemIfMissing(noodleNest, "Hakka Noodles", "120.00");
        createMenuItemIfMissing(tacoLane, "Veg Taco Duo", "130.00");
        createMenuItemIfMissing(dosaCorner, "Masala Dosa", "95.00");
        createMenuItemIfMissing(pizzaStudio, "Farmhouse Slice Box", "160.00");
        createMenuItemIfMissing(juiceJunction, "Orange Blast", "70.00");
        createMenuItemIfMissing(rollRepublic, "Paneer Kathi Roll", "95.00");
        createMenuItemIfMissing(biryaniHub, "Veg Dum Biryani", "155.00");

        createUserIfMissing("customer@example.com", "Customer User", "password123", Role.CUSTOMER, null);
        createUserIfMissing("vendor@example.com", "Vendor User", "password123", Role.VENDOR, sharmaSnacks);
        createUserIfMissing("campusvendor@example.com", "Campus Vendor", "password123", Role.VENDOR, campusCafe);
        createUserIfMissing("admin@example.com", "Admin User", "password123", Role.ADMIN, null);
    }

    private Shop createOrUpdateShop(String name, String category, String cuisine, String eta, String accent) {
        Shop shop = shopRepository.findByNameIgnoreCase(name)
            .orElseGet(() -> Shop.builder().name(name).build());

        shop.setCategory(category);
        shop.setCuisine(cuisine);
        shop.setEta(eta);
        shop.setAccent(accent);
        shop.setStatus(ShopStatus.ACTIVE);
        return shopRepository.save(shop);
    }

    private void createMenuItemIfMissing(Shop shop, String name, String price) {
        boolean exists = menuItemRepository.findByShopId(shop.getId()).stream()
            .anyMatch(item -> item.getName().equalsIgnoreCase(name));

        if (exists) {
            return;
        }

        menuItemRepository.save(MenuItem.builder()
            .name(name)
            .price(new BigDecimal(price))
            .shop(shop)
            .build());
    }

    private void createUserIfMissing(String email, String name, String password, Role role, Shop shop) {
        if (userAccountRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        userAccountRepository.save(UserAccount.builder()
            .name(name)
            .email(email)
            .password(passwordEncoder.encode(password))
            .role(role)
            .shop(shop)
            .build());
    }
}
