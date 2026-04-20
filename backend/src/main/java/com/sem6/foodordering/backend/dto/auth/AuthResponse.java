package com.sem6.foodordering.backend.dto.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    UserResponse user;
}
