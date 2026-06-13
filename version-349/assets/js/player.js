(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-play]');
    var hlsInstance = null;
    var started = false;

    function startVideo() {
      if (!video) {
        return;
      }

      var url = video.getAttribute('data-hls');

      if (!url) {
        return;
      }

      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
        } else {
          video.src = url;
        }

        started = true;
      }

      video.controls = true;

      if (cover) {
        cover.classList.add('is-hidden');
      }

      var playTask = video.play();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          video.controls = true;
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          startVideo();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
