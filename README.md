#  Introduction

Kalzit is a project that aims to make coding less annoying, specifically for the web. Other platforms might follow.
It contains a programming language that is designed to be a companion to other popular languages, like JavaScript.
However, it is still possible to create stand-alone apps with it.

Other than that, you can find a standard API which makes it relatively easy to work with media, the internet and to create graphical user interfaces. There are also a few demo apps you might be interested in, as well as a web server to host them.

To use Kalzit in its current form, you need a UNIX (usually Linux or macOS) machine with [NodeJS](https://nodejs.org) installed.

A little warning before you start: Kalzit is probably not stable yet. But that should improve over time. Feel free to share any issues.

# Setup (TL;DR at the bottom)

If you want to give Kalzit a try, open a terminal, navigate to a folder and clone this repository:

```
git clone https://www.github.com/triploit/Kalzit
```

Navigate into the created `Kalzit` folder. Now, you just need to install some NodeJS packages (these are not included by default to make the project smaller and the packages up-to-date on your device).
You might not need all of them right now, but it will save you some time later. Here is the script:
```
bash ./install.sh
```

Now that all of the libraries are ready, you can go ahead and start the development server. Navigate to the `nodejs/files` folder and run this:
```
bash ./run.sh
```

The server should be running now!


## TL;DR

Run this from the terminal:
```
git clone https://www.github.com/triploit/Kalzit
cd ./Kalzit
bash ./install.sh
cd ./nodejs/files
bash ./run.sh

```

# Your baby steps with Kalzit

To get to the built-in language playground, open this URL in your browser: [http://localhost:5000/app/ide](http://localhost:5000/app/ide)

You should now see a text input field with an orange button beside it, and a bunch of other buttons below.
If you do, the setup worked and you can [write your first few lines of code in Kalzit](http://localhost:5000/docs/tutorial/babysteps.html).
Otherwise, please open an issue to let me know.

Have fun!
