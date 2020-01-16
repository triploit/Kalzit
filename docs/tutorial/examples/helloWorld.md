A "Hello World" program is very boring, I get it. But I will try to make it as interesting as possible.

## Code
```
Print: "Hello World".
```

The above code is the most complete "Hello World" program you can get in Kalzit. In some cases, however, it can get even shorter!

## Making the code shorter
First of all, this example includes the actual output of the text. When using the [language playground](/_browser_ide.html), you do not need that part. So this is what you get:

```
"Hello World".
```

When running that using the playground, you should still see the expected output.

### Print in the playground
The `Print: ` part, however, is sometimes still needed when using the playground. Here is a little example:

```
"Hello World". "Second output".
```

As someone who is just learning Kalzit, the above code might seem like it should show both "Hello World" and "Second output" in the playground. However, it will only show "Second output". Why is that?

You see, the code is made up of two parts, separated by a dot. These are called sentences in Kalzit. A sentence itself always has a value, in this case the value of the first one is the text "Hello World" and the second one is "Second output".
Now, multiple sentences put next to each other also have a value. That is just the value of the last included sentence, so the text "Second output" in this case. This means that the value of the entire above example is "Second output". As you already know, the playground takes code, evaluates it and shows the result. So this is what you get.

If you want to show the first text, you still need `Print: ` in front of it. In standalone apps that do not have the automatic output, just add it in front of anything you want to show.

### Last sentences
The last sentence of a program does not even have to be complete. This means you can leave out the last dot. So, the simplest possible "Hello World" program in Kalzit is literally this: `"Hello World"`