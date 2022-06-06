import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

function getGitHubUser(accessToken) {
  return axios
    .get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then(({ data }) => data)
    .catch((error) => {
      console.error("Error getting user from GitHub");
      throw error;
    });
}

function getUserRepos(accessToken) {
  return axios
    .get("https://api.github.com/user/repos?type=owner", {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then(({ data }) => data)
    .catch((error) => {
      console.error("Error getting user repos from GitHub");
      throw error;
    });
}

function createRepo(accessToken, name, isPrivate) {
  return axios
    .post(
      "https://api.github.com/user/repos",
      {
        name,
        auto_init: true,
        private: isPrivate,
      },
      { headers: { Authorization: `token ${accessToken}` } }
    )
    .then((res) => res)
    .catch((error) => {
      console.error("Error creating repo in GitHub");
      throw error;
    });
}

function commit(accessToken, user, repo, commit) {
  return axios
    .put(
      `https://api.github.com/repos/${user}/${repo}/contents/${commit.path}`,
      {
        owner: user,
        repo,
        path: commit.path,
        message: commit.message,
        content: Buffer.from(commit.content).toString("base64"),
        ...(commit.sha ? { sha: commit.sha } : {})
      },
      { headers: { Authorization: `token ${accessToken}` } }
    )
    .then((res) => res)
    .catch((error) => {
      console.error("Error committing a change to GitHub");
      throw error;
    });
}

function getAccessToken(req) {
  return axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${req.query.code}`,
      null,
      { headers: { Accept: "application/json" } }
    )
    .then(({ data }) => data.access_token)
    .catch((error) => {
      throw error;
    });
}

function getFilesFromRepo(accessToken, user, repo) {
  return axios
    .get(`https://api.github.com/repos/${user}/${repo}/contents`, {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error getting files from repo");
      throw error;
    });
}

function getFile(accessToken, user, repo, path) {
  return axios
    .get(`https://api.github.com/repos/${user}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((res) => ({
      ...res.data,
      content: Buffer.from(res.data.content, "base64").toString(),
    }))
    .catch((error) => {
      console.error("Error getting file");
      throw error;
    });
}

export {
  getGitHubUser,
  getUserRepos,
  createRepo,
  commit,
  getAccessToken,
  getFilesFromRepo,
  getFile,
};
