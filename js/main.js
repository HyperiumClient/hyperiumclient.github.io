$(function() {
  const HYPERIUM_VERSIONS_JSON_URL = 'https://raw.githubusercontent.com/HyperiumClient/Hyperium-Repo/master/installer/versions.json';
  const CONTRIBUTORS_URL = 'https://api.github.com/repos/HyperiumClient/Hyperium/contributors';
  const INSTALLER_LATEST_RELEASE_URL = 'https://api.github.com/repos/HyperiumClient/Installer/releases/latest';

  fetchJson(HYPERIUM_VERSIONS_JSON_URL, function(data) {
    const latestVersion = data.versions.sort(function(versionOne, versionTwo) {
      return versionTwo["release-id"] - versionOne["release-id"];
    })[0];
    const cardElement = $('div#latest-version-card');
    cardElement.find('a.card-link').attr('href', latestVersion.url);
    cardElement.find('small.text-muted').text('Version ' + latestVersion.name);
  });

  fetchJson(CONTRIBUTORS_URL, function(data) {
    const contributors = data.filter(function(contributor) {
      return contributor.contributions >= 20;
    }).map(function(contributor) {
      return {name: contributor.login, profileUrl: contributor.html_url, avatarUrl: contributor.avatar_url, contributions: contributor.contributions};
    });

    const containerElement = document.getElementById('contributors-container');

    contributors.forEach(function(contributor) {
      const element = document.createElement('div');
      element.className = 'card';
      element.innerHTML = '<img class="card-img-top" width="100%" src="' + contributor.avatarUrl + '" alt="' + contributor.name + ' avatar" />'
        + '<div class="card-body">'
        + '<h5 class="card-title">' + contributor.name + '</h5>'
        + '<p class="card-text">Contributions: ' + contributor.contributions + '</p>'
        + '<a class="card-link" href="' + contributor.profileUrl + '">GitHub</a>'
        + '</div>';
      containerElement.appendChild(element);
    });
  });

  fetchJson(INSTALLER_LATEST_RELEASE_URL, function (data) {
    const asset = data.assets[0];
    const cardElement = $('div#universal-installer-card');
    cardElement.find('a.card-link').attr('href', asset.browser_download_url);
    cardElement.find('small.text-muted').text('Version ' + asset.name);
  });

  function fetchJson(url, callback) {
    var httpRequest = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var data = JSON.parse(httpRequest.responseText);
          if (callback) {
            callback(data);
          }
        }
      }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
  }
});
