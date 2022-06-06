import axios from "axios";
import * as githubServices from "../../services/github";

jest.mock("axios");

const testGithubError = async (httpMethod, functionName) => {
  const githubError = { message: "Github Error" };
  axios[httpMethod].mockRejectedValue(githubError);
  expect.assertions(1);

  return githubServices[functionName]("some-token").catch((error) => {
    expect(error).toStrictEqual(githubError);
  });
};

describe("GitHub services", () => {
  const githubToken = "some-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGithubUser", () => {
    test("Github error", () => {
      return testGithubError("get", "getGitHubUser");
    });

    test("Check axios call", async () => {
      axios.get.mockResolvedValue({ data: { user: "some-username" } });

      await githubServices.getGitHubUser(githubToken);
      expect(axios.get).toHaveBeenCalledWith("https://api.github.com/user", {
        headers: { Authorization: `token ${githubToken}` },
      });
    });

    test("Check response", async () => {
      const axiosResponse = { data: { user: "some-username" } };
      axios.get.mockResolvedValue(axiosResponse);

      const response = await githubServices.getGitHubUser(githubToken);
      expect(response).toStrictEqual(axiosResponse.data);
    });
  });

  describe("getUserRepos", () => {
    test("Github error", () => {
      return testGithubError("get", "getUserRepos");
    });

    test("Check axios call", async () => {
      axios.get.mockResolvedValue({ data: { repos: ["some-repo-name"] } });

      await githubServices.getUserRepos(githubToken);
      expect(axios.get).toHaveBeenCalledWith(
        "https://api.github.com/user/repos?type=owner",
        {
          headers: { Authorization: `token ${githubToken}` },
        }
      );
    });

    test("Check response", async () => {
      const axiosResponse = { data: { repos: ["some-repo-name"] } };
      axios.get.mockResolvedValue(axiosResponse);

      const response = await githubServices.getUserRepos(githubToken);
      expect(response).toStrictEqual(axiosResponse.data);
    });
  });

  describe("createRepo", () => {
    const repo = "some-name";
    const isPrivate = false;

    test("Github error", () => {
      const githubError = { message: "Github Error" };
      axios.post.mockRejectedValue(githubError);
      expect.assertions(1);

      return githubServices
        .createRepo(githubToken, repo, isPrivate)
        .catch((error) => {
          expect(error).toStrictEqual(githubError);
        });
    });

    test("Check axios call", async () => {
      axios.post.mockResolvedValue({ statusCode: 201, data: {} });

      await githubServices.createRepo(githubToken, repo, isPrivate);
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.github.com/user/repos",
        {
          name: repo,
          auto_init: true,
          private: isPrivate,
        },
        { headers: { Authorization: `token ${githubToken}` } }
      );
    });

    test("Check response", async () => {
      const axiosResponse = { statusCode: 201, data: {} };
      axios.post.mockResolvedValue(axiosResponse);

      const response = await githubServices.createRepo(githubToken);
      expect(response).toStrictEqual(axiosResponse);
    });
  });

  describe("commit", () => {
    const username = "some-username";
    const repo = "some-repo";
    const commit = {
      path: "/some/path",
      message: "some-message",
      content: "Some text",
    };

    test("Github error", () => {
      const githubError = { message: "Github Error" };
      axios.put.mockRejectedValue(githubError);
      expect.assertions(1);

      return githubServices
        .commit(githubToken, username, repo, commit)
        .catch((error) => {
          expect(error).toStrictEqual(githubError);
        });
    });

    test("Check axios call", async () => {
      axios.put.mockResolvedValue({ statusCode: 200, data: {} });

      await githubServices.commit(githubToken, username, repo, commit);
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.github.com/repos/${username}/${repo}/contents/${commit.path}`,
        {
          owner: username,
          repo,
          path: commit.path,
          message: commit.message,
          content: Buffer.from(commit.content).toString("base64"),
        },
        { headers: { Authorization: `token ${githubToken}` } }
      );
    });

    test("Check response", async () => {
      const axiosResponse = { statusCode: 200, data: {} };
      axios.post.mockResolvedValue(axiosResponse);

      const response = await githubServices.commit(
        githubToken,
        username,
        repo,
        commit
      );
      expect(response).toStrictEqual(axiosResponse);
    });
  });

  describe("getAccessToken", () => {
    const request = { query: { code: "some-code" } };
    const axiosResponse = {
      statusCode: 200,
      data: { access_token: githubToken },
    };
    test("Github error", () => {
      const githubError = { message: "Github Error" };
      axios.post.mockRejectedValue(githubError);
      expect.assertions(1);

      return githubServices.getAccessToken(request).catch((error) => {
        expect(error).toStrictEqual(githubError);
      });
    });

    test("Check axios call", async () => {
      axios.post.mockResolvedValue(axiosResponse);

      await githubServices.getAccessToken(request);
      expect(axios.post).toHaveBeenCalledWith(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${request.query.code}`,
        null,
        { headers: { Accept: "application/json" } }
      );
    });

    test("Check response", async () => {
      axios.post.mockResolvedValue(axiosResponse);

      const response = await githubServices.getAccessToken(request);
      expect(response).toBe(axiosResponse.data.access_token);
    });
  });
});
