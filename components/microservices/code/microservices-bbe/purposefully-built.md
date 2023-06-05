---
title: 'Purposefully designed for microservices'
description: Ballerina is tailor-made to excel in the realm of distributed systems. Every aspect of Ballerina, from its syntax to its constructs and abstractions, is meticulously crafted to simplify the development, deployment, and management of microservices.
url: 'https://github.com/ballerina-guides/integration-samples/tree/main/restful_api/main.bal'
---
```
configurable int port = 8080;

type Album readonly & record {|
    string id;
    string title;
    string artist;
    decimal price;
|};

service / on new http:Listener(port) {
    resource function get albums() returns Album[] {
        return albums.toArray();
    }

    resource function get albums/[string id]() returns Album|http:NotFound {
        Album? album = albums[id];
        if album is () {
            return http:NOT_FOUND;
        } else {
            return album;
        }
    }

    resource function post albums(@http:Payload Album album) returns Album {
        albums.add(album);
        return album;
    }
}
```