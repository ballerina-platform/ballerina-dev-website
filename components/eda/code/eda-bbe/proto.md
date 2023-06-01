```
message Rectangle {
  Point lo = 1;
  Point hi = 2;
}

message Feature {
  string name = 1;
  Point location = 2;
}

message Point {
  int32 latitude = 1;
  int32 longitude = 2;
}

service RouteGuide {
  rpc ListFeatures(Rectangle) returns (stream Feature) {}
}
```