(function () {
    var body = document.body;
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            var opened = mobileNav.classList.toggle('is-open');
            body.classList.toggle('nav-open', opened);
            menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (slides.length > 1) {
            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                    start();
                });
            });
            if (prev) {
                prev.addEventListener('click', function () {
                    show(active - 1);
                    start();
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    show(active + 1);
                    start();
                });
            }
            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
            start();
        }
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
    filterForms.forEach(function (form) {
        var scopeSelector = form.getAttribute('data-filter-form');
        var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
        var empty = document.querySelector(form.getAttribute('data-empty-target') || '');
        var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select'));

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function apply() {
            var keyword = normalize(form.querySelector('[data-filter-keyword]') && form.querySelector('[data-filter-keyword]').value);
            var region = normalize(form.querySelector('[data-filter-region]') && form.querySelector('[data-filter-region]').value);
            var type = normalize(form.querySelector('[data-filter-type]') && form.querySelector('[data-filter-type]').value);
            var year = normalize(form.querySelector('[data-filter-year]') && form.querySelector('[data-filter-year]').value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre')
                ].join(' '));
                var matched = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (region && normalize(card.getAttribute('data-region')) !== region) {
                    matched = false;
                }
                if (type && normalize(card.getAttribute('data-type')) !== type) {
                    matched = false;
                }
                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    matched = false;
                }
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        inputs.forEach(function (input) {
            input.addEventListener('input', apply);
            input.addEventListener('change', apply);
        });
        apply();
    });

    var backTop = document.querySelector('[data-back-top]');
    if (backTop) {
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('is-visible', window.scrollY > 360);
        });
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
