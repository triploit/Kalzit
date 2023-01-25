# Basic maths
I think the basics are most easily explained by examples.
You can try these line-by-line in the [language playground](/app/ide). Please do not paste the entire code into the text field as one thing, because that would not show all results.


`1 + 2.` (Addition)

`3 * 4.` (Multiplication)

`2 - 7.` (Subtraction)

`6 % 3.` (Division)


The results you see should be `3`, `12`, `-5` and `2`. You have just learned the basic math operations!

Kalzit uses right-to-left evaluation. If you write `2 * 1 + 3` the result is not `5` but `8`. This is because `1 + 3` is evaluated first (with `4` as the result), and then `2 * 4` is `8`.
[Learn why this decision was made here](/docs/design/why/operatorPrecedence.md)