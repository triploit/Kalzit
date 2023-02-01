Note: If you are reading this, you should probably not use this project in its current state. You can, but a lot of things will change in the future, so it is not a very reliable foundation yet.

# Kalzit - owning your data made easy

This project started with the idea of privacy, which is a thing that many people seem to have given up - or rather payed as a price for online services.
Sadly, there are not many other options. The choice seems to be "you upload your life into the cloud and get convenience" or "you set up your own thing, which takes literally years, but you own your data".

I wanted to own my data, but I did not want to take years to get there.
So I wanted to have my own, private and very user-friendly cloud, just for me. And that is what Kalzit is about: it is an easy way to set up a little web server for your home. And just for that. All devices in your home can see it, and others can not. 

Of course a server is not usually very user-friendly, so there was a need for really good and easy to make applications. That is the second big part of what Kalzit is:
It is a programming language, complete with a standard library that makes tasks like "do a web search", "store data on the device" or "support multiple users with their own accounts and synchronize their data between devices" very easy.
This language is focused on being easy to learn, creating graphical user interfaces and working with media. And it avoids some annoyances of other languages. In other words, it is made to be really good for creating rich web applications, which can then run on your home server!
If one of these things sounds interesting to you, Kalzit is probably right for you.

The current version of this project is `0.16.0`. If you are interested in the latest changes to it, [take a look at the changelog](/docs/changelog/0.16.0.md)

# Setup

You can easily set up Kalzit on a device running Linux or macOS.
Just open a terminal window, navigate to the folder you want to install Kalzit in, and run this code:

```
curl https://raw.githubusercontent.com/triploit/Kalzit/master/utilities/installer/main.sh | sh
```

After the installation is complete, you should se a few more things in your folder. One of them is called "KalzitStarter". Just run that to start your own Kalzit server!

Kalzit should be running now! Just [access your Kalzit server through the browser](http://localhost:5000/).

# Project scope and use cases
* The Kalzit server is intended to be used on home-servers, which are used by only a few people. It is not intended or suitable as a "public" web server with potentially billions of users.
* The Kalzit programming language is optimized for speed of development first, speed of execution second. It is not intended for applications where speed is critical (like games), but rather for "normal" apps or prototyping.
* Kalzit is intended as a combination of server and web applications, so the applications will sometimes rely on the server. It is not intended for the creation of stand-alone apps.
* The client targets are recent web browsers, especially Firefox, Safari and Chrome / Chromium (importance descending). The main criteria for browser importance, in this case, are claimed and executed care for privacy (otherwise, people would not use Kalzit anyway), popularity, and low cost.
* The server / development environment targets are recent versions of Linux and macOS. The server is supposed to be able to run on these in general, and on the Raspberry PI specifically (a rather common and low-cost device running Linux, so people are likely to put Kalzit on that - if they put it on anything).
* Kalzit targets rather cheap, low-end servers (the user is not expected to pay a lot of money for an extra device) and mid-range clients (devices people own already: Smartphones, Tablets, Laptops, Desktops - all are equally important). TVs and watches are not targeted. These targets mean that the client device probably has more computing power than the server.
* The target audience are users who are at least a little bit privacy conscious but not necessarily technically savy. The amount of technical knowledge *required* to get started with Kalzit is intended to decrease rather than increase, while not ever limiting the tinkering abilities of those interested in that.
* Both security and convenience are valued, and ideally they should be both implemented. The only exception is if some feature becomes practically unusable because of privacy measures (like having to wait a long time while something is being decrypted, having to enter a password very often, ...). In these cases, convenience is more important - nobody cares if something is private when they can not use it.

# For developers

To get to the built-in language playground, open this URL in your browser: [http://localhost:5000/app/ide](http://localhost:5000/app/ide)

You should now see a text input field with an orange button beside it, and a bunch of other buttons below.
If you do, the setup worked and you can [write your first few lines of code in Kalzit](http://localhost:5000/docs/tutorial/babysteps.md).
Otherwise, please open an issue to let me know.

Have fun!
