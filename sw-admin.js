const CACHE_NAME = 'minerva-supervisor-v1';
const ASSETS = [
  './',
  './admin.html',
  './images/logominerva.png',
  // Adicione aqui outros arquivos locais (CSS, JS) se houver, mas NUNCA o link da API Google
];

// Instalação do Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// INTERCEPTAÇÃO DE REQUISIÇÕES (O segredo do erro está aqui)
self.addEventListener('fetch', e => {
  // Se a requisição for para o Google Scripts API, IGNORE o service worker e vá direto para a internet
  if (e.request.url.includes('script.google.com')) {
    return; // Não faz nada, deixa o navegador lidar nativamente
  }

  // Para o restante dos arquivos do site, usa a estratégia de Cache com retorno da rede
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Retorno caso o app esteja offline
        return new Response("Você está offline.");
      });
    })
  );
});
