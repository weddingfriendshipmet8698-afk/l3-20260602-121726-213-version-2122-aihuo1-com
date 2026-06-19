(function () {
    function setupPlayer(box) {
        var video = box.querySelector('video');
        var overlay = box.querySelector('.player-overlay');
        var button = box.querySelector('.player-start');
        var src = box.getAttribute('data-video');
        var started = false;
        var hls = null;

        function play() {
            if (!video || !src) {
                return;
            }
            if (!started) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else {
                    video.src = src;
                }
                video.setAttribute('controls', 'controls');
                started = true;
            }
            box.classList.add('is-playing');
            var request = video.play();
            if (request && typeof request.catch === 'function') {
                request.catch(function () {
                    box.classList.remove('is-playing');
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', play);
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                play();
            });
        }
        if (video) {
            video.addEventListener('play', function () {
                box.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.currentTime) {
                    box.classList.remove('is-playing');
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hls && typeof hls.destroy === 'function') {
                    hls.destroy();
                }
            });
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
