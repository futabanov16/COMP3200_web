window.HELP_IMPROVE_VIDEOJS = false;

// Nav scroll effect
window.addEventListener('scroll', function () {
  var nav = document.getElementById('siteNav');
  var scrollBtn = document.querySelector('.scroll-to-top');

  if (nav) {
    nav.classList.toggle('scrolled', window.pageYOffset > 50);
  }
  if (scrollBtn) {
    scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
  }
});

// Mobile nav toggle
function toggleNav() {
  var links = document.getElementById('navLinks');
  if (links) links.classList.toggle('show');
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy BibTeX
function copyBibTeX() {
  var el = document.getElementById('bibtex-code');
  var btn = document.querySelector('.copy-bibtex-btn');
  var txt = btn ? btn.querySelector('.copy-text') : null;

  if (!el) return;

  navigator.clipboard.writeText(el.textContent).then(function () {
    if (btn) btn.classList.add('copied');
    if (txt) txt.textContent = 'Copied!';
    setTimeout(function () {
      if (btn) btn.classList.remove('copied');
      if (txt) txt.textContent = 'Copy';
    }, 2000);
  }).catch(function () {
    var ta = document.createElement('textarea');
    ta.value = el.textContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (btn) btn.classList.add('copied');
    if (txt) txt.textContent = 'Copied!';
    setTimeout(function () {
      if (btn) btn.classList.remove('copied');
      if (txt) txt.textContent = 'Copy';
    }, 2000);
  });
}

// Gallery filter
document.addEventListener('DOMContentLoaded', function () {
  var filters = document.querySelectorAll('.gallery-filter');
  var items = document.querySelectorAll('.gallery-item');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      filters.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      items.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Heatmap coloring
  colorHeatmap();

  // Video autoplay on scroll
  setupVideoAutoplay();

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      var links = document.getElementById('navLinks');
      if (links) links.classList.remove('show');
    });
  });
});

function colorHeatmap() {
  var table = document.getElementById('prototypeHeatmap');
  if (!table) return;

  var rows = table.querySelectorAll('tbody tr');
  rows.forEach(function (row) {
    if (row.classList.contains('heatmap-divider')) return;
    var cells = row.querySelectorAll('td');
    cells.forEach(function (cell, i) {
      if (i === 0) return;
      var val = parseFloat(cell.textContent);
      if (isNaN(val)) return;

      var r, g, b;
      if (val < 0.2) {
        r = 248; g = 250; b = 252;
      } else if (val < 0.4) {
        r = 219; g = 234; b = 254;
      } else if (val < 0.6) {
        r = 147; g = 197; b = 253;
      } else if (val < 0.8) {
        r = 96; g = 165; b = 250;
      } else {
        r = 37; g = 99; b = 235;
      }
      cell.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
      if (val >= 0.6) cell.style.color = 'white';
      if (val >= 0.6) cell.style.fontWeight = '700';
    });
  });
}

function setupVideoAutoplay() {
  var videos = document.querySelectorAll('.gallery-item video, .teaser-video-wrap video');
  if (!videos.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.play().catch(function () {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.3 });

  videos.forEach(function (v) { observer.observe(v); });
}
