---
title: 'Java'
description: null
---
```
public class PatternMatching {
        public static String matchValue(Object val, boolean isObstructed, float powerPercentage) {
            switch (val.toString()) {
                case "1":
                    if (!isObstructed) {
                        return "Move forward";
                    }
                    break;
                case "2":
                case "3":
                    return "Turn";
                case "4":
                    if (powerPercentage > 25.0) {
                        return "Increase speed";
                    }
                    break;
                case "STOP":
                    return "STOP";
                case "ON":
                    return "Switch ON";
                default:
                    return "Invalid instruction";
            }
            return "Invalid instruction";
        }

        public static void main(String[] args) {
            System.out.println(matchValue(1, false, 36.0f));
            System.out.println(matchValue(4, false, 36.0f));
        }
}
```