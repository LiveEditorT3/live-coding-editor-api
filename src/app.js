import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import pkg from "lodash";
const { get } = pkg;
import cors from "cors";
import bodyParser from "body-parser";
import {
  getUserRepos,
  getGitHubUser,
  createRepo,
  commit,
  getAccessToken,
} from "./services/github.js";

const app = express();

app.use(bodyParser.json());

const UI_HOST = process.env.UI_HOST;
const UI_PORT = process.env.UI_PORT;
const API_PORT = process.env.API_PORT;
const COOKIE_NAME = process.env.COOKIE_NAME;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(
  cors({
    origin: `http://${UI_HOST}:${UI_PORT}`,
    credentials: true,
  })
);

app.get("/api/me", (req, res) => {
  const cookie = get(req, `cookies[${COOKIE_NAME}]`);

  try {
    const decode = jwt.verify(cookie, COOKIE_SECRET);

    return res.send(decode);
  } catch (e) {
    return res.send(null);
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const user = await getGitHubUser(req.headers.authorization);
    return res.send(user);
  } catch (e) {
    return res.status(404).send();
  }
});

app.get("/api/repos", async (req, res) => {
  try {
    const repos = await getUserRepos(req.headers.authorization);
    return res.send(repos);
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
});

app.post("/api/repos", async (req, res) => {
  try {
    await createRepo(
      req.headers.authorization,
      req.body.name,
      req.body.isPrivate
    );
    return res.status(201).send();
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
});

app.post("/api/login", async (req, res) => {
  const code = get(req, "query.code");
  const access_token = await getAccessToken(req, code);
  return res.send({ access_token });
});

app.put("/api/:username/repos/:repo", async (req, res) => {
  try {
    await commit(
      req.headers.authorization,
      req.params.username,
      req.params.repo,
      req.body
    );
    return res.status(201).send();
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
});

app.listen(API_PORT, () => {
  console.log(`Server is listening on port ${API_PORT}`);
});
