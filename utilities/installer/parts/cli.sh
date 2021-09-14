# Makes the CLI programs (./cli, ./kalzit) executable

chmod +x ./cli
chmod +x ./kalzit

# Make a system- and user-level installation
./cli publish test

echo We are trying to set up a system-wide Kalzit project folder. Please authenticate:
sudo ./cli publish system