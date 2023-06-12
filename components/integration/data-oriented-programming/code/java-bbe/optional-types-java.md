---
title: 'Java'
description: null
---
```
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

record Person(
        @JsonProperty("name") String name,
        @JsonProperty("email") String email,
        @JsonProperty("age") Optional<Integer> age,
        @JsonProperty("id") int id
) {

    @JsonCreator
    public static Person create(
            @JsonProperty("name") String name,
            @JsonProperty("email") String email,
            @JsonProperty("age") Optional<Integer> age,
            @JsonProperty("id") int id
    ) {
        return new Person(name, email, age, id);
    }
}

public class Main {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonInput = """
                {
                    "name": "John Doe",
                    "email": "abc@mail.com",
                    "age": null,
                    "id": 1
                }
                """;

        Person person = new ObjectMapper().readValue(jsonInput, Person.class);

        //optional age access
        int ageInFiveYears = person.age().orElse(-1) + 5;
        System.out.println(ageInFiveYears);

        boolean validEmail = person.email() != null
                ? person.email().matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
                : false;
        System.out.println(validEmail);
    }
}
```