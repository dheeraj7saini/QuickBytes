package com.sem6.foodordering.backend.dto.auth;

import com.sem6.foodordering.backend.model.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {
    Long id;
    String name;
    String email;
    Role role;
    Long shopId;
    String shopName;
}
