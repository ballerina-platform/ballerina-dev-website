---
title: "Java"
description: null
---
```
sealed interface Shape permits Circle, Rectangle {}

record Circle(double radius) implements Shape {}

record Rectangle(double width, double height) implements Shape {}

class Main {
    public static double calculateArea(Shape shape) {
        switch (shape) {
            case Circle circle:
                return Math.PI * circle.radius() * circle.radius();
            case Rectangle rectangle:
                return rectangle.width() * rectangle.height();
        }
    }

    public static void main(String[] args) {
        System.out.println(calculateArea(new Circle(10)));
    }
}
```