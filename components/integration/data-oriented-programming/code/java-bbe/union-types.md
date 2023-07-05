---
title: 'Model choices as discriminate unions'
description: Modeling choices play a crucial role in achieving code-data separation in data-oriented programming, leading to modular, maintainable, and extensible code that can handle diverse data variants in a unified and type-safe manner. <br><br>Both Java and Ballerina provide mechanisms to model choices as discriminate unions. Java uses interfaces or abstract classes along with class hierarchies and method overrides to represent the variants and their behaviors. Ballerina, on the other hand, offers built-in support for discriminate unions with a concise and language-integrated syntax.
image:
url: https://github.com/ballerina-guides/integration-samples/tree/main/model-choices-for-dop
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