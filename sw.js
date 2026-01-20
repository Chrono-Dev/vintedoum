self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("termo-cache").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./icon.jpeg"
      ])
    )
  );
});