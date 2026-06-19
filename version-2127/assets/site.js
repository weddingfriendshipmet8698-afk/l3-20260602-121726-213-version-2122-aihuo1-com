(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function makeHit(item) {
        var link = document.createElement("a");
        link.className = "search-hit";
        link.href = item.url;

        var img = document.createElement("img");
        img.src = item.poster;
        img.alt = item.title;
        img.loading = "lazy";

        var copy = document.createElement("span");
        var title = document.createElement("strong");
        title.textContent = item.title;
        var meta = document.createElement("small");
        meta.textContent = item.region + " · " + item.type + " · " + item.year;
        copy.appendChild(title);
        copy.appendChild(meta);
        link.appendChild(img);
        link.appendChild(copy);
        return link;
    }

    function searchItems(query, limit) {
        var data = window.siteSearchIndex || [];
        var q = String(query || "").trim().toLowerCase();
        if (!q) {
            return [];
        }
        var results = [];
        for (var i = 0; i < data.length; i += 1) {
            var item = data[i];
            var text = [item.title, item.region, item.type, item.year, item.genre, item.category].join(" ").toLowerCase();
            if (text.indexOf(q) !== -1) {
                results.push(item);
                if (results.length >= limit) {
                    break;
                }
            }
        }
        return results;
    }

    function initMenus() {
        var toggle = document.querySelector(".menu-toggle");
        var mobile = document.querySelector(".mobile-nav");
        if (!toggle || !mobile) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = mobile.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function initHeaderSearch() {
        var boxes = document.querySelectorAll(".site-search");
        boxes.forEach(function (box) {
            var input = box.querySelector(".site-search-input");
            var panel = box.querySelector(".search-panel");
            if (!input || !panel) {
                return;
            }
            input.addEventListener("input", function () {
                var hits = searchItems(input.value, 10);
                panel.innerHTML = "";
                if (!input.value.trim()) {
                    panel.classList.remove("is-open");
                    return;
                }
                if (!hits.length) {
                    var empty = document.createElement("div");
                    empty.className = "search-empty";
                    empty.textContent = "没有找到相关影片";
                    panel.appendChild(empty);
                } else {
                    hits.forEach(function (item) {
                        panel.appendChild(makeHit(item));
                    });
                }
                panel.classList.add("is-open");
            });
            document.addEventListener("click", function (event) {
                if (!box.contains(event.target)) {
                    panel.classList.remove("is-open");
                }
            });
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var prev = slider.querySelector(".hero-control.prev");
        var next = slider.querySelector(".hero-control.next");
        var index = 0;
        var timer;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
                slide.querySelectorAll(".mini-dot").forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initFilters() {
        var scopes = document.querySelectorAll("[data-filter-scope]");
        scopes.forEach(function (scope) {
            var input = scope.querySelector(".filter-input");
            var select = scope.querySelector(".filter-select");
            var section = scope.closest("section");
            var cards = section ? section.querySelectorAll(".library-card") : document.querySelectorAll(".library-card");

            function apply() {
                var q = input ? input.value.trim().toLowerCase() : "";
                var selected = select ? select.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var text = [
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.year,
                        card.dataset.genre,
                        card.dataset.category
                    ].join(" ").toLowerCase();
                    var typeText = [card.dataset.type, card.dataset.category].join(" ").toLowerCase();
                    var matchedText = !q || text.indexOf(q) !== -1;
                    var matchedType = !selected || typeText.indexOf(selected) !== -1;
                    card.classList.toggle("is-filter-hidden", !(matchedText && matchedType));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (select) {
                select.addEventListener("change", apply);
            }
        });
    }

    function initSearchPage() {
        var box = document.getElementById("search-page-results");
        var input = document.getElementById("search-page-input");
        if (!box) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q") || "";
        if (input) {
            input.value = q;
        }
        box.innerHTML = "";
        if (!q.trim()) {
            var start = document.createElement("div");
            start.className = "article-card";
            start.textContent = "请输入关键词开始搜索影片。";
            box.appendChild(start);
            return;
        }
        var hits = searchItems(q, 120);
        if (!hits.length) {
            var empty = document.createElement("div");
            empty.className = "article-card";
            empty.textContent = "没有找到相关影片。";
            box.appendChild(empty);
            return;
        }
        hits.forEach(function (item) {
            var link = document.createElement("a");
            link.className = "movie-card";
            link.href = item.url;
            link.innerHTML = "<span class=\"poster-wrap\"><img src=\"" + item.poster + "\" alt=\"" + item.title.replace(/\"/g, "&quot;") + "\" loading=\"lazy\"><span class=\"poster-shade\"></span><span class=\"poster-badge\">" + item.type + "</span></span><span class=\"card-body\"><strong>" + item.title + "</strong><span class=\"card-meta\">" + item.region + " · " + item.year + "</span><span class=\"card-desc\">" + item.genre + "</span><span class=\"card-foot\">进入详情</span></span>";
            box.appendChild(link);
        });
    }

    ready(function () {
        initMenus();
        initHeaderSearch();
        initHero();
        initFilters();
        initSearchPage();
    });
}());
