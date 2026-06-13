document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.top-nav');
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  var backTop = document.querySelector('[data-back-top]');

  function updateNav() {
    if (!nav) {
      return;
    }
    if (window.scrollY > 40) {
      nav.classList.add('nav-solid');
    } else {
      nav.classList.remove('nav-solid');
    }
    if (backTop) {
      backTop.classList.toggle('is-visible', window.scrollY > 500);
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  if (menuButton && mobileMenu && nav) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
      nav.classList.toggle('menu-open', mobileMenu.classList.contains('is-open'));
    });
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function setSlide(nextIndex) {
    if (!slides.length) {
      return;
    }
    currentSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, index) {
      slide.classList.toggle('is-active', index === currentSlide);
    });
    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(currentSlide + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-card-filter]');
  var regionSelect = document.querySelector('[data-region-filter]');
  var typeSelect = document.querySelector('[data-type-filter]');
  var cardGrid = document.querySelector('[data-card-grid]');

  function filterCards() {
    if (!cardGrid) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var region = regionSelect ? regionSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var cards = Array.prototype.slice.call(cardGrid.querySelectorAll('.movie-card'));
    cards.forEach(function (card) {
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var genre = (card.getAttribute('data-genre') || '').toLowerCase();
      var cardRegion = card.getAttribute('data-region') || '';
      var cardType = card.getAttribute('data-type') || '';
      var keywordMatch = !keyword || title.indexOf(keyword) !== -1 || genre.indexOf(keyword) !== -1;
      var regionMatch = !region || cardRegion.indexOf(region) !== -1;
      var typeMatch = !type || cardType.indexOf(type) !== -1;
      card.style.display = keywordMatch && regionMatch && typeMatch ? '' : 'none';
    });
  }

  [filterInput, regionSelect, typeSelect].forEach(function (element) {
    if (element) {
      element.addEventListener('input', filterCards);
      element.addEventListener('change', filterCards);
    }
  });

  var searchRoot = document.querySelector('[data-search-root]');
  if (searchRoot && window.MOVIE_INDEX) {
    var searchInput = document.querySelector('[data-search-input]');
    var searchRegion = document.querySelector('[data-search-region]');
    var searchType = document.querySelector('[data-search-type]');
    var results = document.querySelector('[data-search-results]');

    function renderSearch() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var region = searchRegion ? searchRegion.value : '';
      var type = searchType ? searchType.value : '';
      var matched = window.MOVIE_INDEX.filter(function (movie) {
        var text = [movie.title, movie.genre, movie.tags, movie.one_line].join(' ').toLowerCase();
        var queryMatch = !query || text.indexOf(query) !== -1;
        var regionMatch = !region || movie.region.indexOf(region) !== -1;
        var typeMatch = !type || movie.type.indexOf(type) !== -1;
        return queryMatch && regionMatch && typeMatch;
      }).slice(0, 80);

      if (!results) {
        return;
      }
      if (!matched.length) {
        results.innerHTML = '<div class="empty-note">暂无匹配内容</div>';
        return;
      }
      results.innerHTML = matched.map(function (movie) {
        return '<article class="movie-card">' +
          '<a class="movie-poster" href="./movie/' + movie.slug + '.html" aria-label="' + escapeHtml(movie.title) + '">' +
          '<img src="./' + movie.cover + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<span class="movie-year">' + escapeHtml(movie.year) + '</span>' +
          '</a>' +
          '<div class="movie-card-body">' +
          '<div class="movie-meta-row"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
          '<h3><a href="./movie/' + movie.slug + '.html">' + escapeHtml(movie.title) + '</a></h3>' +
          '<p>' + escapeHtml(movie.one_line) + '</p>' +
          '<div class="tag-list"><span>' + escapeHtml(movie.genre || '精选') + '</span></div>' +
          '</div>' +
          '</article>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    [searchInput, searchRegion, searchType].forEach(function (element) {
      if (element) {
        element.addEventListener('input', renderSearch);
        element.addEventListener('change', renderSearch);
      }
    });
    renderSearch();
  }
});
