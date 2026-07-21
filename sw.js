const CACHE_NAME = "child-contact-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=5",
  "./script.js?v=5",
  "./manifest.webmanifest",
  "./assets/logo.svg",
  "./assets/kakao.svg",
  "./assets/wechat.svg",
  "./assets/phone.svg",
  "./assets/location.svg",
  "./assets/copy.svg",
  "./assets/favicon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./images/wechat-qr.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
