function fetchJson(url, callback) {
  var httpRequest = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) {
          callback(data);
        }
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.send();
}

$(function() {
  $('a[data-scroll-to="true"]').click(function(event) {
    event.preventDefault();
    const element = $(this);
    const targetId = element.attr("href");
    const targetElement = $(targetId);
    //From: https://stackoverflow.com/a/39494245
    var startingY = window.pageYOffset;
    var diff = (targetElement.offset().top - 25) - startingY;
    var start;
    window.requestAnimationFrame(function step(timestamp) {
      if (!start)
        start = timestamp;
      var time = timestamp - start;
      var percent = Math.min(time / 300, 1);
      window.scrollTo(0, startingY + diff * percent);
      if (time < 300) {
        window.requestAnimationFrame(step);
      }
    });
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('SW: working with scope ', registration.scope);
    }).catch(function(err) {
      console.log('SW: registration failed ', err);
    });
  }
});
