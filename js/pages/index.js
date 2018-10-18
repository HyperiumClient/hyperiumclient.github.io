$(function() {
  const CONTRIBUTORS_URL = 'https://api.github.com/repos/HyperiumClient/Hyperium/contributors';

  fetchJson(CONTRIBUTORS_URL, function(data) {
    const contributors = data.filter(function(contributor) {
      return contributor.contributions >= 20;
    }).map(function(contributor) {
      return {name: contributor.login, profileUrl: contributor.html_url, avatarUrl: contributor.avatar_url, contributions: contributor.contributions};
    });

    const containerElement = document.getElementById('contributors-container');

    contributors.forEach(function(contributor) {
      const element = document.createElement('div');
      element.className = 'card';
      element.innerHTML = '<img class="card-img-top" width="100%" src="' + contributor.avatarUrl + '" alt="' + contributor.name + ' avatar" />'
        + '<div class="card-body">'
        + '<h5 class="card-title">' + contributor.name + '</h5>'
        + '<p class="card-text">Contributions: ' + contributor.contributions + '</p>'
        + '<a class="card-link" href="' + contributor.profileUrl + '">GitHub</a>'
        + '</div>';
      containerElement.appendChild(element);
    });
  });

  $('body').scrollspy({
    target: 'nav',
    offset:50
  });
});
