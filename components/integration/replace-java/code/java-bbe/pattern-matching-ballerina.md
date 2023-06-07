---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

const switchStatus = "ON";

function matchValue(any val, boolean isObstructed, float powerPercentage) returns string {
    // The value of the `val` variable is matched against the given value match patterns.
    match val {
        // The `if !isObstructed` match guard is used.
        1 if !isObstructed => {
            // This block will execute if `!isObstructed` is true.
            return "Move forward";
        }
        // Use `|` to match more than one value.
        2|3 => {
            return "Turn";
        }
        //The `if 25.0 < powerPercentage` match guard is used.
        4 if 25.0 < powerPercentage => {
            // This block will execute if `25.0 < powerPercentage` is true.
            return  "Increase speed";
        }
        "STOP" => {
            return "STOP";
        }
        switchStatus => {
            return "Switch ON";
        }
        // Use `_` to match type `any`.
        _ => {
            return "Invalid instruction";
        }
    }
}

public function main() {
    io:println(matchValue(1, false, 36.0));
    io:println(matchValue(4, false, 36.0));
}
```