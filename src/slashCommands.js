const { promisify } = require("util");
const { glob } = require("glob");
const proGlob = promisify(glob);

const Discord = require("discord.js");
const intent = Discord.GatewayIntentBits;
const intents = [
  intent.Guilds,
  intent.GuildMessages,
  intent.MessageContent,
  intent.DirectMessages,
  intent.GuildMessageReactions,
  intent.GuildVoiceStates,
  intent.GuildWebhooks,
  intent.GuildMembers,
  intent.GuildModeration,
  intent.GuildInvites,
  intent.GuildMessageTyping,
  intent.GuildMessageReactions,
];

const REST = Discord.REST;
const Routes = Discord.Routes;

class SlashCommands {
  constructor(token, client_id, client_secret) {
    this.Client = new Discord.Client({ intents: 3276799 });

    this.token = token;
    this.id = client_id;
    this.secret = client_secret;
    this.commands = new Discord.Collection();
    this.Client.on("interactionCreate", (x) => interactionManager(x, this.Client, this.commands))
  }

  export() {
    return this.Client;
  }

  login() {
    this.Client.login(this.token);
  }

  jsonHandler(array) {
    this.Client.on("ready", async (x) => {
      commandsArray = [];
      this.commands.clear()
      array.forEach((x) => {
        if (!x.data) return console.log(new Error("Missing data from jsonHandler!"));
        if (!x.execute) return console.log(new Error("Missing execute from jsonHandler!"));
        this.commands.set(x.data.name, x);

        commandsArray.push(x.data.toJSON());
      });

      updateSlashCommands(this.token, this.id)
    });
  }

  async folderHandler(path) {
    this.Client.on("ready", async (x) => {
      commandsArray = [];
      this.commands.clear()
      const cmdsFolder = `${process.cwd().replace(/\\/g, "/")}/${path}/**/*.js`;

      const files = await proGlob(cmdsFolder);
      files.forEach((file) => {
        require.cache[require.resolve(file)];

        let cmd;
        let name = String(file.split("/").slice(-1)).replace(".js", "");

        try {
          cmd = require(file);
        } catch (error) {
          return new Error("Failed to load command: " + name);
        }

        if (!cmd.data) return new Error("Failed to get command data: " + name);
        if (!cmd.execute)
          return new Error("Failed to get command execute: " + name);

        this.commands.set(cmd.data.name, cmd);

        commandsArray.push(cmd.data.toJSON());
      });

      updateSlashCommands(this.token, this.id);
    });
  }
}

let commandsArray = [];

async function updateSlashCommands(token, clientID) {
  let rest = new REST({ version: "10" }).setToken(token);

  await rest
    .put(Routes.applicationCommands(clientID), {
      body: commandsArray,
    })
    .then((x) => {
      return { ok: 1 };
    })
    .catch((x) => {
      return new Error(x);
    });
}

async function interactionManager(interaction, client, commands) {
  if (interaction.isChatInputCommand()) {
    let cmd = commands.get(interaction.commandName);

    if (!cmd) return interaction.reply("Unknown Command!");

    try {
      cmd.execute(interaction, client);
    } catch (error) {
      return interaction.reply("Couldn't execute command!");
    }
  }
}

module.exports = SlashCommands;