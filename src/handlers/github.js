import * as githubServices from "../services/github.js";

function handleAxiosError(res, error) {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.status);
    console.log(error.response.headers);
    console.log(error.response.data);
    // Forward the error code from GitHub to the client
    return res.status(error.response.status).send()
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
    // Return a 404 to the client in all cases
    return res.status(404).send();
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
    // Return a 500 Internal Server Error to the client in all cases
    return res.status(500).send();
  }
}

async function getUser(req, res) {
  try {
    const user = await githubServices.getGitHubUser(req.headers.authorization);
    return res.send(user);
  } catch (e) {
    return handleAxiosError(res, e);
  }
}

async function getRepos(req, res) {
  try {
    const repos = await githubServices.getUserRepos(req.headers.authorization);
    return res.send(repos);
  } catch (e) {
    return handleAxiosError(res, e);
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
    return handleAxiosError(res, e);
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
    return handleAxiosError(res, e);
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
    return handleAxiosError(res, e);
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
    return handleAxiosError(res, e);
  }
}

export { getUser, getRepos, createRepo, commitFile, getFilesFromRepo, getFile };
