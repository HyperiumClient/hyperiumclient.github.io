(function() {
    const CHANGELOG_URL = "https://raw.githubusercontent.com/HyperiumClient/hyperiumclient.github.io/master/changelog.json";

    const createTitleGridElement = title => {
        const gridElement = document.createElement("div");
        gridElement.classList.add("mdc-layout-grid__inner");
        gridElement.innerHTML =
            '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-2-desktop ' +
            'dc-layout-grid__cell--span-4-phone mdc-layout-grid__cell--span-4-tablet title-cell">' +
            `<h2 class="mdc-typography--headline3">${title}</h2>` +
            "<hr/></div>";
        return gridElement;
    };

    const createGridCellWithCard = (title, description) => {
        const gridCell = document.createElement("div");
        gridCell.classList.add("mdc-layout-grid__cell");
        gridCell.innerHTML =
            '<div class="mdc-card">' +
            '<div class="hyperium-card__primary">' +
            '<h2 class="hyperium-card__title mdc-typography--headline6">' +
            title +
            '</h2></div><div class="hyperium-card__secondary mdc-typography--body2">' +
            (typeof description === "string"
                ? description
                : description.join("<br/>")) +
            "</div></div>";
        return gridCell;
    };

    const createChangesGridElement = changes => {
        const gridElement = document.createElement("div");
        gridElement.classList.add("mdc-layout-grid__inner");
        gridElement.innerHTML =
            '<div class="mdc-layout-grid__cell container-cell">' +
            '<div class="mdc-layout-grid__inner two-columns"></div></div>';
        const columnsGrid = gridElement.querySelector(
            "div.mdc-layout-grid__inner.two-columns"
        );
        changes.forEach(change =>
            columnsGrid.appendChild(
                createGridCellWithCard(change.title, change.description)
            )
        );
        return gridElement;
    };

    const showHyperiumChangelog = changelog => {
        const sectionsContainer = document.getElementById("changelog-sections");
        const elements = Object.keys(changelog).map(sectionTitle => {
            const sectionElement = document.createElement("section");
            sectionElement.id = sectionTitle.toLowerCase();

            const gridElement = document.createElement("div");
            gridElement.classList.add("mdc-layout-grid");
            gridElement.appendChild(createTitleGridElement(sectionTitle));
            gridElement.appendChild(
                createChangesGridElement(changelog[sectionTitle])
            );

            sectionElement.appendChild(gridElement);
            return sectionElement;
        });

        sectionsContainer.querySelector("section").remove();
        elements.forEach((element, index) => {
            sectionsContainer.appendChild(element);
            setTimeout(() => element.classList.add("show"), index * 200);
        });
    };

    fetchJson(CHANGELOG_URL, (data, error) => {
        if (error) {
            const cachedObject = localStorage.getItem("hyperiumChangelog");
            if (cachedObject && cachedObject.length > 0) {
                showHyperiumChangelog(JSON.parse(cachedObject));
            }
            return;
        }
        localStorage.setItem("hyperiumChangelog", JSON.stringify(data));
        showHyperiumChangelog(data);
    });
})();
