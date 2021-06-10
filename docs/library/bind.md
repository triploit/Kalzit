# bind
## argumentList
f
_arg
## comment

Turns a two-argument function into a one-argument one.
This is done by specifying the first argument.

So, if you want to bind the parameter of "*" to 2, you could do this:
$duplicate = * bind 2.
duplicate: 5. `Returns 10`.

`Code which produces the same result:`
2 * 5.
