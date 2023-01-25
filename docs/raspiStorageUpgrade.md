# How to upgrade storage on a Raspberry PI Kalzit server

## Requirements
You will need:
* The Raspberry PI you are using as a server, including its SD card.
* Another SD card of the same form factor (probably micro SD), with a higher storage capacity than the one currently in your PI
* A second computer running Linux or macOS, plus a way to plug your SD cards into it (one at a time is enough). The instructions are for macOS, but there should be very similar solutions on Linux - there are just so many different disk tools available.

## Overview
The plan is to take the data of your original SD card, store it into a file (which serves as a backup), and then put the data on your new, bigger SD card. That way, you have an SD card with a lot of free, unused space on it, which you can fill up later.
After that, your PI should be able to boot from your new SD card, and we can do things like enlarge the main partition so the free space is actually usable.

## What not to do
On macOS, do not use Disk Utility to "Create image" and then "Restore". For some reason, that does not work - it says something about not finding mountable partitions (tested on Mojave, 10.14.6).

## Clone the SD card to a file: Terminal, dd command
In order to save your original SD card to a file, please make sure that you have a drive with enough freely available storage on it.

Okay, so we need to go to the Terminal soon. But first:
* Take the SD card out of your Raspberry PI, ideally after shutting it down (`sudo shutdown now`).
* Plug your small SD card into your computer
* With your disk tool of choice (Disk Utility, in my case), figure out what the Unix device name is (something like `disk2`)

If you have that name, open your Terminal. We will use the somewhat dangerous `dd` command to copy the SD card, bit by bit, to a file. The command is used like this:

From https://linuxhandbook.com/dd-command/
`dd if=<filename> of=<filename>`
 
Here, `if` is the input file (or device, in our case, it is the SD card). `of` is the output file - where we want the disk image to be stored.

So, for `if=<filename>`, you use your SD card device name. Not just `if=<deviceName>`, but it has to start with `/dev` (this is where all the devices live in Unix). So, in my case, it is `if=/dev/disk2`. For `of`, just use a file path to where you want your disk image to be. Something like `of=~/Downloads/Raspi-Backup.img` maybe. **Be careful not to confuse these!**

To make it work, you have to run the `dd` command as root (with `sudo`) in front of it. In order to make that work, you need to be logged in as an an administrator.

Your final command will look something like this (**do not** just copy, but put it together yourself!):
`sudo dd if=/dev/disk2 of=~/Downloads/Raspi-Backup.img bs=1m`
The `bs=1m` thing will make the command run a bit faster, but I do not really know why. We will use it anyway. Here is a german forum post with more details: https://forum.ubuntuusers.de/topic/dd-mit-bs-32k-oder-mit-bs-1m/

Running this command can take a long time, so you might be tempted to go and do something else.
If so, please make sure that your system does not go to "sleep" mode - otherwise it might not continue to copy data. It might be a good idea to check if it still working every 15 Minutes or something.

Once the command is done, you have a file containing every bit on your SD card!

## Copy your image to your bigger SD card
Next, we basically do the same thing in reverse, using that same `dd` command. But now, we will use the created image file for `if` and the SD card for `of`. So:

* Unplug your original SD card
* Plug the bigger SD card in and figure out the Unix device name
* If the SD card was automatically mounted, use your favourite disk tool to eject the mounted *partition*, but *not the device* itself. That needs to be available to the system.

Then, construct your `dd` command, using the SD card device as output and the image as input. In some cases, it will look like this:
`sudo dd if=~/Downloads/Raspi-Backup.img of=/dev/disk2`
(It is very important that you put the command together yourself - do not just copy it!)

Again, running this command takes a while.
When it finishes, you have essentially cloned your old, small SD card onto a new and bigger one.

## Test it with your Raspberry PI
Now, you can eject your larger SD card (the device) from your computer and put it into your Raspberry PI. After that, just plug it back in, and it should be working just as it did before!
The Raspberry PI operating system, all your data and settings - literally everything on your original SD card - should be there.

## Make your main partition bigger
The thing is, you will not actually get more available space. Your main partition (`/dev/root`, mounted as `/`) will still be rather small.
To make the space available, you need to plug a screen into your Raspberry PI, log in and open a terminal *on the PI* - or you can connect to it with ssh if enabled (`ssh pi@raspberrypi`, or something similar).
In the Raspberry PI terminal, you run `sudo raspi-config` to get into the built-in configuration utility. In there, use the arrow keys to select "Advanced Options" and hit enter.
Then, you can select "Expand Filesystem", which, as it says, "ensures that all of the SD card is available". Hit enter if you selected that option.

This process is rather quick, and all you need to do after that should be to reboot the system. Hit "Escape" to get out of the configuration tool, then type the reboot command: `sudo reboot`

If you want to know if the operation was successful, open the PI Terminal again and type `df -h` to show disk usage in a **h**uman-readable form. If `/dev/root` is almost as big as your big SD card, it worked.
But, if it is not as big as you expected, you can try to reboot the PI again with the mentioned `sudo reboot` command. This can help to solve the issue.

## Just use the extended storage!
And you are done! You can just fill up your larger storage with all the stuff you want. Have fun!

# TL;DR
Terminal commands on non-PI Computer (fill in the gaps):
```
sudo dd if=<smallSdCardDevice> of=<imageFile> bs=1m
sudo dd if=<imageFile> of=<bigSdCardDevice> bs=1m
```
Terminal commands on the PI, after putting in the big SD card:
```
sudo raspi-config #Pick "Advanced options" -> "Expand Filesystem"
sudo reboot #Maybe two times
```