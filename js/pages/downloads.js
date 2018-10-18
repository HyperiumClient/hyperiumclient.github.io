$(function() {
  const HYPERIUM_VERSIONS_JSON_URL = 'https://raw.githubusercontent.com/HyperiumClient/Hyperium-Repo/master/installer/versions.json';
  const INSTALLER_LATEST_RELEASE_URL = 'https://api.github.com/repos/HyperiumClient/Installer/releases/latest';

  fetchJson(HYPERIUM_VERSIONS_JSON_URL, function(data) {
    const latestVersion = data.versions.sort(function(versionOne, versionTwo) {
      return versionTwo["release-id"] - versionOne["release-id"];
    })[0];
    const cardElement = $('div#latest-version-card');
    cardElement.find('div.card-body a.btn').attr('href', latestVersion.url);
    cardElement.find('div.card-footer small.text-muted').text('Version ' + latestVersion.name);
  });

  fetchJson(INSTALLER_LATEST_RELEASE_URL, function(data) {
    const asset = data.assets.filter(function(asset) {
      return !asset.name.toLowerCase().includes('sources');
    })[0];
    const cardElement = $('div#universal-installer-card');
    cardElement.find('div.card-body a.btn').attr('href', asset.browser_download_url);
    let versionString = data.tag_name + ' of ';
    versionString += formatDate(new Date(data.published_at));
    cardElement.find('div.card-footer small.text-muted').text(versionString);

    const changelogList = cardElement.find('ul');
    let changelogItems = data.body.split('\n');
    changelogItems.forEach(function(item) {
      changelogList.append('<li class="list-group-item">' + item + '</li>');
    });
  });

  function formatDate(date) {
    return date.toLocaleDateString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
});
