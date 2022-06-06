import * as githubServices from "../services/github.js";

async function getUser(req, res) {
  try {
    const user = await githubServices.getGitHubUser(req.headers.authorization);
    return res.send(user);
  } catch (e) {
    return res.status(404).send();
  }
}

async function getRepos(req, res) {
  try {
    const repos = await githubServices.getUserRepos(req.headers.authorization);
    return res.send(repos);
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
}

async function createRepo(req, res) {
  try {
    await githubServices.createRepo(
      req.headers.authorization,
      req.body.name,
      req.body.isPrivate
    );
    return res.status(201).send();
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
}

async function commitFile(req, res) {
  try {
    await githubServices.commit(
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
}

async function getFilesFromRepo(req, res) {
  try {
    const files = await githubServices.getFilesFromRepo(
      req.headers.authorization,
      req.params.username,
      req.params.repo
    );
    return res.send(files);
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
}

async function getFile(req, res) {
  try {
    const file = await githubServices.getFile(
      req.headers.authorization,
      req.params.username,
      req.params.repo,
      req.params.path
    );
    return res.send(file);
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
}

export { getUser, getRepos, createRepo, commitFile, getFilesFromRepo, getFile };
