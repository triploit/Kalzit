This document explains how a syntax tree is generated in this language.

# Tokens

The first thing that is done is creating a list of tokens. How this is done is quite simple: every character gets a category, and all sequences of characters with the same category become a token.

Please take a look at the following code:

```
"Hello World". 123.
```

The token creation produces this list of tokens for it:

* `"` - _0
* `Hello` - Word
* ` ` - Space
* `.` - _1
* ` ` - Space
* `123` - Digit
* `.` - _2

# Blocks

Tokens can be grouped into units which, for the most part, are handled like a single text element. These are called blocks.

One kind of block is created by enclosing text in round brackets `(like this)`.
The code is separated into tokens first, and then the parser starts at the end of the resulting list moving toward the start, looking for the ending element of a block.
For the block above, this would be the closing bracket `)`.

Every ending character has a corresponding starting character, which indicates a completed block.

Here is a list of all kinds of blocks in the language:

* `( parentheses - deep - active )`
* `{ string - deep - passive }`
* `[ array - deep - active ]`
* `' string - flat - active '`
* `" string - flat - active"`
* `´ comment - flat - active´` (also works using ``` on either side)

## Deep and flat blocks

You probably noticed the descriptions `deep` and `flat` in the block list above.
`flat` means that the block detection gets started with the end character and stops at the first occurence of the end character.
This means if `( the parentheses block )` was a `flat` block, something like this would not work as expected:

```
(Here is text (with more parentheses) )
```

The problem is that we would think that the entire thing is a unit, but the parser *would* only see `(with more parentheses) )` as a block and the rest as unconnected tokens.

This is why `deep` blocks are needed.
These keep track of their content and know how deep they are:

```
Not inside block (Depth 1 (Depth 2))
```

This means that a block is only recognized if it contains equally many starting and ending elements.

## Active and passive blocks

The difference between `active` and `passive` blocks lies in how they deal with their content.
Basically, an `active` block cares about what is inside it a little more than a `passive` one.
If there is any open block left inside an `active` block, it itself can not close.

This allows codes like this to be valid:

```
({(})
```

Here, the entire code is parsed as a single `parentheses` block. Not just `(})`, but the entire thing.

`passive` blocks do not care about the completion of blocks that are inside them.
The `string` block `{)}` is complete, even though it contains an incomplete `parentheses` block.

# Sentences

Programs consist of text. The text itself is separated into sentences, which end with a dot `.` .
The third thing that the language does is creating a list of sentences from the . Every sentence is then evaluated on its own, and synchronously. The topmost sentence gets evaluated first, the one after that second and the bottommost last.

The following program contains two sentences:

```
Print: "Hello". Print: "World"
```

You see a dot between these sentences. The last sentence does not necessarily need to end with a dot, but all others do.
