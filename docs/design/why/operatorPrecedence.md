#How do other languages handle operators?
Most programming languages take their rules for operators from maths.
That means, for example, that every addition (like 3 + 7) is evaluated before a multiplication (3 * 7).
So, a line like `2 * 2 + 2` would have the result `6`.

#Why is that a problem?
If you think about it, these rules are just made up. And there are so many of them in maths!
You have to do exponents before multiplications before additions, and this list can probably be continued for a long time.
For you as a programmer, that means that you have to know all these rules. Well, that is kind of hard and annoying.
In Kalzit, there is only a single rule for operators.

#Right to left
The rule is a simple one: Just evaluate the rightmost operator first. The only exception to that are brackets.
So, if you see a line like `3 * 3 + 3`, you know that `3 + 3` is evaluated first - so the result of the whole thing is `27`.
The simplicity of operators in Kalzit is especially handy because you can define your own operators. And you instantly know in which order they are evaluated!
No need to specify a precedence for your custom operator, and no need for any other programmer to learn it. It is just a lot less annoying that way.