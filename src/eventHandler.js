const { promisify } = require("util");
const { glob } = require("glob");
const proGlob = promisify(glob);

const events = [
    "applicationCommandCreate",
    "applicationCommandDelete",
    "applicationCommandUpdate",
    "channelCreate",
    "channelDelete",
    "channelPinsUpdate",
    "channelUpdate",
    "debug",
    "emojiCreate",
    "emojiDelete",
    "emojiUpdate",
    "error",
    "guildBanAdd",
    "guildBanRemove",
    "guildCreate",
    "guildDelete",
    "guildIntegrationsUpdate",
    "guildMemberAdd",
    "guildMemberAvailable",
    "guildMemberRemove",
    "guildMembersChunk",
    "guildMemberUpdate",
    "guildUnavailable",
    "guildUpdate",
    "interaction",
    "interactionCreate",
    "invalidated",
    "invalidRequestWarning",
    "inviteCreate",
    "inviteDelete",
    "message",
    "messageCreate",
    "messageDelete",
    "messageDeleteBulk",
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveAll",
    "messageReactionRemoveEmoji",
    "messageUpdate",
    "presenceUpdate",
    "rateLimit",
    "ready",
    "roleCreate",
    "roleDelete",
    "roleUpdate",
    "shardDisconnect",
    "shardError",
    "shardReady",
    "shardReconnecting",
    "shardResume",
    "stageInstanceCreate",
    "stageInstanceDelete",
    "stageInstanceUpdate",
    "stickerCreate",
    "stickerDelete",
    "stickerUpdate",
    "threadCreate",
    "threadDelete",
    "threadListSync",
    "threadMembersUpdate",
    "threadMemberUpdate",
    "threadUpdate",
    "typingStart",
    "userUpdate",
    "voiceStateUpdate",
    "warn",
    "webhookUpdate",
]; // Meant for discord.js v14
  
async function checkEvent(eventName) {
    if (!events.includes(eventName)) return 1;
    else return 0;
}

class eventHandler {
    constructor(discord_client, events_folder) {
        this.Client = discord_client
        this.events_folder = events_folder;
    }

    async events() {
        const eventFiles = await proGlob(
            `${process.cwd().replace(/\\/g, "/")}/${this.events_folder}/**/*.js`
        )

        eventFiles.forEach(async(file) => {
            require.cache[require.resolve(file)];

            let event;

            try {
                event = require(file)
            } catch (error) {
                return console.log(`An error has occured at: ${file}`)
            }

            const ev = await checkEvent(event.name)

            if(ev == 1) return console.log("Invalid event: " + event.name)

            try {
                if (event.rest) {
                    this.Client.rest.on(event.name, execute);
                  } else if (event.once) {
                    this.Client.once(event.name, execute);
                  } else {
                    this.Client.on(event.name, execute);
                  }
            } catch (error) {
                return console.log(error.message)
            }
        })
    }
}

module.exports = eventHandler;