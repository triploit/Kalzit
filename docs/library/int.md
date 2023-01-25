# int
## comment

Converts a number (or a string that represents a number) and returns the integer number it represents.
If the represented value is floating-point, the decimal part is cut off. So something like 5.6 becomes 5.

Usage example:
```
$a = int: "2.3".		`Produces 2`
$b = int: "10e3"		`Produces 10000`
```