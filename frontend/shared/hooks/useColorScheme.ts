import { useEffect, useState } from 'react';

export function useColorScheme(): 'light' | 'dark' {
  const getScheme = () =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [scheme, setScheme] = useState<'light' | 'dark'>(getScheme());

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => setScheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return scheme;
}
