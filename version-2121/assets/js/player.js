(function () {
    var video = document.getElementById('video-player');
    var playButton = document.getElementById('play-control');
    var hlsInstance = null;
    var initialized = false;

    function setButtonHidden(hidden) {
        if (playButton) {
            playButton.classList.toggle('is-hidden', hidden);
        }
    }

    function initPlayer() {
        if (!video || initialized) {
            return;
        }

        var source = video.getAttribute('data-src');

        if (!source) {
            return;
        }

        initialized = true;

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                    return;
                }

                if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                    return;
                }

                hlsInstance.destroy();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        }
    }

    async function playVideo() {
        initPlayer();

        if (!video) {
            return;
        }

        try {
            await video.play();
            setButtonHidden(true);
        } catch (error) {
            setButtonHidden(false);
        }
    }

    if (video) {
        initPlayer();
        video.addEventListener('play', function () {
            setButtonHidden(true);
        });
        video.addEventListener('pause', function () {
            setButtonHidden(false);
        });
        video.addEventListener('ended', function () {
            setButtonHidden(false);
        });
    }

    if (playButton) {
        playButton.addEventListener('click', playVideo);
    }

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
