(function () {
    const CONTRIBUTORS_URL =
        "https://api.github.com/repos/HyperiumClient/Hyperium/contributors";
    const MODS_URL = "https://raw.githubusercontent.com/HyperiumClient/hyperiumclient.github.io/master/mods.json";

    fetchJson(CONTRIBUTORS_URL, (data, error) => {
        let contributors = [];
        if (error) {
            const cachedArray = localStorage.getItem("contributors");
            if (cachedArray && cachedArray.length > 0) {
                contributors = JSON.parse(cachedArray);
            }
        } else {
            const sumContributions = contributors =>
                contributors.map(c => c.contributions).reduce((p, n) => p + n);
            const arithmeticAverage = sumContributions(data) / data.length;
            const minimumContributions = arithmeticAverage * 0.8;
            contributors = data
                .filter(
                    contributor => contributor.contributions >= minimumContributions
                )
                .map(contributor => ({
                    name: contributor.login,
                    profileUrl: contributor.html_url,
                    avatarUrl: contributor.avatar_url,
                    contributions: contributor.contributions
                }));
        }

        localStorage.setItem("contributors", JSON.stringify(contributors));

        const containerElement = document.getElementById("contributors-container");

        contributors.forEach(contributor => {
            const element = document.createElement("div");
            element.classList.add("mdc-layout-grid__cell", "mdc-layout-grid__cell--span-4-phone", "mdc-layout-grid__cell--span-4-tablet", "mdc-layout-grid__cell--span-2-desktop");
            element.innerHTML = `<div class="mdc-card"><div class="mdc-card__media mdc-card__media--square" style="background-image: url('${
                contributor.avatarUrl
            }');"></div><div class="hyperium-card__primary"><h2 class="hyperium-card__title mdc-typography--headline6">${
                contributor.name
            }</h2><h3 class="hyperium-card__subtitle mdc-typography--subtitle2">${
                contributor.contributions
            } contributions</h3></div><div class="mdc-card__actions mdc-card__actions--full-bleed">
      <a class="mdc-button mdc-card__action mdc-card__action--button" href="${
                contributor.profileUrl
            }"><span class="mdc-button__label">GitHub</span></a></div></div>`;

            containerElement.appendChild(element);
        });
    });

    fetchJson(MODS_URL, (data, error) => {
        let mods = data;
        if (error) {
            const cachedArray = localStorage.getItem("mods");
            if (cachedArray && cachedArray.length > 0) {
                mods = JSON.parse(cachedArray);
            }
        }

        if (!mods || mods.length === 0) {
            console.error("Error while loading mods list");
            return;
        }

        const modsList = document.querySelector("ul.mods-list");

        mods.forEach((mod, index) => {
            const element = document.createElement("li");
            element.classList.add("mdc-image-list__item");

            const description = typeof mod.description !== "string"
                ? mod.description.join("<br/>")
                : mod.description;
            let html = `<div class="mdc-card">
                <div class="hyperium-card__primary">
                    <h2 class="hyperium-card__title mdc-typography--headline6">
                        ${mod.name}
                    </h2>
                </div>
                <div class="hyperium-card__secondary mdc-typography--body2">
                    ${description}
                </div>`;

            if (mod.original && mod.original.trim().length > 0) {
                html += `<div class="mdc-card__actions">
                    <a class="mdc-button mdc-card__action mdc-card__action--button" href="${mod.original}">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Credits</span>
                    </a>
                </div>`;
            }

            html += "</div>";
            element.innerHTML = html;
            modsList.appendChild(element);
            setTimeout(() => element.classList.add("show"), index * 50);
        });

        modsList
            .querySelectorAll(".mdc-button")
            .forEach(el => new mdc.ripple.MDCRipple(el));
        document.querySelector("div.loading-cell").remove();
    });
})();
