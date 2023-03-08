---
title: 'HTTP? Ballerina is HTTP'
description: '“Ballerina is HTTP on steroids.” Network abstractions in Ballerina provide a natural way to describe and consume HTTP services, allowing developers to focus on a business logic instead of boilerplate code.'
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