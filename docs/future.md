This document includes a little list of things that are planned for the next big release of Kalzit.

## Standard-library documentation

As you know, Kalzit is a programming language. But nobody cares about programming languages. People care about what they can do with them - and how.

Well, you can do many things with Kalzit - the problem is that it is rather hard to find out how. The only thing that helps here is a better documentation.

Better, in this case, means two things:

* More complete - more things provided by the standard library should be explained.
* More accessible - It must be easy to get to the documentation. At the moment, it is not.

## Usable applications

There need to be examples of what can be done using Kalzit. And they need to be good - otherwise, why should anyone want to learn Kalzit?

The plan is to include at least two user-centric applications with the next release:

* One that is easy to understand as a new programmer, but still nice to use as a casual user
* Another one that demonstrates some of the media-handling capabilities Kalzit has

## Better Markdown support

The Kalzit server supports some server-side languages already, but not markdown.
However, since markdown is one of the easiest to learn, it should be supported.

A nice side effect of this would be that the `/docs` folder (which contains a few more information about Kalzit) would not need to contain two variants of every documentation file.

At the moment, much the documentation uses links to HTML files. While that works well with Kalzit already installed, it is a very upleasant experience if you try to use GitHub to look at the documentation - you just get to see HTML code.

So, all GitHub users reading this - I hear you.

## Command-line tool

This is for the developers, but it will eventually be useful for normal users as well.
You know how easy it is to install an application in Linux, simply by running something like `apt install theapp`? Kalzit should have a similarly easy way to do common things.

So, here are some ideas for what a command-line tool should do:

* Create a new application
* Create a new code library
* Install an application from the internet
* Install a code library from the internet
* Start the kalzit server
* Open an application
* Update Kalzit itself

## Tridymite-support

Okay, this is a little unusual.
You might not know this, but Tridymite is a little package manager written by the "Triploit" group on GitHub. Tridymite and Kalzit are made by the same group of people!

So, why not use this connection? Yes, none of these project are immensely popular yet. But the more connections exist between them, the more one project will benefit from the popularity of the other.

Which leads to this plan. Kalzit should be...

* ... Installable using Tridymite
* ... Able to update using Tridymite

And, in the end, Kalzit applications written by other people should also be installable using Tridymite - without the author having to think about it.


## Your feedback is very welcome

If you like one of the planned points and want to see it very soon, or if you think another one is not important - please tell me.
Also, if you have any other idea regarding this project, or if you have found a bug, please open an issue on GitHub.

Anyway, thank you for being interested in Kalzit - have fun with it!
