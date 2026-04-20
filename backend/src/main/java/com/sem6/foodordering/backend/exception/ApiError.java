package com.sem6.foodordering.backend.exception;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ApiError {
    Instant timestamp;
    int status;
    String error;
    String message;
}
