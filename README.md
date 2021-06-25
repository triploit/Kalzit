# Kalzit - owning your data made easy

This project started with the idea of privacy, which is a thing that many people seem to have given up - or rather payed as a price for online services.
Sadly, there are not many other options. The choice seems to be "you upload your life into the cloud and get convenience" or "you set up your own thing, which takes literally years, but you own your data".

I wanted to own my data, but I did not want to take years to get there.
So I wanted to have my own, private and very user-friendly cloud, just for me. And that is what Kalzit is about: it is an easy way to set up a little web server for your home. And just for that. All devices in your home can see it, and others can not. 

Of course a server is not usually very user-friendly, so there was a need for really good and easy to make applications. That is the second big part of what Kalzit is:
It is a programming language, complete with a standard library that makes tasks like "do a web search", "store data on the device" or "support multiple users with their own accounts and synchronize their data between devices" very easy.
This language is focused on being easy to learn, creating graphical user interfaces and working with media. And it avoids some annoyances of other languages. In other words, it is made to be really good for creating rich web applications, which can then run on your home server!
If one of these things sounds interesting to you, Kalzit is probably right for you.

(The current version of this project is `0.11.0`. If you are interested in the latest changes to it, [take a look at the changelog](/docs/changelog/0.11.0.md))

# Setup

You can easily set up Kalzit on a device running Linux or macOS.
Just open a terminal window, navigate to the folder you want to install Kalzit in, and run this code:

```
curl https://raw.githubusercontent.com/triploit/Kalzit/master/utilities/installer/main.sh | sh
```

After the installation is complete, you should se a few more things in your folder. One of them is called "KalzitStarter". Just run that to start your own Kalzit server!

Kalzit should be running now! Just [access your Kalzit server through the browser](http://localhost:5000/).

# For developers

To get to the built-in language playground, open this URL in your browser: [http://localhost:5000/app/ide](http://localhost:5000/app/ide)

You should now see a text input field with an orange button beside it, and a bunch of other buttons below.
If you do, the setup worked and you can [write your first few lines of code in Kalzit](http://localhost:5000/docs/tutorial/babysteps.md).
Otherwise, please open an issue to let me know.

Have fun!
