(function() {
  const UNIVERSAL_INSTALLER_RELEASE_URL =
    "https://api.github.com/repos/HyperiumClient/Installer/releases/latest";
  const HYPERIUM_LATEST_VERSION_URL = "https://api.hyperium.cc/versions";

  function showHyperiumLatestVersion(latestVersion) {
    document
      .querySelector("div#latest-version-card a.mdc-button")
      .setAttribute(
        "href",
        "https://sk1er.club/file_download?url=" + latestVersion.url
      );
    let versionString = "Version " + latestVersion.build;
    versionString += " build " + latestVersion.id;
    document.querySelector(
      "div#latest-version-card .hyperium-card__secondary"
    ).textContent = versionString;
  }

  fetchJson(HYPERIUM_LATEST_VERSION_URL, function(data, error) {
    if (error) {
      const cachedObject = localStorage.getItem("hyperiumLatestVersion");
      if (cachedObject && cachedObject.length > 0) {
        showHyperiumLatestVersion(JSON.parse(cachedObject));
      }
      return;
    }
    localStorage.setItem("hyperiumLatestVersion", JSON.stringify(data.latest));
    showHyperiumLatestVersion(data.latest);
  });

  function showUniversalInstallerRelease(asset) {
    document
      .querySelector("div#universal-installer-card a.mdc-button")
      .setAttribute(
        "href",
        "https://sk1er.club/file_download?url=" + asset.browser_download_url
      );
    let versionString = "Version " + asset.tag_name + " of ";
    versionString += formatDate(new Date(asset.published_at));
    document.querySelector(
      "div#universal-installer-card .hyperium-card__secondary"
    ).textContent = versionString;
  }

  fetchJson(UNIVERSAL_INSTALLER_RELEASE_URL, function(data, error) {
    if (error) {
      const cachedObject = localStorage.getItem("universalInstallerRelease");
      if (cachedObject && cachedObject.length > 0) {
        showUniversalInstallerRelease(JSON.parse(cachedObject));
      }
      return;
    }
    const asset = data.assets.filter(function(asset) {
      return !asset.name.toLowerCase().includes("sources");
    })[0];
    asset.tag_name = data.tag_name;
    asset.published_at = data.published_at;
    localStorage.setItem("universalInstallerRelease", JSON.stringify(asset));
    showUniversalInstallerRelease(asset);
  });

  function formatDate(date) {
    return date.toLocaleDateString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
})();
