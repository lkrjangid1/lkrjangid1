// Applies the saved theme before first paint. Loaded synchronously in <head>; external so CSP can stay script-src 'self'.
try {
  var t = localStorage.getItem('lj-theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) {}
// The home splash plays once per browser session; site.ts records that it has been seen.
try {
  if (sessionStorage.getItem("lj-splash")) document.documentElement.classList.add("splash-seen");
} catch (e) {}
