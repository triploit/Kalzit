# What is this project about?

This project contains the specification and implementation of a new programming language.
Some of the purposes of this language are listed below:

* Be a version of APL you can actually read and write using your keyboard ([why?](/docs/design/why/apl.html))
* Make things that are annoying in many other languages easy. Be a great companion to them ([why?](/docs/design/why/companion.html))
* Run basically everywhere
* Try to enforce the production of good applications

# How does this project benefit you? (With examples)

If you are a programmer, you probably do not really want to write tons of code. But you probably also still do so. This new language is asking: why?

## Comparison: A hello world program

A hello world program is probably the simplest and most boring program you can imagine, so we are writing a "bye world" program instead. At least that sounds more dramatic.
Here it is, written in Java:

```
public class Main {
	public static void main(String[] args){
		System.out.println("Bye world");
	}
}
```

While you might be used to stuff like this, please try to think about people learning to code from scratch. How could they possibly make sense of everything here?
Many simply can not. I remember the tutorial I used to learn Java telling me something like "I will not explain all that yet, it will take too much time. Just copy down the code and move on for now".
This shows that even this simple program is relatively complicated for what it does. It should not take this much to just display text.

Now, please take a look at our program in this new language:

```
Print: "Bye World".
```
(You can run the examples in the [Browser IDE](/app/ide). Just remove the leading `Print: `, otherwise you get the same output twice).

This is super easy to explain, if it is not self-explanatory already. `"Bye World"` is what we want to show, and `Print` is the function (or routine, way, thing, whatever) which we use to show it.
The colon `:` is used to say "Call the function on the left with what is on the right". So in this case it means "Use the function Print with 'Bye World' ".
Finally, the dot `.` is used to end a piece of code. It says "I am the end of something, something else might follow after me". Pretty similar to regular english.


With this simple example, you can already see many benefits of this language:

* Basically no unneeded code
* Simple to teach - you already have an idea what all of the elements do
* More natural-looking than other languages, which makes code easier to understand

Here are more examples which show you some more interesting cases:

## Comparison: Sum of numbers from 1 to 36

Java (inside "main"):

```
int result = 0;
for(int i = 0; i <= 36; i++){
    result += i;
}
System.out.println(result);
```

Here, again, many things would have to be explained to a newbie. You would have to introduce the concept of data types already, along with variables, loops, and so on.


This language does it in a much easier way:

```
Print: sum of 1 to 36.
```

Again, the code is a lot shorter, and also a lot easier to explain!
You do already understand the `Print: ` part. But with more complex codes like this, new concepts need to be understood:

* Sentences (separated by dots) consist of operators and their parameters. Their format is `parameter operator parameter operator parameter` and so on.
* When running the program, we start with the first sentence. But then, we go for the last operator and evaluate it. You can view it like this: `a b c d e` becomes `a b (c d e)`, and `a b c d e f g` becomes `a b (c d (e f g))`. ([why?](/docs/design/why/operatorPrecedence.html))


Knowing this, you understand that the sentence above uses the operators `:`, `of` and `to`.

* `:` calls the function on its left, as you already know
* `of`, in this case, is used as an alternative to `:`. You can read more about it ([here](/docs/api/defaults/of)), but you might come across new concepts.
* `to` takes two numbers and produces a list of whole numbers, ranging from the one on the left (1) to the one on the right (36).

If you were wondering, you can indeed rewrite the above code using brackets, as suggested above, and without changing the outcome:

```
Print : (sum of (1 to 36))
```

As you know already, `1 to 36` produces a list of whole numbers from 1 to 36. After that, `sum` goes ahead and computes their sum. Finally, `Print` shows the result.


You see, it is indeed possible to explain this code completely, and in a rather short amount of time.
I honestly do not even know where to start explaining the Java version of this - to explain it completely, you would at least have to go through loops, variables, types and comparisons.


The benefit for new learners should be established right now. So here is a more exciting example:

## Example: Show columns of images which come from a web search

Let us jump right into the code, without bothering with a Java version:

```
Print: uiColumns: uiShowImageUrl: webImageSearch: "Outer Space".
```

Yes, that is actually it!

Let us walk through this:

* `webImageSearch: "Outer Space"` performs a web image search (surprising, right?) for "Outer Space". It returns the URLs of the search results.
* `uiShowImageUrl` is responsible for producing an image element which we can show to the user (hence the "ui" prefix). Actually, it can also create *multiple* images. (Side note: many functions work like this. ([why?](/docs/design/why/arrayProgramming.html)))
* `uiColumns` also creates a UI element, this time from the image elements on the right. It simply organizes these elements into columns.
* `Print` is something you know already, but it can not only be used for text or numbers - you can actually show graphical elements with it!

# How do you get started?

If you have not already, please read the section "How does this project benefit you?" - it gives you a nice little overview about some useful functions and general ideas.
In case you want to tinker with some of your own code, you probably want to try the little [Browser IDE](/app/ide).
It might also be helpful to take a look at the [API Documentation](/docs/api/home), or to explore the language itself in more detail using the [tutorial](/docs/tutorial/index.html).
For an example of things that are possible in this language, check out the [app suite](/home.html). The apps do not exactly look good, but they are still a good demonstration.

Anyway, I hope this project benefits you somehow. Have fun with it!
