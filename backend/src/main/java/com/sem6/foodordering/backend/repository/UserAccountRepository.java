package com.sem6.foodordering.backend.repository;

import com.sem6.foodordering.backend.model.UserAccount;
import com.sem6.foodordering.backend.model.Role;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmailIgnoreCase(String email);

    Optional<UserAccount> findByShop_NameIgnoreCase(String shopName);

    boolean existsByEmailIgnoreCase(String email);

    List<UserAccount> findByRole(Role role);
}
