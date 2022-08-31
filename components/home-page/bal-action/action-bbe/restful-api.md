```
import ballerina/http;

configurable int port = 8080;

type Album readonly & record {|
    string id;
    string title;
    string artist;
    decimal price;
|};

table<Album> key(id) albums = table [
        {id: "1", title: "Blue Train", artist: "John Coltrane", price: 56.99},
        {id: "2", title: "Jeru", artist: "Gerry Mulligan", price: 17.99},
        {id: "3", title: "Sarah Vaughan and Clifford Brown", artist: "Sarah Vaughan", price: 39.99}
    ];

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