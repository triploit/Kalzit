# string
## comment

Converts a single value to a string.
This function does not yet work as intended.

When used with single values (not lists), it works just fine:

String: 6. `Becomes "6", the string value`

But when used with a list, instead of turning the list into a single string, it tries to convert every included item to a string instead.
So, with the current version, this would work:

String: 1;2.

The result would be a list with two strings inside it, "1" and "2". That will also work with more-dimensional arrays.
