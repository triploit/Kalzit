# list
## argumentList
_itemType
## comment

Converts a value to a list, where every item itself gets a specified type.
The item type is the first parameter of this function.

Usage example: $booleans = (List:Boolean): 1;2;3.
This example would return (1;1;1). Every number of the list is converted to a Boolean value.

If only a single value is given (which is not a list), the result is a list still, which contains the converted value:
(List:Boolean): 7 `returns [1]`
