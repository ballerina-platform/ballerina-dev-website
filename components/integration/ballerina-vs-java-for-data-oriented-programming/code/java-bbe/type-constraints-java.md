---
title: 'Java'
description: null
---
```
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.stream.Collectors;

record User(@Size(min = 1, max = 8) String username,
            @Pattern(regexp = "^[\\S]{4,}$") String password) {}

@SpringBootApplication
@RestController
class Main {

    @PostMapping("/user")
    public ResponseEntity<String> handleRequest(@Valid @RequestBody User user) {
        return ResponseEntity.ok("User " + user.username() + " signed up successfully");
    }

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(OptimalConstraint.class);
        app.setDefaultProperties(Collections.singletonMap("server.port", "9090"));
        app.run(args);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(this::getViolationMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body("Payload validation failed: " + errorMessage);
    }

    private String getViolationMessage(FieldError fieldError) {
        String fieldName = fieldError.getField();
        String constraintName = fieldError.getCode();
        return String.format("Validation failed for '%s:%s'", fieldName, constraintName);
    }
}
```