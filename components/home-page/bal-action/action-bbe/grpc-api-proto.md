```
syntax = "proto3";

import "google/protobuf/wrappers.proto";
import "google/protobuf/empty.proto";

service Albums {
    rpc getAlbum(google.protobuf.StringValue)
            returns (Album);
    rpc addAlbum(Album) returns (Album);
    rpc listAlbums(google.protobuf.Empty)
            returns (stream Album);
}

message Album {
    string id = 1;
    string title = 2;
    string artist = 3;
    float price = 4;
};
```