import { H as Hls } from './hls-vendor-dru42stk.js';

var video = document.getElementById('movie-player');
var startButton = document.querySelector('[data-player-start]');

function playVideo() {
  if (!video) {
    return;
  }

  var source = video.getAttribute('data-src');

  if (!source) {
    return;
  }

  if (startButton) {
    startButton.classList.add('is-hidden');
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.play().catch(function () {});
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(function () {});
    });
    return;
  }

  video.src = source;
  video.play().catch(function () {});
}

if (startButton) {
  startButton.addEventListener('click', playVideo);
}

if (video) {
  video.addEventListener('play', function () {
    if (!video.currentSrc) {
      playVideo();
    }
  }, { once: true });
}
