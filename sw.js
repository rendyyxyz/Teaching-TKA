/* Decrypting proxy for the four-subject TKA site. Key lives in memory only. */
'use strict';

var KEY = null;
var NAME_RAW = null;

var MIME = {
  "html": "text/html; charset=utf-8",
  "css": "text/css; charset=utf-8",
  "js": "text/javascript; charset=utf-8",
  "json": "application/json; charset=utf-8",
  "png": "image/png",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "gif": "image/gif",
  "svg": "image/svg+xml",
  "webp": "image/webp",
  "ico": "image/x-icon",
  "xml": "application/xml; charset=utf-8",
  "txt": "text/plain; charset=utf-8",
  "md": "text/markdown; charset=utf-8",
  "mp3": "audio/mpeg",
  "mp4": "video/mp4",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "wav": "audio/wav"
};

function b64ToBytes(str) {
  var raw = atob(str), out = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
async function importKey(b64) {
  return crypto.subtle.importKey('raw', b64ToBytes(b64), 'AES-GCM', false, ['decrypt']);
}
async function importHmacKey(bytes) {
  return crypto.subtle.importKey('raw', bytes, { name: 'HMAC', hash: 'SHA-256' },
                                 false, ['sign']);
}
async function nameFor(sitePath) {
  if (!NAME_RAW) return null;
  var k = await importHmacKey(NAME_RAW);
  var sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(sitePath));
  var hex = '', b = new Uint8Array(sig);
  for (var i = 0; i < b.length; i++) hex += b[i].toString(16).padStart(2, '0');
  return hex.slice(0, 40);
}

// GitHub Pages serves from a subpath (/Teaching-TKA/), so every absolute path
// must resolve against the worker's own scope, never the origin root.
var SCOPE = new URL(self.registration.scope).pathname;
var SITE_PREFIX = SCOPE + 's/';
var ENC_PREFIX = SCOPE + '_enc/';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.type !== 'key') return;
  e.waitUntil((async function () {
    KEY = await importKey(d.enc);
    NAME_RAW = b64ToBytes(d.name);
    var cs = await self.clients.matchAll({ type: 'window' });
    cs.forEach(function (c) { c.postMessage({ type: 'ready' }); });
  })());
});

async function decryptResponse(blobBuf, mime) {
  var iv = new Uint8Array(blobBuf, 0, 12);
  var tag = new Uint8Array(blobBuf, 12, 16);
  var body = new Uint8Array(blobBuf, 28);
  var both = new Uint8Array(body.length + tag.length);
  both.set(body, 0); both.set(tag, body.length);
  var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv, tagLength: 128 },
                                          KEY, both);
  return new Response(plain, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf(SITE_PREFIX) !== 0) return;

  e.respondWith((async function () {
    if (!KEY) return Response.redirect(SCOPE, 302);

    var rel = url.pathname.slice(SCOPE.length);      // "s/fisika/lessons/x.html"
    // Directory URLs resolve to index.html, exactly like a static server.
    var lookup = rel.endsWith('/') ? rel + 'index.html' : rel;
    var hashed = await nameFor(lookup);
    var res = await fetch(ENC_PREFIX + hashed, { cache: 'no-store' });

    if (!res.ok && !lookup.endsWith('index.html') && !lookup.includes('.')) {
      // A bare path with no extension may be a directory: try its index.html.
      var alt = lookup + '/index.html';
      var altHash = await nameFor(alt);
      var altRes = await fetch(ENC_PREFIX + altHash, { cache: 'no-store' });
      if (altRes.ok) { lookup = alt; res = altRes; }
    }
    if (!res.ok) {
      return new Response('Tidak ditemukan', {
        status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    var ext = (lookup.split('.').pop() || '').toLowerCase();
    return decryptResponse(await res.arrayBuffer(), MIME[ext] || 'application/octet-stream');
  })());
});
