Kalzit - A platform for creating user- and privacy-focused web applications in an easy way.

#  Introduction

Kalzit has started with this idea: Coding is annoying. The problem is that it is also very useful, and in a world where most people use a computer, the results of coding are a big part of peoples lives - it is not going to go away very soon.
But coding is still annoying. So the idea of Kalzit was to create a way to make it less annoying.

So that is the first part of what Kalzit is: A programming language, complete with a standard library that makes tasks like "do a web search", "store data on the device" or "support multiple users with their own accounts and synchronize their data between devices" very easy.
This language is focused on being easy to learn, creating graphical user interfaces and working with media. And it avoids some annoyances of other languages.

But Kalzit is something else as well: privacy-focused. Privacy is a thing that many people seem to have given up - or rather payed as a price for online services.
Sadly, there are not many other options. The choice seems to be "you upload your live into the cloud and get convenience" or "you set up your own thing, which takes literally years, but you own your data".

I wanted to own my data, but I did not want to take years to get there.
So this is the second big part of Kalzit: It is an easy way to set up a little web server for your home. And just for that. All devices in your home can see it, and others can not.
The problem is that there are currently not many web applications that run on it. I am developing a few of them, but none are ready for release yet. But the idea is still the same. However, you could try to create some yourself - with Kalzit, is it not as hard as you think.


So that is Kalzit today. If you are interested in plans for the future, [here you go](docs/future.md)

# Setup

You can easily set up Kalzit on a device running Linux or macOS.
Just navigate to the "releases" tab on GitHub and look at the latest release.
Here you can download an installer - you just have to choose between Linux and macOS, but that should not bee too hard.

Download the installer and put the installer application into a folder - this is where Kalzit will be installed to. Then you can simply run it.

On macOS, just double-click on the installer app.
Tip for Linux users: The easiest way to run the installer is to make it executable and then drag it into an open Terminal window. Of course, you can write down the entire file path yourself as well. After that, just press enter - the setup will be done for you.


After that, you should se a few more things in your folder. One of them is called "KalzitStarter". Just run that to start your own Kalzit server! The steps are the same as with the installer.

Kalzit should be running now!

## (TL;DR - for developers)

You need to have NodeJS installed. Then, run this from the terminal:
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
