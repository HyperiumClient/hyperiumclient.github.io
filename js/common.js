function fetchJson(url, callback) {
  const httpRequest = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
  httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
              callback(JSON.parse(httpRequest.responseText));
          } else {
              callback(undefined, new Error(httpRequest.statusText));
          }
      }
  };
  httpRequest.open("GET", url);
  httpRequest.send();
}

(function () {
  document
      .querySelectorAll(".mdc-button, .mdc-list-item")
      .forEach(el => new mdc.ripple.MDCRipple(el));
  const topAppBar = new mdc.topAppBar.MDCTopAppBar(
      document.querySelector(".mdc-top-app-bar")
  );
  const drawer = mdc.drawer.MDCDrawer.attachTo(
      document.querySelector(".mdc-drawer")
  );

  drawer.foundation_.handleScrimClick = () => {
      drawer.open = !drawer.open;
  };
  topAppBar.listen("MDCTopAppBar:nav", () => {
      drawer.open = !drawer.open;
  });
})();
