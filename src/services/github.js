import dotenv from "dotenv";
dotenv.config();
import pkg from "lodash";
const { get } = pkg;
import axios from "axios";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function getGitHubUser(accessToken) {
  return axios
    .get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error getting user from GitHub`);
      throw error;
    });
}

export async function getUserRepos(accessToken) {
  return axios
    .get("https://api.github.com/user/repos?type=owner", {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error getting user repos from GitHub`);
      throw error;
    });
}

export async function createRepo(accessToken, name, isPrivate) {
  return axios
    .post(
      "https://api.github.com/user/repos",
      {
        name,
        auto_init: true,
        private: isPrivate,
        gitignore_template: "nanoc",
      },
      { headers: { Authorization: `token ${accessToken}` } }
    )
    .then((res) => res)
    .catch((error) => {
      console.error(`Error creating repo in GitHub`);
      throw error;
    });
}

export async function commit(accessToken, user, repo, commit) {
  return axios
    .put(
      `https://api.github.com/repos/${user}/${repo}/contents/${commit.path}`,
      {
        owner: user,
        repo,
        path: commit.path,
        message: commit.message,
        content: Buffer.from(commit.content).toString("base64"),
      },
      { headers: { Authorization: `token ${accessToken}` } }
    )
    .then((res) => res)
    .catch((error) => {
      console.error(`Error creating repo in GitHub`);
      throw error;
    });
}

export async function getAccessToken(req) {
  const code = get(req, "query.code");
  const githubToken = await axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
      null,
      { headers: { Accept: "application/json" } }
    )
    .then((res) => res.data)

    .catch((error) => {
      throw error;
    });

  return githubToken.access_token;
}

export function getFilesFromRepo(accessToken, user, repo) {
  return axios.get(`https://api.github.com/repos/${user}/${repo}/contents`,
    {
      headers: { Authorization: `token ${accessToken}` },
    })
    .catch((error) => {
      console.error(`Error getting files from repo`);
      throw error;
    });
}

export function getFile(accessToken, user, repo, path) {
  return axios.get(`https://api.github.com/repos/${user}/${repo}/contents/${path}`,
    {
      headers: { Authorization: `token ${accessToken}` },
    })
    .catch((error) => {
      console.error(`Error getting file`);
      throw error;
    });
}