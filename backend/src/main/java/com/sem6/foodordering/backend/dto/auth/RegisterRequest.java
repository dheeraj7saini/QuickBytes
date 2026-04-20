package com.sem6.foodordering.backend.dto.auth;

import com.sem6.foodordering.backend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotNull
    private Role role;

    private String shopName;

    private String shopCategory;

    private String shopCuisine;
}
