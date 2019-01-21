(function() {
  const CONTRIBUTORS_URL =
    "https://api.github.com/repos/HyperiumClient/Hyperium/contributors";
  const sumContributions = contributors =>
    contributors.map(c => c.contributions).reduce((p, n) => p + n);

  fetchJson(CONTRIBUTORS_URL, (data, error) => {
    let contributors = [];
    if (error) {
      const cachedArray = localStorage.getItem("contributors");
      if (cachedArray && cachedArray.length > 0) {
        contributors = JSON.parse(cachedArray);
      }
    } else {
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
      element.classList.add("mdc-layout-grid__cell");
      element.classList.add("mdc-layout-grid__cell--span-4-phone");
      element.classList.add("mdc-layout-grid__cell--span-4-tablet");
      element.classList.add("mdc-layout-grid__cell--span-2-desktop");
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
})();
