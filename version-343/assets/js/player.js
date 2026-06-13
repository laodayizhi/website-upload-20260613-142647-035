function initMoviePlayer(source) {
  document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('[data-player-cover]');
    var button = document.querySelector('[data-play-button]');
    var status = document.querySelector('[data-player-status]');
    var attached = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text || '';
      }
    }

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            setStatus('播放暂时无法加载，请稍后再试');
          }
        });
      } else {
        video.src = source;
      }
    }

    function startPlayback() {
      attachSource();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          setStatus('点击播放按钮即可开始观看');
        });
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }
    if (cover) {
      cover.addEventListener('click', startPlayback);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
      setStatus('');
    });
    video.addEventListener('error', function () {
      setStatus('播放暂时无法加载，请稍后再试');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
}
