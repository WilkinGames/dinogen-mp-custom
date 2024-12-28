# Dinogen Online: Multiplayer Server
© 2024 Wilkin Games

This repository allows you to configure and host a [Dinogen Online](https://dinogenonline.com) multiplayer server.

**Full guide:** https://steamcommunity.com/sharedfiles/filedetails/?id=2906260771

**Server admin guide:** https://steamcommunity.com/sharedfiles/filedetails/?id=2958252553

**Join the official Discord:** https://discord.gg/jhdNu5kDrZ

## Quick Start
Node must be installed. Download it for free: https://nodejs.org/en/download

Install the dependencies:

`npm install`

Start the multiplayer server:

`npm start`

## PM2
PM2 is useful for ensuring your server remains online, even if an error/interruption occurs.

**Learn more about PM2:** https://pm2.keymetrics.io/

Install PM2:

`npm install pm2 -g`

Start the server with PM2:

`pm2 start server.js --name dinogen-online`

View status:

`pm2 list`

## Settings
You can configure server settings in the `settings.json` file.

### Single Game Servers
If you prefer to have a single game server (eg a 24/7 Open World server), use the `bSingleGame` property.
