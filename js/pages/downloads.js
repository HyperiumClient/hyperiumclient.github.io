$(function() {
  const UNIVERSAL_INSTALLER_RELEASE_URL = 'https://api.github.com/repos/HyperiumClient/Installer/releases/latest';
  const HYPERIUM_LATEST_VERSION_URL = 'https://api.hyperium.cc/versions';

  fetchJson(HYPERIUM_LATEST_VERSION_URL, function(data) {
    const latestVersion = data.latest;
    const cardElement = $('div#latest-version-card');
    cardElement.find('div.card-body a.btn').attr('href', "https://sk1er.club/file_download?url="+latestVersion.url);
    let versionString = 'Version ' + latestVersion.build;
    versionString += ' build ' + latestVersion.id;
    cardElement.find('div.card-footer small.text-muted').text(versionString);
  });

  fetchJson(UNIVERSAL_INSTALLER_RELEASE_URL, function(data) {
    const asset = data.assets.filter(function(asset) {
      return !asset.name.toLowerCase().includes('sources');
    })[0];
    const cardElement = $('div#universal-installer-card');
    cardElement.find('div.card-body a.btn').attr('href', "https://sk1er.club/file_download?url="+asset.browser_download_url);
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
