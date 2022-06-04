import {
  getUser,
  getRepos,
  createRepo,
  commitFile,
  getFilesFromRepo,
  getFile
} from "./handlers/github.js";
import { decodeToken, login } from './handlers/login';

export const setupEndpoints = (app) => {
  app.get("/api/me", (req, res) => {
    console.log('Decoding token');
    return decodeToken(req, res);
  });

  app.post("/api/login", (req, res) => {
    console.log('Login user');
    return login(req, res);
  });

  app.get("/api/user", (req, res) => {
    console.log('Getting GitHub user');
    return getUser(req, res);
  });

  app.get("/api/repos", (req, res) => {
    console.log('Getting GitHub Repos');
    return getRepos(req, res);
  });

  app.post("/api/repos", (req, res) => {
    console.log('Creating GitHub Repo');
    return createRepo(req, res);
  });

  app.put("/api/:username/repos/:repo", (req, res) => {
    console.log('Committing file');
    return commitFile(req, res);
  });

  app.get("/api/:username/repos/:repo/files"), (req, res) => {
    console.log('Getting repo file');
    return getFilesFromRepo(req, res);
  };

  app.get("/api/:username/repos/:repo/:filepath", (req, res) => {
    console.log('Getting file content');
    return getFile(req, res);
  })
}



