## comment

Checks if a string (second parameter) maches a regular expression (first parameter).
If it does, the first match is returned as an array of one element. In case the regular expression contains groups, their contents is added to the array.
In case nothing matches, void is returned.

Usage example:
```
$firstDigit = "\d" match "abc5".
$withGroups = "a+(b+)" match "aabb". `Result is "aabb";"bb"`
```