---
title: 'Java'
description: null
---
```
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

record Album(String title, String artist) {};

public class SmartEndpoints {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Album[]> response = restTemplate.exchange(
                "http://localhost:9090/albums",
                HttpMethod.GET,
                null,
                Album[].class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            Album[] albums = response.getBody();
            System.out.println("First artist name: " + albums[0].artist());
        } else {
            System.out.println("Error occurred while invoking the endpoint.");
        }
    }
}
```