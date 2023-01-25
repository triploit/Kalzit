# sized_list
## comment

Converts a value to a list of the given size. When converting to a list, a type function is applied to every item.
The target list size is the first parameter, the type function for each item is the second one.

Example: (2 SizedList Int): "6";4,6;9.
This returns (6;4). The string "6" is converted to a number, and the decimal value "4,6" is converted to an integer. The third item is cut off, because the list would be to long otherwise.

If the list is too short, it will be extended:
(8 SizedList Any): 1;2;3.
This returns (1; 2; 3; 1; 2; 3; 1; 2).

So, if the list does not have enough elements, the elements are simply repeated until the target list size is reached.

The only exception is the empty list, or void. With that as the parameter, the empty list is returned.