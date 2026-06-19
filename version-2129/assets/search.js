(function () {
  var root = document.querySelector('[data-global-search]');
  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');

  if (!root || !results || !window.MOVIE_SEARCH_DATA) {
    return;
  }

  var input = root.querySelector('[data-search-input]');
  var category = root.querySelector('[data-search-category]');
  var year = root.querySelector('[data-search-year]');
  var region = root.querySelector('[data-search-region]');
  var params = new URLSearchParams(window.location.search);

  if (params.get('q')) {
    input.value = params.get('q');
  }

  function card(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-wrap" href="' + movie.url + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-badge">' + escapeHtml(movie.year) + '</span>',
      '    <span class="play-mask">立即观看</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + movie.tags.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
      '    <div class="card-meta"><a href="' + movie.categoryUrl + '">' + escapeHtml(movie.categoryName) + '</a><span>' + escapeHtml(movie.region) + '</span></div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[character];
    });
  }

  function applySearch() {
    var query = (input.value || '').trim().toLowerCase();
    var selectedCategory = category.value;
    var selectedYear = year.value;
    var selectedRegion = region.value;
    var matched = window.MOVIE_SEARCH_DATA.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.oneLine,
        movie.tags.join(' '),
        movie.categoryName
      ].join(' ').toLowerCase();

      return (!query || haystack.indexOf(query) !== -1)
        && (!selectedCategory || movie.categorySlug === selectedCategory)
        && (!selectedYear || movie.year === selectedYear)
        && (!selectedRegion || movie.region === selectedRegion);
    });

    var limited = matched.slice(0, 120);
    results.innerHTML = limited.map(card).join('');

    if (summary) {
      summary.textContent = '找到 ' + matched.length + ' 条结果，当前展示前 ' + limited.length + ' 条。';
    }
  }

  [input, category, year, region].forEach(function (control) {
    control.addEventListener('input', applySearch);
    control.addEventListener('change', applySearch);
  });

  applySearch();
})();
