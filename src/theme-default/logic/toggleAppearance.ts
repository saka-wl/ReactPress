const classList = document.documentElement.classList;
const APPEARANCE_KEY = 'rpress_appearance';

const setClassList = (isDark = false) => {
  if (isDark) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
};

const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'light' ? false : true);
};

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  window.addEventListener('storage', updateAppearance);
}

/**
 * 深色浅色模式转变
 */
export function toggle() {
  if (classList.contains('dark')) {
    setClassList(false);
    localStorage.setItem(APPEARANCE_KEY, 'light');
  } else {
    setClassList(true);
    localStorage.setItem(APPEARANCE_KEY, 'dark');
  }
}

export function checkTheTheme() {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'light' ? false : true);
}
