package com.sem6.foodordering.backend.service;

import com.sem6.foodordering.backend.config.FileStorageProperties;
import com.sem6.foodordering.backend.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

    private final FileStorageProperties fileStorageProperties;

    @PostConstruct
    void initializeStorage() {
        createDirectories(getMenuImagesDirectory());
    }

    public String storeMenuImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please choose an image file to upload");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("Image size must be 5 MB or smaller");
        }

        String extension = extractExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Only JPG, PNG, WEBP, and GIF images are allowed");
        }

        String storedFileName = UUID.randomUUID() + "." + extension;
        Path targetFile = getMenuImagesDirectory().resolve(storedFileName);

        try {
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new BadRequestException("Failed to store image file");
        }

        String relativePath = "/uploads/menu-items/" + storedFileName;
        return ServletUriComponentsBuilder.fromCurrentContextPath()
            .path(relativePath)
            .toUriString();
    }

    private Path getMenuImagesDirectory() {
        return Paths.get(fileStorageProperties.uploadDir(), "menu-items")
            .toAbsolutePath()
            .normalize();
    }

    private void createDirectories(Path directory) {
        try {
            Files.createDirectories(directory);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to initialize upload storage", exception);
        }
    }

    private String extractExtension(String fileName) {
        String cleanedFileName = StringUtils.cleanPath(fileName == null ? "" : fileName);
        int extensionStart = cleanedFileName.lastIndexOf('.');
        if (extensionStart < 0 || extensionStart == cleanedFileName.length() - 1) {
            throw new BadRequestException("Image file must have a valid extension");
        }

        return cleanedFileName.substring(extensionStart + 1).toLowerCase();
    }
}
