---
title: 'Java'
description: null
---
```
import java.util.Map;

class Main {
    static final String switchStatus = "ON";

    public static String matchValue(Object value, boolean isObstructed,
            float powerPercentage) {
        switch (value) {
            case Integer i -> {
                if (i == 1 && !isObstructed) {
                    return "Move forward";
                }
                if (i == 2 || i == 3) {
                    return "Turn";
                }
                if (i == 4 && powerPercentage > 25.0) {
                    return "Increase speed";
                }
                return "Invalid instruction";
            }
            case String str -> {
                if (str.equals("STOP")) {
                    return "STOP";
                }
                if (str.equals(switchStatus)) {
                    return "Switch ON";
                }
                return "Invalid instruction";
            }
            case double[] arr -> {
                if (arr.length == 2) {
                    return "Maneuvering to x: " + arr[0]
                            + " and y: " + arr[1] + " coordinates";
                } else {
                    return "Invalid instruction";
                }
            }
            case Record record -> {
                double a = record.x;
                double b = record.y;
                Map<String, Object> rest = record.rest;
                String optionalArg = matchValue(rest, isObstructed, powerPercentage);
                return "Maneuvering to x: " + a + " and y: " + b +
                        " coordinates with " + optionalArg;
            }
            default -> {
                return "Invalid instruction";
            }
        }
    }

    record Record(double x, double y, Map<String, Object> rest) {}

    public static void main(String[] args) {
        String output = matchValue(new double[] { 2.516, 51.409 }, false, 0.0f);
        System.out.println(output);
    }
}
```