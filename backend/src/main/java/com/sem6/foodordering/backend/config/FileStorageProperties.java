package com.sem6.foodordering.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.storage")
public record FileStorageProperties(String uploadDir) {
}
