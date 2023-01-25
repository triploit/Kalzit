# deprecated
## comment

Declares a value as something that should not be used anymore.
It also marks it for a possible removal in the future.
The annotation data does also include a text about why the value was deprecated.

Usage example:
```
@(deprecated: "This is the reason why") $myVar = "Something old".
```

If you want to replace one value with another one, consider using "useInstead".