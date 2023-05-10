# Comment syntax

## Introduction

In a programming language, comments are pieces of text that exist within the source code of a program, but which are not executed in any way. Their only purpose is to be read by people. Usually, they are used to explain why a piece of code exists (or what it does).

There are a bunch of different kinds of comments. For example, you can have documentary comments that are meant to be read by someone on the outside, or internal comments; you can also have one-line comments or those that span multiple lines.

## Comments in Kalzit

In the Kalzit programming language, there are many different ways to write comments, which all behave in slightly different ways.

To begin, 

Fristly, there are one-line comments; they start with a `#` sign (outside of a string or another comment) and end with the start of a new line:

```
print: "I am a piece of code!".
# And I am a comment.
print: "And I am a piece of code again!". # Second comment!

### Oh, and we can also do this :) ### Still a comment
```

Secondly, there are block comments; they start with `/*` and end with `*/`:

```
/* Hi! this is a function that multiplies numbers */
!fun ($numbers) {
    /*
     * This code creates the products of all the numbers.
     * Note that the star-slash combination can exist in
     * regular code, too.
     *
     * If we were to write * / without a space, we would end
     * This comment. But right now, we are still in the comment.
     * Let's change that!
     */

    */ numbers
}.
```

Block comments are also very useful as doc-comments. To make sure that everybody knows which comment documents what, you can start them with `@kalzit.for`:

```
/* @kalzit.for someFunction
 * This is  a fancy function that does nothing
 */
$someFunction = !fun () {
    void
}.
```

There are also inline-comments, which you can put basically anywhere to quickly explain something; They end with "`" (or accent symbol pointing into the other direction) and end with the same character:

```
`This is a comment` print: "This is not". `Comment again!`


!fun () {
    `This function returns` void
}
```

I guess I should also mention something that is not strictly a comment, because it does have an effect in the code, but it can be used to document things as well.

If you want to attach some piece of info to a value in a way that is accessible *at runtime*, you can use an annotation. Like this:

```
@("info";"This value is totally amazing!!")
$value = 5.


# To get the info:
print: $info propOf calcitAnnotations: value.
```



And that is it! As you can see, Kalzit has three ways to write comment (or five, if you count doc comments and annotations), which all serve slightly different needs. Just choose whichever kind you prefer in any given situation, that's why there are so many options!


