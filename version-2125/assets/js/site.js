(function() {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupNav() {
    var button = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function() {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var wrap = document.querySelector("[data-hero]");
    if (!wrap) {
      return;
    }
    var slides = all(".hero-slide", wrap);
    var dots = all(".hero-dot", wrap);
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(Number(dot.getAttribute("data-slide")) || 0);
      });
    });
    if (slides.length > 1) {
      setInterval(function() {
        show(index + 1);
      }, 5200);
    }
  }

  function setupSearchAndSort() {
    var input = document.querySelector(".site-search");
    var select = document.querySelector(".site-sort");
    var list = document.querySelector(".searchable-list");
    if (!list) {
      return;
    }
    var cards = all(".movie-card", list);
    function filter() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function(card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        card.classList.toggle("is-filtered-out", keyword && haystack.indexOf(keyword) === -1);
      });
    }
    function sort() {
      var mode = select ? select.value : "rank";
      var sorted = cards.slice().sort(function(a, b) {
        if (mode === "year") {
          return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
        }
        if (mode === "title") {
          return (a.getAttribute("data-search") || "").localeCompare(b.getAttribute("data-search") || "", "zh-Hans-CN");
        }
        return Number(b.getAttribute("data-rank") || 0) - Number(a.getAttribute("data-rank") || 0);
      });
      sorted.forEach(function(card) {
        list.appendChild(card);
      });
      cards = sorted;
      filter();
    }
    if (input) {
      input.addEventListener("input", filter);
    }
    if (select) {
      select.addEventListener("change", sort);
      sort();
    }
  }

  window.initMoviePlayer = function(videoId, overlayId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var button = document.getElementById(buttonId);
    if (!video || !overlay) {
      return;
    }
    var ready = false;
    function bind() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }
    function play() {
      bind();
      overlay.classList.add("is-hidden");
      window.setTimeout(function() {
        var attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function() {});
        }
      }, 90);
    }
    overlay.addEventListener("click", play);
    if (button) {
      button.addEventListener("click", play);
    }
    video.addEventListener("click", function() {
      if (video.paused) {
        play();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function() {
    setupNav();
    setupHero();
    setupSearchAndSort();
  });
})();
