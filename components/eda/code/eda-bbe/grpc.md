---
title: 'RPC, why not gRPC?'
description: Ballerina simplifies gRPC event streaming by bridging the gap between the service definition and code generation. You can effortlessly leverage gRPC's power for seamless data streaming with Ballerina.
url: 'https://github.com/ballerina-platform/module-ballerina-grpc/tree/master/examples/route-guide'
---
```
public type Rectangle record {|
    Point lo = {};
    Point hi = {};
|};

public type Feature record {|
    string name = "";
    Point location = {};
|};

public type Point record {|
    int latitude = 0;
    int longitude = 0;
|};

@grpc:ServiceDescriptor {descriptor: ROOT_DESCRIPTOR, descMap: getDescriptorMap()}
service "RouteGuide" on new grpc:Listener(9000) {

    remote function ListFeatures(Rectangle rectangle) returns stream<Feature, grpc:Error?>|error {
        
        int left = int:min(rectangle.lo.longitude, rectangle.hi.longitude);
        int right = int:max(rectangle.lo.longitude, rectangle.hi.longitude);
        int top = int:max(rectangle.lo.latitude, rectangle.hi.latitude);
        int bottom = int:min(rectangle.lo.latitude, rectangle.hi.latitude);

        Feature[] selectedFeatures = from var feature in FEATURES
            where feature.name != ""
            where feature.location.longitude >= left
            where feature.location.longitude <= right
            where feature.location.latitude >= bottom
            where feature.location.latitude <= top
            select feature;

        return selectedFeatures.toStream();
    }
}
```