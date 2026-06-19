export function initMoviePlayer(Hls, source) {
    var video = document.querySelector(".movie-video");
    var button = document.querySelector(".play-overlay");
    if (!video || !button || !source) {
        return;
    }

    var hls = null;
    var ready = false;

    function attach() {
        if (ready) {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            ready = true;
            return;
        }
        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            ready = true;
        }
    }

    function play() {
        attach();
        button.classList.add("is-hidden");
        video.controls = true;
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {
                button.classList.remove("is-hidden");
            });
        }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener("play", function () {
        button.classList.add("is-hidden");
    });
    video.addEventListener("ended", function () {
        button.classList.remove("is-hidden");
    });
    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
        }
    });
}
