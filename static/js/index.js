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

// Install guide modal
function showInstallGuide() {
  document.getElementById('installModal').classList.add('show');
}

function closeInstallGuide(e) {
  if (!e || e.target === e.currentTarget) {
    document.getElementById('installModal').classList.remove('show');
  }
}

function copyCmd() {
  var text = document.getElementById('installCmd').textContent;
  var btn = document.querySelector('.copy-cmd-btn');
  navigator.clipboard.writeText(text).then(function () {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(function () { btn.innerHTML = '<i class="fas fa-copy"></i>'; }, 2000);
  });
}

// (legacy) Download installer bat
function downloadInstaller() {
  var script = [
    '@echo off',
    'setlocal',
    'title X2CNet Interactive Demo - One-Click Installer',
    'echo ============================================',
    'echo   X2CNet Real-Time Interactive Demo',
    'echo   One-Click Installer',
    'echo ============================================',
    'echo.',
    '',
    'set "INSTALL_DIR=%USERPROFILE%\\Interactive_Ameca"',
    '',
    'echo [1/3] Checking Python...',
    'python --version >nul 2>&1',
    'if errorlevel 1 (',
    '    echo ERROR: Python not found. Install Python 3.10+ from https://python.org',
    '    pause',
    '    exit /b 1',
    ')',
    'echo       OK',
    '',
    'echo [2/3] Cloning repository...',
    'if exist "%INSTALL_DIR%\\realtime_mimicry.py" (',
    '    echo       Found existing install, updating...',
    '    cd /d "%INSTALL_DIR%" && git pull',
    ') else (',
    '    git clone https://github.com/futabanov16/Interactive_Ameca.git "%INSTALL_DIR%"',
    '    cd /d "%INSTALL_DIR%"',
    ')',
    'echo       OK',
    '',
    'echo [3/3] Running setup (install deps + download weights ~1.3GB)...',
    'call "%INSTALL_DIR%\\setup.bat"',
    '',
    'echo.',
    'echo ============================================',
    'echo   Starting demo...',
    'echo   Keep a straight face for calibration!',
    'echo ============================================',
    'echo.',
    'call "%INSTALL_DIR%\\run.bat"',
  ].join('\r\n');

  var blob = new Blob([script], { type: 'application/octet-stream' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'install_x2cnet_demo.bat';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Launch interactive demo
function launchInteractive() {
  var btn = document.querySelector('.interactive-btn');
  var origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
  btn.disabled = true;

  fetch('/launch', { method: 'POST' })
    .then(function (res) {
      if (res.ok) {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Demo Launched';
        btn.style.background = '#10b981';
        setTimeout(function () {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    })
    .catch(function () {
      btn.innerHTML = origHTML;
      btn.disabled = false;
      alert('Please start the website via:\n  python server.py');
    });
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
