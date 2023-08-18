---
title: 'Model choices as discriminate unions'
description: In data-oriented programming, modeling choices is essential for achieving code-data separation. This approach results in modular, maintainable, and extensible code that can handle different data variants in a unified and type-safe manner. Ballerina offers built-in mechanisms to model choices as discriminate unions, using a concise and seamlessly integrated syntax.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/model-choices/ballerina/main.bal
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