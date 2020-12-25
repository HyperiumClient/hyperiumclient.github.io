(function () {
  const MODS_URL = "https://raw.githubusercontent.com/HyperiumClient/hyperiumclient.github.io/master/mods.json";

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
