## Pqko Discord
Pqko Discord is a private project for future usage! \
Even though its a private project if you wish support join: https://discord.gg/vwxya3gHJQ

## Notice
Please do not use JSON handler + Folder Handler as it will overwrite your other handlers!

## Download

```
npm i pqko-discord discord.js
```

## Slash Command Handler Usage
Video : https://youtu.be/WAwmOyKhNFg \
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
const { SlashCommandBuilder } = require('discord.js')

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
Video : https://youtu.be/9pZnQnue_h8 \
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

Get connections - connections required
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

## Discord Auth (Express Only) 

__THIS IS IN BETA__

Video: https://youtu.be/OUjGLzNTTUQ \
Basic Setup
```js
const { client_id, client_secret, token } = require("./config.json") // Your config file
const OAuth2Link = "..." // https://discord.com/developers/applications/.../oauth2/url-generator

const PqkoDiscord = require("pqko-discord")
const OAuth2 = new PqkoDiscord.OAuth2(client_id, client_secret, token, "http://localhost:5014/login") // Change the last part to your website must keep /login
const auth = new PqkoDiscord.Auth.DiscordAuth(OAuth2) // Required for discord auth
const express = require('express')
const app = express()

app.use(PqkoDiscord.Auth.cookieparser()) // cookie-parser but built in
.use(auth.__express(OAuth2)) // Creates to Request Headers ( req.user + req.logged )
.get("/", (req, res) => {
    res.send("Your site here!")
})
.get("/login", async (req, res) => { // Whatever the first argument it must be the redirect link
    if(req.logged == true) return res.redirect("/dashboard") // Logged in redirect

    if(req.query.code) {
        const x = await auth.login(req, res) // Pases through 3 things ( message, account + token )

        if(x.message == 1 && x.account == 1) {
            res.cookie("token", x.token)

            return res.redirect("/dashboard");
        } else return res.redirect(OAuth2Link)
    } else return res.redirect(OAuth2Link)
})
.get("/logout", (req, res) => {
    if(req.logged == false) return res.redirect("/") // Not logged redirect to home page 

    auth.logout(req, res) // Passes nothing back
    return res.redirect("/")
})
.get("/dashboard", (req, res) => {
    res.send(req.user)
})
.listen(5014, () => console.log("http://localhost:5014/"))
```