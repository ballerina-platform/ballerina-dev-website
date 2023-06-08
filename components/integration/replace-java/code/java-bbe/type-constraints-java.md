---
title: 'Java'
description: null
---
```
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@SpringBootApplication
@RestController
public class Constraint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/userSignUp")
    public String handleRequest(@RequestBody User user) {
        return "User " + user.username + " signed up successfully";
    }

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Constraint.class);
        app.setDefaultProperties(Collections.singletonMap("server.port", "8080"));
        app.run(args);
    }

    record User(String username, String password) {
        User {
            // Validate the username and password
            if (!(username.length() > 1 && username.length() < 8 && password.matches("^[\\S]{4,}$"))) {
                throw new IllegalArgumentException("Username or Password is invalid");
            }
        }
    }
}
```