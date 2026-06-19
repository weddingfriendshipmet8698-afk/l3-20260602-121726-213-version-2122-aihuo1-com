(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var menu = document.querySelector('[data-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot'));
        show(index);
        play();
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', play);
    }

    show(0);
    play();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var scope = panel.parentElement;
      var list = scope ? scope.querySelector('[data-card-list]') : document.querySelector('[data-card-list]');
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .rank-row'));
      var input = panel.querySelector('[data-search-input]');
      var selects = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-select]'));

      selects.forEach(function (select) {
        var field = select.getAttribute('data-filter-select');
        var values = cards
          .map(function (card) {
            return card.getAttribute('data-' + field) || '';
          })
          .filter(Boolean)
          .filter(function (value, index, array) {
            return array.indexOf(value) === index;
          })
          .sort(function (a, b) {
            if (field === 'year') {
              return Number(b) - Number(a);
            }
            return a.localeCompare(b, 'zh-CN');
          });
        values.forEach(function (value) {
          var option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          select.appendChild(option);
        });
      });

      function filterCards() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var filters = {};
        selects.forEach(function (select) {
          filters[select.getAttribute('data-filter-select')] = select.value;
        });
        cards.forEach(function (card) {
          var content = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-category'),
            card.textContent
          ].join(' ').toLowerCase();
          var ok = !keyword || content.indexOf(keyword) !== -1;
          Object.keys(filters).forEach(function (field) {
            if (filters[field] && card.getAttribute('data-' + field) !== filters[field]) {
              ok = false;
            }
          });
          card.classList.toggle('is-filtered-out', !ok);
        });
      }

      if (input) {
        input.addEventListener('input', filterCards);
      }
      selects.forEach(function (select) {
        select.addEventListener('change', filterCards);
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
