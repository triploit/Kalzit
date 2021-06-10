# curry
## argumentList
f
## comment

Turns a two-argument function into a one-argument one.
No argument is specified to do this.

To make it work, the produced function returns another function when called.
It is probably best to give a little example:

$greeterFunction = curry: ($greeting ; $name) fun {greeting + " " + name}.
$sayHello = greeterFunction: "Hello".
sayHello: "everyone". `Result: "Hello everyone"`
