package com.sem6.foodordering.backend.security;

import com.sem6.foodordering.backend.exception.ResourceNotFoundException;
import com.sem6.foodordering.backend.model.UserAccount;
import com.sem6.foodordering.backend.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    @Override
    @Transactional(readOnly = true)
    public AuthUser loadUserByUsername(String username) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return AuthUser.builder()
            .id(user.getId())
            .email(user.getEmail())
            .password(user.getPassword())
            .role(user.getRole())
            .shopId(user.getShop() != null ? user.getShop().getId() : null)
            .build();
    }
}
