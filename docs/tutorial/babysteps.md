#  Kalzit baby steps

While setting up the Kalzit development environment, you have hopefully discovered the language playground (or "Browser IDE"). You can write lines of code in the text field, hit enter (or the orange "=" button) and see the result.

## Basic Math

You can try these line-by-line. Please do not paste the entire code into the text field, as that would not show all results.


`1 + 2.`

`3 * 4.`

`2 - 7.`

`6 % 3.`


The results you see should be `3`, `12`, `-5` and `2`. You have just learned the basic math operations!

Kalzit uses right-to-left evaluation. If you write `2 * 1 + 3` the result is not `5` but `8`. This is because `1 + 3` is evaluated first (with `4` as the result), and then `2 * 4` is `8`.


## Calling functions

Quick definition: functions do something with the values (parameters) you give them, and they give you the result.

To make the outcome of calculations a little less predictable, we could use random numbers. You can get a random number like this:


`do:random`


Please note that `:` is just an operator, just like the four math operators above. What it does is calling the function on its left side (`do`) with the parameter on its right (`random`).
Now, `do` itself calls the function it gets as a parameter. Because of this we get our random number!

We could try to add the random number to our calculations (again, please try line-by-line):


`4 * do : random.`

`do : random + 1.`


### Errors in early versions

The second line should have resulted in a rather long error message. These are not exactly intelligible yet, but here is the reason for it:

As you know, we use right-to-left evaluation. So, Kalzit tries to run `random + 1`. `random`, however, is a function and not a number, and `+` can only deal with numbers. This is why it throws an error.

Errors like these, however, are something that should not happen. This version has some of them, but over time all error sources should be removed. I just wanted you to be less scared of them.

To clear the language playground, consider refreshing the webpage.


## Creating variables and functions

Quick definition: variables are names associated with values. You write the name and get the value.

You can create a variable like this:
```
$myVar = 4.
```

Note the dollar sign at the beginning of the name. This is very important. If you do not write it, Kalzit will try to look up the variable you want to create.

Now you have a variable called `myVar` that holds the value `4`.  You can use this name now!
```
3 * myVar.
```

The result should be `12`.
By the way, `=` is just an operator as well.


If you want to, you can also create your own functions. Here is a very simple way to do this:
```
{x * 4}
```

This is a function that takes a parameter and multiplies it with `4`.  You could use it like this:
```
{x * 4} : 3
```

Again, the result should be 12.

As you saw, the first parameter of this function is accessible as `x`. But, it is only accessible inside the function. If you create any other variable inside a function, it will also not be accessible from the outside.


To finish this little introduction, we can store our created function in a variable and use it multiple times.
```
$quadruple = {x * 4}.
quadruple: 2.
quadruple: 4.
```

## Next?

If you are a developer, you could read the [introduction for developers](http://localhost:5000/docs/introForDevs.html). You are going to be familiar with many concepts explained there, but that might help to really get the core concepts. Also, you will end up with a fancy little graphical app!

As someone who is just mildly interested in this project, you could try the built-in [notes app](http://localhost:5000/app/notes). It should be pretty self-explanatory.
There is also a basic [Instagram viewer](http://localhost:5000/app/igDemo). You can type in an instagram user name to the text field (without the @), click "Add" and you will see the images. This also works with things like `r/all` for Reddit! Both apps were written in Kalzit, and I find them fairly useful. The source code can be found [here](https://www.github.com/triploit/Kalzit/blob/master/notes.txt) (notes) and [here](https://www.github.com/triploit/Kalzit/blob/master/igDemo.txt) (Instagram viewer).

If you are really interested in this project, you can join the [Triploit Discord server](https://discord.gg/CHN6pnb). You can chat with every member of this organization there. We can chat in english or in german, and are happy to hear your ideas. So, feel free to share any questions, ideas or other things regarding this project there.