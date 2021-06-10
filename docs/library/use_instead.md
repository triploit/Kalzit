# use_instead
## argumentList
_instead
## comment

Declares a value as something that should not be used anymore.
It also marks it for a possible removal in the future.
The annotation data does also include standard values that you should use instead.

Usage example:
@(useInstead: "mySecondVar") $myVar = "Something old".

If you want to replace one value with another one, consider using "useInstead".
