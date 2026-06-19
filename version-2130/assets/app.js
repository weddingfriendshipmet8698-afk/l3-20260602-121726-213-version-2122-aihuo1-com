(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupNavigation() {
    var header = document.querySelector("[data-header]");
    var toggle = document.querySelector("[data-nav-toggle]");
    if (!header || !toggle) {
      return;
    }
    toggle.addEventListener("click", function () {
      header.classList.toggle("is-open");
    });
  }

  function setupSearchForms() {
    document.querySelectorAll(".site-search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function filterCards(panel) {
    var scopeId = panel.getAttribute("data-scope");
    var scope = scopeId ? document.getElementById(scopeId) : document;
    if (!scope) {
      return;
    }
    var input = panel.querySelector(".js-card-filter");
    var query = normalize(input ? input.value : "");
    var active = panel.querySelector(".filter-chip.is-active");
    var type = active ? active.getAttribute("data-filter-value") : "";
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-card"));
    var visible = 0;
    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var cardType = card.getAttribute("data-type") || "";
      var typeOk = !type || cardType.indexOf(type) !== -1;
      var queryOk = !query || text.indexOf(query) !== -1;
      var show = typeOk && queryOk;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });
    var empty = scope.parentElement ? scope.parentElement.querySelector("[data-empty-state]") : null;
    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  function setupFilters() {
    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var input = panel.querySelector(".js-card-filter");
      if (input) {
        input.addEventListener("input", function () {
          filterCards(panel);
        });
      }
      panel.querySelectorAll(".filter-chip").forEach(function (button) {
        button.addEventListener("click", function () {
          panel.querySelectorAll(".filter-chip").forEach(function (item) {
            item.classList.remove("is-active");
          });
          button.classList.add("is-active");
          filterCards(panel);
        });
      });
      filterCards(panel);
    });
  }

  function setupSearchPage() {
    var input = document.querySelector("[data-search-page-input]");
    var panel = document.querySelector("[data-search-page-panel]");
    if (!input || !panel) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    if (q) {
      input.value = q;
    }
    filterCards(panel);
  }

  function setupPlayers() {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("[data-play]");
      if (!video || !button) {
        return;
      }
      var streamUrl = video.getAttribute("data-video-url");
      var attached = false;
      function attach() {
        if (attached || !streamUrl) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          attached = true;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          video._hls = hls;
          attached = true;
          return;
        }
        video.src = streamUrl;
        attached = true;
      }
      function play() {
        attach();
        box.classList.add("is-started");
        video.controls = true;
        var run = video.play();
        if (run && typeof run.catch === "function") {
          run.catch(function () {});
        }
      }
      button.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!box.classList.contains("is-started")) {
          play();
        }
      });
    });
  }

  ready(function () {
    setupNavigation();
    setupSearchForms();
    setupHero();
    setupFilters();
    setupSearchPage();
    setupPlayers();
  });
})();
