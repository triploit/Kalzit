Kalzit - A platform for creating user- and privacy-focused web applications in an easy way.

#  Introduction

You might wonder what this project is about. It is meant to be two things:

Firstly, it is a programming language, complete with a standard library that makes tasks like "do a web search", "store data on the device" or "support multiple users with their own accounts and synchronize their data between devices" very easy.
This language is focused on being easy to learn, creating graphical user interfaces and working with media. And it avoids some annoyances of other languages.

But Kalzit is something else as well: privacy-focused. Privacy is a thing that many people seem to have given up - or rather payed as a price for online services.
Sadly, there are not many other options. The choice seems to be "you upload your live into the cloud and get convenience" or "you set up your own thing, which takes literally years, but you own your data".

I wanted to own my data, but I did not want to take years to get there.
So this is the second big part of Kalzit: It is an easy way to set up a little web server for your home. And just for that. All devices in your home can see it, and others can not. There are currently not many web applications that run on it, but the idea is still the same. Of course, you could try to create some apps yourself - with Kalzit, is it not as hard as you think.

If you are interested in the latest changes to the project, [take a look at the changelog](/docs/changelog/0.6.0.md). You can also see the plans for the next big release [here](/docs/future.md).

# Setup

You can easily set up Kalzit on a device running Linux or macOS.
Just navigate to the "releases" tab on GitHub and look at the latest release.
Here you can download an installer - you just have to choose between Linux and macOS, but that should not bee too hard.

Download the installer and put the installer application into a folder - this is where Kalzit will be installed to. Then you can simply run it.

On macOS, just double-click on the installer app.
Tip for Linux users: The easiest way to run the installer is to make it executable and then drag it into an open Terminal window. Of course, you can write down the entire file path yourself as well. After that, just press enter - the setup will be done for you.

---

If you do not want to download an installer, just open a terminal window, navigate to the folder you want to install Kalzit in, and run this code:

`curl https://raw.githubusercontent.com/triploit/Kalzit/master/utilities/installer/main.sh | sh`

---

After the installation is complete, you should se a few more things in your folder. One of them is called "KalzitStarter". Just run that to start your own Kalzit server! The steps are the same as with the installer.

Kalzit should be running now! Just [access your Kalzit server through the browser](http://localhost:5000/).

# Your baby steps with Kalzit

To get to the built-in language playground, open this URL in your browser: [http://localhost:5000/app/ide](http://localhost:5000/app/ide)

You should now see a text input field with an orange button beside it, and a bunch of other buttons below.
If you do, the setup worked and you can [write your first few lines of code in Kalzit](http://localhost:5000/docs/tutorial/babysteps.md).
Otherwise, please open an issue to let me know.

Have fun!
