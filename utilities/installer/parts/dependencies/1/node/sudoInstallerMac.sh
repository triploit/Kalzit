# We can install a .pkg file automatically with the "installer" command
# This is much better than having the user install NodeJS manually (less work)
# The only problem is that the package source needs to be updated by hand
# TODO: change that

# Download the current version of the NodeJS installer
curl https://nodejs.org/dist/v14.17.1/node-v14.17.1.pkg > ./generated/node.pkg
# Install the package globally
sudo installer -pkg ./generated/node.pkg -target /