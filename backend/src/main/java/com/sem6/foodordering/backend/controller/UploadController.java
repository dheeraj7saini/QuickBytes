package com.sem6.foodordering.backend.controller;

import com.sem6.foodordering.backend.service.FileStorageService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/vendor/uploads")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(path = "/menu-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadMenuImage(@RequestParam("file") MultipartFile file) {
        return Map.of("imageUrl", fileStorageService.storeMenuImage(file));
    }
}
