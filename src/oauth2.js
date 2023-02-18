const BASE_URL = "https://discord.com/api"

const API_URL = BASE_URL + "/oauth2/token"

const USER_API = BASE_URL + "/users/@me"

const USER_CONNECTIONS_API = "/users/@me/connections"

const GUILD_USER_API = BASE_URL + "/users/@me/guilds"

const GUILD_JOIN_API = BASE_URL + "/guilds/"

const axios = require("axios").default;

class OAuth2 {
    constructor(client_id, client_secret, token, redirect_url) {
        this.id = client_id;
        this.secret = client_secret;
        this.url = redirect_url;
        this.token = token;
    }

    async codeValidation(code) {
        let params = new URLSearchParams()
        params.append("client_id", this.id)
        params.append("client_secret", this.secret)
        params.append("grant_type", "authorization_code")
        params.append("code", code)
        params.append("redirect_uri", this.url)

        return new Promise(function(resolve, rejefct) {
            axios.post(API_URL, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((x) => {
                return resolve(x.data);
            }).catch((x) => {
                if(x.response) {
                    return resolve(x.response.data)
                } else {
                    return rejefct("Failed to send request to discord token api")
                }
            })
        })  
    }

    async refreshToken(refreshtoken) {
        let params = new URLSearchParams()
        params.append("client_id", this.id)
        params.append("client_secret", this.secret)
        params.append("grant_type", "refresh_token")
        params.append("refresh_token", refreshtoken)

        return new Promise(function(resolve, rejefct) {
            axios.post(API_URL, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((x) => {
                return resolve(x.data);
            }).catch((x) => {
                if(x.response) {
                    return resolve(x.response.data)
                } else {
                    return rejefct("Failed to send request to discord token api")
                }
            })
        })  
    }

    async getUser(access_token) {
        return new Promise(async (res, rej) => {
            await axios.get(USER_API, {
                headers: {
                    authorization: `Bearer ${access_token}`,
                    "Accept-Encoding": "gzip,deflate,compress",
                }
            }).then((x) => {
                return res(x.data)
            }).catch((x) => {
                console.log(x)
                if(x.response) {
                    return res(x.response.data)
                } else {
                    return rej("Failed request to api!")
                }
            })
        })
    }

    async getUserConnections(access_token) {
        return new Promise(async (res, rej) => {
            axios.get(USER_CONNECTIONS_API, {
                authorization: `Bearer ${access_token}`,
                "Accept-Encoding": "gzip,deflate,compress",
            }).then((x) => {
                return res(x.data)
            }).catch((x) => {
                if(x.response) {
                    return res(x.response.data)
                } else {
                    return rej("Failed request at getUserConnections")
                }
            })
        })
    }

    async getServers(access_token) {
        return new Promise(async (res, rej) => {
            axios.get(GUILD_USER_API, {
                headers: {
                    authorization: `Bearer ${access_token}`,
                    "Accept-Encoding": "gzip,deflate,compress",
                }
            }).then((x) => {
                return res(x.data)
            }).catch((x) => {
                if(x.response) {
                    return res(x.response.data)
                } else {
                    return rej(new Error("Failed to do get server request!"))
                }
            })
        })
    }

    async joinServer(guild_id, user_id, access_token) {
        return new Promise(async(res, rej) => {
            await axios.put(GUILD_JOIN_API + `${guild_id}/members/${user_id}`, {access_token}, {
                headers: {
                    "ContentType": "application/json",
                    "Authorization": "Bot " + this.token
                }
            }).then((x) => {
                return res(x.data)
            }).catch((x) => {
                if(x.response) {
                    return res(x.response.data)
                } else {
                    return rej("Failed to make request to guild join api")
                }
            })
        })
    }
}

module.exports = OAuth2;