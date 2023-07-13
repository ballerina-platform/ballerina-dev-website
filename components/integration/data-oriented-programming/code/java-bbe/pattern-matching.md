---
title: 'Pattern matching'
description: Pattern matching is a powerful tool in data-oriented programming that allows developers to extract relevant data from complex patterns and perform specific operations based on the structure and content of the data. <br><br>Ballerina provides concise and expressive pattern matching techniques to handle intricate data structures efficiently.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/pattern-matching/ballerina/main.bal
---
```
import ballerina/io;

const switchStatus = "ON";

function matchValue(anydata value, boolean isObstructed,
                float powerPercentage) returns string {
    // The value of the `val` variable is matched against the given value match patterns.
    match value {
        1 if !isObstructed => {
            // This block will execute if `value` is 1 and `isObstructed` is false.
            return "Move forward";
        }
        // `|` is used to match more than one value.
        2|3 => {
            // This block will execute if `value` is either 2 or 3.
            return "Turn";
        }
        4 if 25.0 < powerPercentage => {
            // This block will execute if `value` is 4 and `25.0 < powerPercentage` is true.
            return "Increase speed";
        }
        "STOP" => {
            // This block will execute if `value` is "STOP".
            return "STOP";
        }
        switchStatus => {
            // This block will execute if `value` is equal 
            // to the value of the `switchStatus` constant.
            return "Switch ON";
        }
        // Destructuring a tuple with type checking
        [var x, var y] if x is decimal && y is decimal => {
            return string `Maneuvering to x: ${x.toString()} and y: ${y.toString()
                            } coordinates`;
        }
        // Destructuring a map and recursively matching with optional argument
        {x: var a, y: var b, ...var rest} => {
            string optionalArg = matchValue(rest, isObstructed, powerPercentage);
            return string `Maneuvering to x: ${a.toString()} and y: ${b.toString()
                            } coordinates with ${optionalArg}`;
        }
        _ => {
            // This block will execute for any other unmatched value.
            return "Invalid instruction";
        }
    }
}

public function main() {
    string output = matchValue([-2.516d, 51.409d], false, 0.0);
    io:println(output);
}
```