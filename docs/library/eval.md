# eval
## argumentList
code
## comment

Evaluates a piece of code in an isolated function environment.
This means that it can not change or access any variables that are not global.
Therefore, this function is a lot safer than "do" would be.
Of course, you should still be very careful when running unknown code, because that can be easily abused.

At the end, the value of the last sentence is returned (as usual).

The only exception is the variable "code", which contains the code itself.

Example for basic code execution:
eval: pieceOfCode.

Example of the code variable:
eval: {print: code. 1}.
`Result: prints the string "print: code. 1" and returns the value 1`
