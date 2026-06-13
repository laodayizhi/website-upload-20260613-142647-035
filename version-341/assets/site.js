(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = 'search.html';
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  var timer;

  function activateHero(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startHero() {
    if (slides.length < 2) return;
    timer = window.setInterval(function () {
      activateHero(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      window.clearInterval(timer);
      activateHero(index);
      startHero();
    });
  });

  activateHero(0);
  startHero();

  var pageSearch = document.getElementById('pageSearch');
  var typeFilter = document.getElementById('typeFilter');
  var yearFilter = document.getElementById('yearFilter');
  var regionFilter = document.getElementById('regionFilter');
  var emptyState = document.getElementById('emptyState');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');

  if (pageSearch && initialQuery) {
    pageSearch.value = initialQuery;
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) return;
    var keyword = normalize(pageSearch && pageSearch.value);
    var type = normalize(typeFilter && typeFilter.value);
    var year = normalize(yearFilter && yearFilter.value);
    var region = normalize(regionFilter && regionFilter.value);
    var visible = 0;

    cards.forEach(function (card) {
      var keys = normalize(card.getAttribute('data-keys'));
      var cardType = normalize(card.getAttribute('data-type'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardRegion = normalize(card.getAttribute('data-region'));
      var matched = true;

      if (keyword && keys.indexOf(keyword) === -1) matched = false;
      if (type && cardType.indexOf(type) === -1) matched = false;
      if (year && cardYear !== year) matched = false;
      if (region && cardRegion.indexOf(region) === -1) matched = false;

      card.classList.toggle('is-hidden-card', !matched);
      if (matched) visible += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  [pageSearch, typeFilter, yearFilter, regionFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  applyFilters();
})();
