(function () {
    const HYPERIUM_LATEST_VERSION_URL = "https://api.hyperium.cc/versions";

    const showHyperiumLatestVersion = latestVersion => {
        document
            .querySelector("div#latest-jar-version-card a.mdc-button")
            .setAttribute(
                "href",
                "https://sk1er.club/file_download?url=https://static.sk1er.club/hyperium_files/Hyperium%20Universal%20Installer.jar"
            );
        let versionString = "Version " + latestVersion.build;
        versionString += " build " + latestVersion.id + "<br/><b>Requires Java 8!</b>";
        document.querySelector(
            "div#latest-jar-version-card .hyperium-card__secondary"
        ).innerHTML = versionString;
    };

    fetchJson(HYPERIUM_LATEST_VERSION_URL, (data, error) => {
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
})();
