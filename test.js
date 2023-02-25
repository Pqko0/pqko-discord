const {client_id, client_secret, token } = require("./config.json")

const pqko = require("./index")
const oauth = new pqko.OAuth2(client_id, client_secret, token, "http://localhost:9552/redirect")

// oauth.codeValidation("oI0rVHdx8lrIDyUGFmIg8iISeFVKaT").then((x) => console.log(x))

// oauth.validateAccessToken("y6eKiNaxvopNbido4aLQxyiDg0pPCa").then((x) => console.log(x))

// oauth.getUserConnections("y6eKiNaxvopNbido4aLQxyiDg0pPCa").then((x) => console.log(x))

// oauth.getUserRoleConnections("y6eKiNaxvopNbido4aLQxyiDg0pPCa", "UC25V8BnOoc6zNgMQtGB6GmA").then((x) => console.log(x))

// oauth.createServer("testing").then((x) => console.log(x))

// oauth.getGuild("...").then((x) => console.log(x))

// oauth.getGuildPreview("...").then((x) => console.log(x))

// oauth.getGuildChannels("...").then((x) => console.log(x))

// oauth.modifyGuild("...", {
//     name: "This has been edited!"
// }).then((x) => console.log(x))

// oauth.deleteGuild("...").then((x) => console.log(x))