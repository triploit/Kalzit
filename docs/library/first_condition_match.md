# first_condition_match
## comment

Takes a list of items and returns the first item which matches a set condition. This is done as quickly as possible.
If there is no match, void is returned.

Usage example:
```kalzit
`Returns 2, the first even number in the list`
{x mod 2} firstConditionMatch 1;2;3.
```

That has essentially the same effect as this, but is potentially much faster:
```kalzit
first: {x mod 2} filter 1;2;3.
```