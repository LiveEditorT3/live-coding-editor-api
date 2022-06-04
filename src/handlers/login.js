import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import pkg from "lodash";
const { get } = pkg;
import * as githubServices from '../services/github.js';

const COOKIE_NAME = process.env.COOKIE_NAME;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

async function decodeToken(req, res) {
  const cookie = get(req, `cookies[${COOKIE_NAME}]`);

  try {
    const decode = jwt.verify(cookie, COOKIE_SECRET);

    return res.send(decode);
  } catch (e) {
    return res.send(null);
  }
}

async function login(req, res) {
  const code = get(req, "query.code");
  const access_token = await githubServices.getAccessToken(req, code);
  return res.send({ access_token });
}

export { decodeToken, login }