---
title: 'Java'
description: null
---
```
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

record Person(int id, String name, Integer age, String email, List<String> availableFields) {
    public Optional<String> getEmail() {
        return Optional.ofNullable(email);
    }

    public Optional<Integer> getAge() {
        return Optional.ofNullable(age);
    }
}

class Main {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonInput = """
                {
                    "id": 1,
                    "name": "John Doe",
                    "age": null
                }
                """;
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addDeserializer(Person.class, new PersonDeserializer());
        objectMapper.registerModule(module);

        Person person = objectMapper.readValue(jsonInput, Person.class);

        System.out.println(person.age()); // output: null

        // optional type access
        int age = person.getAge().orElse(-1);
        System.out.println(age); // output: -1

        // optional field access
        System.out.println(person.availableFields().contains("email")); // output: false
        String emailValue = person.getEmail().isPresent()
                ? person.email()
                : "Email is not provided";
        System.out.println(emailValue); // output: Email is not provided
    }
}

class PersonDeserializer extends StdDeserializer<Person> {
    public PersonDeserializer() {
        this(null);
    }

    public PersonDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Person deserialize(JsonParser jsonParser,
            DeserializationContext deserializationContext) throws IOException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);

        List<String> availableFields = Arrays.asList("name", "age", "id");
        int id = node.get("id").asInt();
        String name = node.get("name").asText();
        Integer age = node.get("age").asInt();
        String email = null;

        if (node.has("email")) {
            email = node.get("email").asText();
            availableFields.add("email");
        }

        return new Person(id, name, age, email, availableFields);
    }
}
```