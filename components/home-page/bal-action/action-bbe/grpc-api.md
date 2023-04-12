```
import ballerina/grpc;

configurable int port = 9090;

Album[] albums = [
    {id: "1", title: "Blue Train", artist: "John Coltrane", price: 56.99},
    {id: "2", title: "Jeru", artist: "Gerry Mulligan", price: 17.99},
    {id: "3", title: "Sarah Vaughan and Clifford Brown", artist: "Sarah Vaughan", price: 39.99}
];

@grpc:Descriptor {
    value: DESCRIPTOR_RECORD_STORE_DESC
}
service "Albums" on new grpc:Listener(port) {
    remote function getAlbum(string id) returns Album|error {
        Album[] filteredAlbums = albums.filter(album => album.id == id);
        if filteredAlbums.length() > 0 {
            return filteredAlbums.pop();
        }

        return error grpc:NotFoundError(string `Cannot find the album for ID ${id}`);
    }

    remote function addAlbum(Album album) returns Album|error {
        albums.push(album);
        return album;
    }

    remote function listAlbums() returns stream<Album, error?>|error {
        return albums.toStream();
    }
}
```