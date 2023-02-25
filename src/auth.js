// const { Request, Response, Next } = require("express");
// const { sha256, sha224 } = require("js-sha256"); // Local Method COMIGN SOON
const cp = require("cookie-parser");
const OAuth2 = require("./oauth2");
// const mongoose = require("mongoose"); // Local Method COMIGN SOON

var methods = {};

/**
 * Discord Auth Method:
 *  - Uses OAuth2 Refresh Tokens + Access Tokens
 *  - No database required
 *  - Uses more utility / resources
 *  - Access / Refresh token are saved same cookie sperated by a ","
 *  - Example: access_token,refresh_token
 */

methods.DiscordAuth = class {
  /**
   *
   * @param {import("./oauth2")} OAuth2
   */
  constructor(OAuth2) {
    this.API = OAuth2;
  }

  /**
   * 
   * @param {OAuth2} OAuth2 
   * @returns 
   */
  __express(OAuth2) {
    return async function (req, res, next) {
      if (!req.cookies.token) {
        req.logged = false;
        return next();
      }

      const tokens = req.cookies.token.split(",");
      const access_token = tokens[0];
      const refresh_token = tokens[1];

      const tokenCheck = await OAuth2.validateAccessToken(access_token);

      if (!tokenCheck.application) {
        const refToken = await OAuth2.refreshToken(refresh_token)

        if(refToken.access_token && refToken.refresh_token) {
          const tokenCheck2 = await OAuth2.validateAccessToken(refToken.access_token);
          if(!tokenCheck2.application) {
            res.clearCookie("token")
            req.logged = false;
            return next();
          } else {
            res.cookie("token", `${refToken.access_token},${refToken.refresh_token}`)
            if(tokenCheck2.user) req.user = tokenCheck.user;
            req.accessToken = access_token;
            req.refreshToken = refresh_token;
            req.logged = true;
            return next();
          }
        } else {
          req.logged = false;
          return next();
        }
      } else {
        if (tokenCheck.user) req.user = tokenCheck.user;
        req.accessToken = access_token;
        req.refreshToken = refresh_token;
        req.logged = true;
        return next();
      }
    };
  }

  login(req, res) {
    return new Promise(async (res, rej) => {
      if (!req.query.code) {
        return res({ message: 5 });
      } else {
        const data = await this.API.codeValidation(req.query.code);

        if (!data.access_token || !data.refresh_token) {
          return res({ message: 1, account: 6 });
        }

        return res({
          message: 1,
          account: 1,
          token: `${data.access_token},${data.refresh_token}`,
        });
      }
    });
  }

  logout(req, res) {
    if(req.cookies.token) res.clearCookie("token")
    return;
  }
};

/**
 * Local Auth Method:
 *  - Uses local generated tokens
 *  - Fully manage users
 *  - Uses less resources
 *  - Database requried (MongoDB)
 */

methods.LocalAuth = class {
  constructor(OAuth2, encryptionString) {
    this.API = OAuth2;
    this.encodeString = encryptionString;
    this.encode = (data) => sha256.hmac(encryptionString, sha224(data));
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  __express(req, res, next) {
    return new Promise(async (res, rej) => {
      
    })
  }
}; 

methods.cookieparser = cp;

module.exports = methods;
