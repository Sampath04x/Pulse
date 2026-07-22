// hooks/useTheme.js
import { useEffect } from 'react';

export function useTheme(theme) {
  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-ashoka', 'theme-brightpath');
    if (theme) document.body.classList.add(theme);
  }, [theme]);
}
