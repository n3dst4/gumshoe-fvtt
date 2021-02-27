# Upgrading from Trail of Cthulhu (Unsanctioned)

If you have an existing Foundry world using the precursor to this system, you CAN upgrade! It's not automatic because Foundry doesn't have a way to rename an existing system, but it's not too hard.

1. **BACK UP YOUR FOUNDRY DATA**. You should always back up your foundry data before making any changes anyway. If you're not sure what this means, you just need to make a copy of the folder where Foundry stores all it's information. If you're self-hosting Foundry, this folder may be called `foundrydata`. For other hosting options, check their documentation.

2. **NOW, INSTALL THE GUMSHOE SYSTEM IF IT ISN'T ALREADY.** 
[Instructions are here](https://gitlab.com/n3dst4/gumshoe-fvtt/-/blob/master/README.md).

3. **NEXT, STOP YOUR FOUNDRY SERVER**. Let's not confuse Foundry by changing stuff while it's running.

4. **STOP. THINK. YOU DID TAKE A BACKUP WHEN I TOLD YOU TO, RIGHT?** Okay, good. Just checking.

5. **NOW LET'S MAKE THE CHANGE** Look in your foundry data folder (the one you backed up) and find `Data/worlds/your-world-name/world.json` inside it. Open this file in notepad or ViM or whatever you like to edit text in.

    You're looking for a line that looks like this:

    ```
      "system": "trail-of-cthulhu-unsanctioned",
    ```

    Change it to:

    ```
      "system": "gumshoe",
    ```

    Now save `world.json`.

6. **START YOUR FOUNDRY SERVER UP AGAIN AND LAUNCH YOUR WORLD**. You'll probably see some messages about migrations.

## What if it all goes wrong and I've ruined my world?

This won't happen, but if you think it might, you took a backup of your foundry data folder. Stop the server, rename the "broken" data folder to something else, and then copy the backup back to the "real" name. Then file an issue so we can see what went wrong.