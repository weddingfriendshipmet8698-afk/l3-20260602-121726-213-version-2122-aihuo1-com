(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-local-filter]').forEach(function (filter) {
    var queryInput = filter.querySelector('[data-filter-query]');
    var yearSelect = filter.querySelector('[data-filter-year]');
    var regionSelect = filter.querySelector('[data-filter-region]');
    var scope = filter.parentElement;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

    function applyFilter() {
      var query = (queryInput && queryInput.value || '').trim().toLowerCase();
      var year = yearSelect && yearSelect.value || '';
      var region = regionSelect && regionSelect.value || '';

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();

        var matchedQuery = !query || haystack.indexOf(query) !== -1;
        var matchedYear = !year || card.getAttribute('data-year') === year;
        var matchedRegion = !region || card.getAttribute('data-region') === region;
        card.classList.toggle('is-hidden-by-filter', !(matchedQuery && matchedYear && matchedRegion));
      });
    }

    [queryInput, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });
})();
