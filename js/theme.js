// Apple Dark / Light Mode Switcher & Manager (Icon Only)
(function() {
  const THEME_KEY = 'apple_design_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      const icon = btn.querySelector('.theme-icon') || btn;
      if (theme === 'dark') {
        icon.innerHTML = '&#9728;&#65039;'; // Sun icon
        btn.setAttribute('title', 'Modo Claro (Día)');
        btn.setAttribute('aria-label', 'Modo Claro');
      } else {
        icon.innerHTML = '&#127769;'; // Moon icon
        btn.setAttribute('title', 'Modo Oscuro (Noche)');
        btn.setAttribute('aria-label', 'Modo Oscuro');
      }
    });
  }

  window.toggleAppleTheme = function() {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  // Immediate execution before DOM render to prevent theme flicker
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Listen for OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.addEventListener('click', window.toggleAppleTheme);
    });
  });
})();
