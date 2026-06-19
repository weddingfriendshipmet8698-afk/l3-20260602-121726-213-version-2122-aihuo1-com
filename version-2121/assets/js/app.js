(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
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

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var searchInput = document.getElementById('library-search');
    var filterList = document.querySelector('[data-filter-list]');

    function applyFilter(value) {
        if (!filterList) {
            return;
        }

        var keyword = value.trim().toLowerCase();
        var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            var haystack = (card.getAttribute('data-keywords') || '').toLowerCase();
            card.style.display = haystack.indexOf(keyword) === -1 ? 'none' : '';
        });
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        searchInput.value = query;
        applyFilter(query);

        searchInput.addEventListener('input', function () {
            applyFilter(searchInput.value);
        });
    }
})();
