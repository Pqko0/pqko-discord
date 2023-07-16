const BASE_URL = "https://discord.com/api";

const API_URL = BASE_URL + "/oauth2/token";

const AUTH_API = BASE_URL + "/oauth2/@me";

const USER_API = BASE_URL + "/users/@me";

const GUILDS_API = BASE_URL + "/guilds";

const USER_CONNECTIONS_API = BASE_URL + "/users/@me/connections";

const USER_ROLE_CONNECTIONS_API = (id) =>
  BASE_URL + `/users/@me/applications/${id}/role-connection`;

const GUILD_USER_API = BASE_URL + "/users/@me/guilds";

const GUILD_JOIN_API = BASE_URL + "/guilds/";

const axios = require("axios").default;

class OAuth2 {
  constructor(token, client_id, client_secret, redirect_url) {
    this.id = client_id;
    this.secret = client_secret;
    this.url = redirect_url;
    this.token = token;
  }

  async codeValidation(code) {
    let params = new URLSearchParams();
    params.append("client_id", this.id);
    params.append("client_secret", this.secret);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", this.url);

    return new Promise(function (resolve, rejefct) {
      axios
        .post(API_URL, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((x) => {
          return resolve(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return resolve(x.response.data);
          } else {
            return rejefct("Failed to send request to discord token api");
          }
        });
    });
  }

  async validateAccessToken(AccessToken) {
    return new Promise(async (res, rej) => {
      await axios
        .get(AUTH_API, {
          headers: {
            authorization: `Bearer ${AccessToken}`,
            "Accept-Encoding": "gzip,deflate,compress",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed request to api!");
          }
        });
    });
  }

  async refreshToken(refreshtoken) {
    let params = new URLSearchParams();
    params.append("client_id", this.id);
    params.append("client_secret", this.secret);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshtoken);

    return new Promise(function (resolve, rejefct) {
      axios
        .post(API_URL, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((x) => {
          return resolve(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return resolve(x.response.data);
          } else {
            return rejefct("Failed to send request to discord token api");
          }
        });
    });
  }

  async getUser(access_token) {
    return new Promise(async (res, rej) => {
      await axios
        .get(USER_API, {
          headers: {
            authorization: `Bearer ${access_token}`,
            "Accept-Encoding": "gzip,deflate,compress",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          console.log(x);
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed request to api!");
          }
        });
    });
  }

  async getUserConnections(access_token) {
    return new Promise(async (res, rej) => {
      axios
        .get(USER_CONNECTIONS_API, {
          headers: {
            authorization: `Bearer ${access_token}`,
            "Accept-Encoding": "gzip,deflate,compress",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed request at getUserConnections");
          }
        });
    });
  }

  async getUserRoleConnections(access_token, applicationID) {
      return new Promise((res, rej) => {
          axios.get(USER_ROLE_CONNECTIONS_API(applicationID), {
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
                  return rej("Failed request at getUserRoleConnections")
              }
          })
      })
    }

  async createServer(json) {
    return new Promise(async (res, rej) => {
      axios
        .post(
          GUILDS_API,
          json,
          {
            headers: {
              authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed request at createServer");
          }
        });
    });
  }

  async getGuild(guildID) {
    return new Promise((res, rej) => {
      axios
        .get(`${GUILDS_API}/${guildID}`, {
          headers: {
            authorization: `Bot ${this.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response);
          } else {
            return rej("Failed request at getGuild");
          }
        });
    });
  }

  async getGuildPreview(guildID) {
    return new Promise((res, rej) => {
      axios
        .get(`${GUILDS_API}/${guildID}/preview`, {
          headers: {
            authorization: `Bot ${this.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response);
          } else {
            return rej("Failed request at getGuildPreview");
          }
        });
    });
  }

  async modifyGuild(guildID, json) {
    return new Promise((res, rej) => {
      axios
        .patch(`${GUILDS_API}/${guildID}`, json, {
          headers: {
            authorization: `Bot ${this.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response);
          } else {
            return rej("Failed request at modifyGuild");
          }
        });
    });
  }

  async deleteGuild(guildID) {
    return new Promise((res, rej) => {
      axios
        .delete(`${GUILDS_API}/${guildID}`, {
          headers: {
            authorization: `Bot ${this.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response);
          } else {
            return rej("Failed request at deleteGuild");
          }
        });
    });
  }

  async getGuildChannels(guildID) {
    return new Promise((res, rej) => {
      axios
        .get(`${GUILDS_API}/${guildID}/channels`, {
          headers: {
            authorization: `Bot ${this.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed request at getGuildChannels");
          }
        });
    });
  }

  async createGuildChannel(name, json) {
    return new Promise((res, rej) => {
        axios
          .post(`${GUILDS_API}/${guildID}/channels`, json, {
            headers: {
              authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          })
          .then((x) => {
            return res(x.data);
          })
          .catch((x) => {
            if (x.response) {
              return res(x.response.data);
            } else {
              return rej("Failed request at getGuildChannels");
            }
          });
      });
  }

  async modifyGuildChannel(name, json) {
    return new Promise((res, rej) => {
        axios
          .patch(`${GUILDS_API}/${guildID}/channels`, json, {
            headers: {
              authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          })
          .then((x) => {
            return res(x.data);
          })
          .catch((x) => {
            if (x.response) {
              return res(x.response.data);
            } else {
              return rej("Failed request at getGuildChannels");
            }
          });
      });
  }

  async getUserGuilds(access_token) {
    return new Promise(async (res, rej) => {
      axios
        .get(GUILD_USER_API, {
          headers: {
            authorization: `Bearer ${access_token}`,
            "Accept-Encoding": "gzip,deflate,compress",
          },
        })
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed request at getUserGuilds");
          }
        });
    });
  }

  async userJoinServer(guild_id, user_id, access_token) {
    return new Promise(async (res, rej) => {
      await axios
        .put(
          GUILD_JOIN_API + `${guild_id}/members/${user_id}`,
          { access_token },
          {
            headers: {
              ContentType: "application/json",
              Authorization: "Bot " + this.token,
            },
          }
        )
        .then((x) => {
          return res(x.data);
        })
        .catch((x) => {
          if (x.response) {
            return res(x.response.data);
          } else {
            return rej("Failed to make request to guild join api");
          }
        });
    });
  }
}

module.exports = OAuth2;
