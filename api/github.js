const fetch = require('node-fetch')

class Github {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.hostname = "https://api.github.com"
  }

  listRepositoryContributors() {
    const headers = {
      "Accept": "application/json",
      "Authorization": `token ${ this.apiToken }`
    };

    const url = `${ this.hostname }/repos/KevinMidboe/vinlottis/contributors`
    return fetch(url, { headers })
      .then(resp => resp.json())
      .then(contributors =>
        contributors.map(contributor => new Contributor(contributor))
      );
  }
}

class Contributor {
  constructor(contributorObject) {
    this.name = contributorObject.login;
    this.avatarUrl = contributorObject.avatar_url;
    this.profileUrl = contributorObject.html_url;
    this.projectContributions = contributorObject.contributions;
  }
}

module.exports = Github;