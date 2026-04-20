package com.sem6.foodordering.backend.controller;

import com.sem6.foodordering.backend.dto.auth.AuthResponse;
import com.sem6.foodordering.backend.dto.auth.LoginRequest;
import com.sem6.foodordering.backend.dto.auth.RegisterRequest;
import com.sem6.foodordering.backend.dto.auth.UserResponse;
import com.sem6.foodordering.backend.dto.auth.VendorLoginOptionResponse;
import com.sem6.foodordering.backend.security.AuthUser;
import com.sem6.foodordering.backend.service.AuthService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AuthUser authUser) {
        return authService.getCurrentUser(authUser);
    }

    @GetMapping("/vendor-options")
    public List<VendorLoginOptionResponse> vendorOptions() {
        return authService.getVendorLoginOptions();
    }
}
