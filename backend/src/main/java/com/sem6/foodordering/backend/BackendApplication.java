package com.sem6.foodordering.backend;

import com.sem6.foodordering.backend.config.CorsProperties;
import com.sem6.foodordering.backend.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableConfigurationProperties({FileStorageProperties.class, CorsProperties.class})
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
