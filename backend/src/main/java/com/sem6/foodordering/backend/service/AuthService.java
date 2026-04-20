package com.sem6.foodordering.backend.service;

import com.sem6.foodordering.backend.dto.auth.AuthResponse;
import com.sem6.foodordering.backend.dto.auth.LoginRequest;
import com.sem6.foodordering.backend.dto.auth.RegisterRequest;
import com.sem6.foodordering.backend.dto.auth.UserResponse;
import com.sem6.foodordering.backend.dto.auth.VendorLoginOptionResponse;
import com.sem6.foodordering.backend.exception.BadRequestException;
import com.sem6.foodordering.backend.model.Role;
import com.sem6.foodordering.backend.model.Shop;
import com.sem6.foodordering.backend.model.ShopStatus;
import com.sem6.foodordering.backend.model.UserAccount;
import com.sem6.foodordering.backend.repository.ShopRepository;
import com.sem6.foodordering.backend.repository.UserAccountRepository;
import com.sem6.foodordering.backend.security.AuthUser;
import com.sem6.foodordering.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final ShopRepository shopRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userAccountRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Shop shop = null;
        if (request.getRole() == Role.VENDOR) {
            if (request.getShopName() == null || request.getShopName().isBlank()) {
                throw new BadRequestException("Shop name is required for vendor signup");
            }

            if (shopRepository.findByNameIgnoreCase(request.getShopName()).isPresent()) {
                throw new BadRequestException("Shop name is already taken");
            }

            shop = shopRepository.save(Shop.builder()
                .name(request.getShopName().trim())
                .category(resolveShopCategory(request))
                .cuisine(resolveShopCuisine(request))
                .eta("15-20 min")
                .accent(resolveAccent(request.getShopName()))
                .status(ShopStatus.ACTIVE)
                .build());
        }

        UserAccount user = userAccountRepository.save(UserAccount.builder()
            .name(request.getName().trim())
            .email(request.getEmail().trim().toLowerCase())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .shop(shop)
            .build());

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim().toLowerCase();
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(identifier)
            .or(() -> userAccountRepository.findByShop_NameIgnoreCase(identifier))
            .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(AuthUser authUser) {
        UserAccount user = userAccountRepository.findById(authUser.getId())
            .orElseThrow(() -> new BadRequestException("Authenticated user was not found"));
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<VendorLoginOptionResponse> getVendorLoginOptions() {
        return userAccountRepository.findByRole(Role.VENDOR).stream()
            .filter(user -> user.getShop() != null)
            .map(user -> VendorLoginOptionResponse.builder()
                .shopName(user.getShop().getName())
                .build())
            .toList();
    }

    private AuthResponse buildAuthResponse(UserAccount user) {
        AuthUser authUser = AuthUser.builder()
            .id(user.getId())
            .email(user.getEmail())
            .password(user.getPassword())
            .role(user.getRole())
            .shopId(user.getShop() != null ? user.getShop().getId() : null)
            .build();

        return AuthResponse.builder()
            .token(jwtService.generateToken(authUser))
            .user(toUserResponse(user))
            .build();
    }

    private UserResponse toUserResponse(UserAccount user) {
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole())
            .shopId(user.getShop() != null ? user.getShop().getId() : null)
            .shopName(user.getShop() != null ? user.getShop().getName() : null)
            .build();
    }

    private String resolveShopCategory(RegisterRequest request) {
        if (request.getShopCategory() == null || request.getShopCategory().isBlank()) {
            return "New Vendor";
        }
        return request.getShopCategory().trim();
    }

    private String resolveShopCuisine(RegisterRequest request) {
        if (request.getShopCuisine() == null || request.getShopCuisine().isBlank()) {
            return "Quick Bites";
        }
        return request.getShopCuisine().trim();
    }

    private String resolveAccent(String shopName) {
        String[] accents = {"sunset", "ocean", "leaf", "berry"};
        return accents[Math.abs(shopName.trim().toLowerCase().hashCode()) % accents.length];
    }
}
