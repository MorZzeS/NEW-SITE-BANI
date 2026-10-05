export type Theme = 'dark' | 'light'

export function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light'
}

// Runs in <head> before paint, including when storage access is blocked.
export const themeScript = `(function(){
  var theme=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  try { var saved=localStorage.getItem('banger-theme'); if(saved==='light'||saved==='dark') theme=saved; } catch(e) {}
  document.documentElement.setAttribute('data-theme',theme);
})();`
