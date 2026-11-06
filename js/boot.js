/* Catch the browser install offer as early as possible. */
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__bip=e;window.dispatchEvent(new Event("ek-bip"));});
