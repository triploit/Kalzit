# final
## argumentList
_type
## comment

A type function that describes an unchanging value.

For example, if you want to have an unchanging variable of type int, you can do this:
$var ? (Final:Int) = 5.

If you attempt to change that variable from now on, the actual value will not change - the type function will remember the first value and always return it.
It also works with any other type function.