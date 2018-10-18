$(function() {
  const HYPERIUM_VERSIONS_JSON_URL = 'https://raw.githubusercontent.com/HyperiumClient/Hyperium-Repo/master/installer/versions.json';
  const INSTALLER_LATEST_RELEASE_URL = 'https://api.github.com/repos/HyperiumClient/Installer/releases/latest';

  fetchJson(HYPERIUM_VERSIONS_JSON_URL, function(data) {
    const latestVersion = data.versions.sort(function(versionOne, versionTwo) {
      return versionTwo["release-id"] - versionOne["release-id"];
    })[0];
    const cardElement = $('div#latest-version-card');
    cardElement.find('a.card-link').attr('href', latestVersion.url);
    cardElement.find('small.text-muted').text('Version ' + latestVersion.name);
  });

  fetchJson(INSTALLER_LATEST_RELEASE_URL, function(data) {
    const asset = data.assets.filter(function(asset) {
      return !asset.name.toLowerCase().includes('sources');
    })[0];
    const cardElement = $('div#universal-installer-card');
    cardElement.find('a.card-link').attr('href', asset.browser_download_url);
    cardElement.find('small.text-muted').text('Version ' + asset.name);
  });
});
