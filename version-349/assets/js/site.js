(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 6200);
  }

  var searchForms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  searchForms.forEach(function (form) {
    var input = form.querySelector('[data-search-input]');
    var region = form.querySelector('[data-region-filter]');
    var genre = form.querySelector('[data-genre-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(input && input.value);
      var regionValue = normalize(region && region.value);
      var genreValue = normalize(genre && genre.value);

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year')
        ].join(' '));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var cardGenre = normalize(card.getAttribute('data-genre'));
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (regionValue && cardRegion.indexOf(regionValue) === -1) {
          matched = false;
        }

        if (genreValue && cardGenre.indexOf(genreValue) === -1) {
          matched = false;
        }

        card.classList.toggle('hide-card', !matched);
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (region) {
      region.addEventListener('change', applyFilter);
    }

    if (genre) {
      genre.addEventListener('change', applyFilter);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });
  });
})();
