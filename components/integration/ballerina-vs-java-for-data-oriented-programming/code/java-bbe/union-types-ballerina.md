---
title: "Ballerina"
description: null
---
```
import ballerina/io;

type Circle record {|
   float radius;
|};

type Rectangle record {|
   float width;
   float height;
|};

type Shape Circle|Rectangle;

function calculateArea (Shape shape) returns float {
   if shape is Circle {
       return float:PI * shape.radius * shape.radius;
   }
   return shape.width * shape.height;
};

public function main() {
   io:println(calculateArea({radius: 10}));
}
```