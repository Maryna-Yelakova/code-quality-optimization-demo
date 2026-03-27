/* JavaScript Web APIs: BAD vs GOOD (fixed)
   Teaching focus: safe async handling, cleanup, performance, and browser best practices. */

/* =========================================================
   1) fetch() without status check
   ========================================================= */

// BAD: assumes response is always OK.
async function loadPostsBad() {
  const response = await fetch('/api/posts');
  return response.json();
}

// GOOD (fixed): validate response and handle errors clearly.
async function loadPostsGood() {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error(`Failed to load posts: ${response.status}`);
  }
  return response.json();
}

/* =========================================================
   2) Missing request cancellation
   ========================================================= */

// BAD: request keeps running even if user navigates away.
async function searchUsersBad(query) {
  const response = await fetch(`/api/users?query=${encodeURIComponent(query)}`);
  return response.json();
}

// GOOD (fixed): abort previous request when starting a new one.
let searchController;
async function searchUsersGood(query) {
  if (searchController) {
    searchController.abort();
  }

  searchController = new AbortController();
  const response = await fetch(`/api/users?query=${encodeURIComponent(query)}`, {
    signal: searchController.signal
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

/* =========================================================
   3) localStorage without parse safety
   ========================================================= */

// BAD: crashes on invalid JSON.
function loadSettingsBad() {
  return JSON.parse(localStorage.getItem('settings'));
}

// GOOD (fixed): safe parse with fallback defaults.
function loadSettingsGood() {
  const raw = localStorage.getItem('settings');
  if (raw === null) return { theme: 'light', pageSize: 20 };

  try {
    return JSON.parse(raw);
  } catch {
    return { theme: 'light', pageSize: 20 };
  }
}

/* =========================================================
   4) Event listeners without cleanup
   ========================================================= */

// BAD: anonymous handler cannot be removed later.
function registerResizeBad() {
  window.addEventListener('resize', () => {
    console.log('Resize');
  });
}

// GOOD (fixed): keep handler reference for proper cleanup.
function onResize() {
  console.log('Resize');
}
function registerResizeGood() {
  window.addEventListener('resize', onResize);
}
function unregisterResizeGood() {
  window.removeEventListener('resize', onResize);
}

/* =========================================================
   5) setInterval without lifecycle control
   ========================================================= */

// BAD: interval runs forever.
function startClockBad() {
  setInterval(() => {
    console.log(new Date().toISOString());
  }, 1000);
}

// GOOD (fixed): return stop function to control lifecycle.
function startClockGood() {
  const id = setInterval(() => {
    console.log(new Date().toISOString());
  }, 1000);

  return () => clearInterval(id);
}

/* =========================================================
   6) Geolocation without error callback/options
   ========================================================= */

// BAD: no error handling and default options only.
function getPositionBad(onSuccess) {
  navigator.geolocation.getCurrentPosition(onSuccess);
}

// GOOD (fixed): include error callback and options.
function getPositionGood(onSuccess, onError) {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  });
}

/* =========================================================
   7) Blocking UI with synchronous Web Storage writes
   ========================================================= */

// BAD: writing huge payload to localStorage in one sync operation.
function saveLargeDataBad(data) {
  localStorage.setItem('big-data', JSON.stringify(data));
}

// GOOD (fixed): schedule non-urgent write for idle time.
function saveLargeDataGood(data) {
  const serialized = JSON.stringify(data);
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      localStorage.setItem('big-data', serialized);
    });
  } else {
    setTimeout(() => {
      localStorage.setItem('big-data', serialized);
    }, 0);
  }
}

/* =========================================================
   8) postMessage without origin check
   ========================================================= */

// BAD: accepts messages from any origin.
function listenMessagesBad(handler) {
  window.addEventListener('message', (event) => {
    handler(event.data);
  });
}

// GOOD (fixed): verify trusted origin before using data.
function listenMessagesGood(handler) {
  const trustedOrigin = 'https://example.com';
  window.addEventListener('message', (event) => {
    if (event.origin !== trustedOrigin) return;
    handler(event.data);
  });
}
