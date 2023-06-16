---
title: "Spring Boot"
---

```
public class User {
    private int id;

    @Size(min = 2, message = "Name should have at least two characters")
    private String name;
    
    private LocalDate birthDate;

    // ...
}

@RestController
@RequestMapping("/social-media")
public class SocialMediaController {

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        // ...
        
    }
}

```
