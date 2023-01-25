#  What is array programming?

When done correctly, array programming means that you can perform an operation on multiple elements the same way you can with a single one.

For example, you probably know what this code does:

```
Print: 2 * 5.
```

Just to be clear, this multiplies `2` and `5`, and prints the result (`10`).
This has nothing to do with array programming yet, but the next example has.

So now we want to multiply many numbers by `2`. Say all from 1 to 100.
Remember that we can do an operation on multiple elements the same way we can on a single one.
This means we just need to replace the number `5` (what we want to multiply by `2`) with the numbers from 1 to 100:

```
Print: 2 * 1 to 100
```

And that is it! Now, we are multiplying each number from `1 to 100` by `2`, and `print` the result again - now, the result is a list of all even numbers from 2 to 200.

# Why is array programming useful?

* It allows for very short code - no need for loops, counters, temporary lists or other things.
* It requires very little maintainance - you do not need to rewrite many things just to support arrays. In other languages, you would need two implementations of the same process.

# How can you make use of array programming in this language?

Please take a look at [this more detailed tutorial](/docs/tutorial/useArrayProgramming.md).
