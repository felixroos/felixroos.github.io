import { useTheme } from 'next-themes';
import React from 'react';

const ThemeSwitch = (): JSX.Element => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  // After mounting, we have access to the theme
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }
  return (
    <button
      className="theme-button px-4 text-2xl"
      type="button"
      title="Toggle Dark Mode"
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '🌙' : '🌞'}
    </button>
  );
};

export default ThemeSwitch;
