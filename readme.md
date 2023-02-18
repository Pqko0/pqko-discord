## Pqko Discord
Pqko Discord is a private project for future usage!
Even though its a private project if you wish support join: https://discord.gg/vwxya3gHJQ

## Notice
Please do not use JSON handler + Folder Handler as it will overwrite your other handlers!

## Download

```
npm i pqko-discord discord.js
```

## Slash Command Handler Usage

This is the basic setup for the handler
```js
const PqkoDiscord = require("pqko-discord")
const pqko = new PqkoDiscord.SlashCommands(token, client_id, client_secret)

pqko.login()
```
This is the folder handler. As you see its very simple
```js
// Main Code
pqko.folderHandler("commands")
// Some js file in "commands" folder
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName("test").setDescription("This is the first command with pqko-discord!"),
    execute: async (interaction, client) => {
        await interaction.reply("This has been sent via pqko-discord module!")
    }
}
```

This is the JSON handler. This is slightly harder to check for errors.
```js
const commands = [
    {
        data: new SlashCommandBuilder().setName("test").setDescription("This is the first command with pqko-discord!"),
        execute: async (interaction, client) => {
            await interaction.reply("This has been sent via pqko-discord module!")
        }
    }
]

pqko.jsonHandler(commands)
```

## OAuth2 Usage

Basic Setup
```js
const PqkoDiscord = require("pqko-discord")
const OAuth2 = new PqkoDiscord.OAuth2(client_id, client_secret, token, redirect_url)
```

Validate code
```js
OAuth2.codeValidation(code).then((x) => {
    console.log(x)
}).catch((x) => {
    console.log(x)
})
```

Refresh Access Token
```js
OAuth2.refreshToken(refresh_token).then((x) => {
    console.log(x)
}).catch((x) => {
    console.log(x)
})
```

Get user - Identity required (email optional)
```js
OAuth2.getUser(access_token).then((x) => {
    console.log(x)
}).catch((x) => {
    console.log(x)
})
```

Get connections - connections requried
```js
OAuth2.getUserConnections(access_token).then((x) => {
    console.log(x)
}).catch((x) => {
    console.log(x)
})
```

Get servers - guilds required
```js
OAuth2.getServers(access_token).then((x) => {
    console.log(x)
}).catch((x) => {
    console.log(x)
})
```

Join guild - guild.join required + bot token required with instant invite permission
```js
OAuth2.joinServer(guild_id, user_id, access_token).then((x) => {
    console.log(x)
}).catch((x) => {
    console.log(x)
})
```

## Express Auth Handler
Coming soon...