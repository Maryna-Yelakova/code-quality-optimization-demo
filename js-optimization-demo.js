/* JavaScript Frontend Optimization Demo

   Critical Rendering Path (CRP) context:
   - CRP is the sequence the browser follows to show pixels on screen:
     1) Parse HTML -> build DOM
     2) Parse CSS -> build CSSOM
     3) Build render tree
     4) Layout (geometry)
     5) Paint and composite
   - JavaScript can delay or repeat these stages when it:
     - blocks the main thread with long tasks,
     - forces frequent layout recalculations,
     - triggers excessive DOM updates/paints,
     - floods network requests that gate visible data.
   - This file focuses on JS decisions that shorten or protect CRP work:
     - Example 1 reduces repeated DOM parse/paint work.
     - Example 2 reduces CPU pressure during input, helping timely paints.
     - Example 3 avoids duplicate network latency before UI data appears.
     - Example 4 lowers listener overhead and improves event handling scalability.
     - Example 5 avoids repeated compute during render cycles.
     - Example 6 prevents layout thrashing (forced reflow).
     - Example 7 splits long tasks so rendering/input can continue between chunks.
*/

/* =========================================================
   1) Repeated heavy DOM updates
   ========================================================= */

// BAD:
// Appending to innerHTML on each iteration causes repeated DOM parsing + repaint work.
// With large lists, this creates many expensive updates instead of one batched update.
// Complexity impact in practice: "many DOM writes" -> noticeable jank.
function renderProductsBad(products) {
  const list = document.getElementById("products");
  if (list === null) return;

  for (let i = 0; i < products.length; i++) {
    list.innerHTML += "<li>" + products[i].title + "</li>";
  }
}

// GOOD (fixed):
// Build one HTML string in memory and assign innerHTML once.
// This turns repeated DOM writes into a single DOM write, which is much faster.
// Same output, less work for the rendering engine.
function renderProductsGood(products) {
  const list = document.getElementById("products");
  if (list === null) return;

  const html = products.map((product) => "<li>" + product.title + "</li>").join("");
  list.innerHTML = html;
}

/* =========================================================
   2) Expensive filtering on every keypress
   ========================================================= */

// BAD:
// Every keypress triggers the full filter operation immediately.
// Fast typists can generate many events per second, stacking expensive computations.
// Result: input lag and unnecessary repeated work.
function searchBad(items, query) {
  return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
}

// GOOD (fixed):
// Debounce waits for a short pause before running the expensive search.
// This reduces computation bursts and keeps typing responsive.
// Useful for search bars, auto-complete, live filtering, and resize handlers.
function debounce(fn, delayMs) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delayMs);
  };
}

const searchGood = debounce((items, query, onResult) => {
  const normalized = query.toLowerCase();
  const result = items.filter((item) => item.name.toLowerCase().includes(normalized));
  onResult(result);
}, 250);

/* =========================================================
   3) Duplicate API calls for same data
   ========================================================= */

// BAD:
// Re-fetching the same user data wastes bandwidth and time.
// It also increases backend load and can produce inconsistent timing in UI.
async function getUserBad(userId) {
  const response = await fetch("/api/users/" + userId);
  return response.json();
}

// GOOD (fixed):
// Cache in-flight/completed requests by userId.
// If the same user is requested again, return the cached Promise instead of making
// another network request.
// Important detail: remove cache entry on failure so future retries are possible.
const userRequestCache = new Map();

function getUserGood(userId) {
  if (userRequestCache.has(userId)) {
    return userRequestCache.get(userId);
  }

  const request = fetch("/api/users/" + userId)
    .then((response) => {
      if (response.ok === false) {
        throw new Error("Failed user fetch: " + response.status);
      }
      return response.json();
    })
    .catch((error) => {
      userRequestCache.delete(userId);
      throw error;
    });

  userRequestCache.set(userId, request);
  return request;
}

/* =========================================================
   4) Too many event listeners
   ========================================================= */

// BAD:
// Attaching one listener per button increases memory usage and setup cost.
// In long/virtualized lists, this scales poorly and complicates cleanup.
function bindRowButtonsBad() {
  const buttons = document.querySelectorAll(".row button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Clicked", button.dataset.id);
    });
  });
}

// GOOD (fixed):
// Use one listener on a stable parent container and detect clicked child buttons.
// This scales to many rows and still works for dynamically added elements.
// Lower memory overhead and easier lifecycle management.
function bindRowButtonsGood() {
  const container = document.getElementById("rows");
  if (container === null) return;

  container.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLButtonElement === false) return;
    if (target.matches(".row button") === false) return;

    console.log("Clicked", target.dataset.id);
  });
}

/* =========================================================
   5) Recalculating values every render
   ========================================================= */

// BAD:
// Recomputes the same total every time, even when items did not change.
// In frequent re-renders this repeats unnecessary O(n) work.
function calculateCartTotalBad(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// GOOD (fixed):
// Compute a stable cache key from relevant item fields.
// If key already exists, return cached total immediately.
// Tradeoff to teach: caching speeds repeats but uses memory and requires key strategy.
const cartTotalCache = new Map();

function calculateCartTotalGood(items) {
  const cacheKey = JSON.stringify(items.map((item) => [item.id, item.price, item.quantity]));
  if (cartTotalCache.has(cacheKey)) {
    return cartTotalCache.get(cacheKey);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalCache.set(cacheKey, total);
  return total;
}

/* =========================================================
   6) Layout thrashing (read/write interleaving)
   ========================================================= */

// BAD:
// Reading layout (offsetWidth) and then writing style in the same iteration can
// trigger layout thrashing (forced synchronous reflow).
// Repeating this across many elements hurts frame rate.
function resizeCardsBad() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const width = card.offsetWidth;
    card.style.height = String(width * 0.6) + "px";
  });
}

// GOOD (fixed):
// Batch all layout reads first, then apply all writes.
// This avoids repeated read/write oscillation and lets the browser optimize layout work.
function resizeCardsGood() {
  const cards = Array.from(document.querySelectorAll(".card"));
  const widths = cards.map((card) => card.offsetWidth);

  cards.forEach((card, index) => {
    card.style.height = String(widths[index] * 0.6) + "px";
  });
}

/* =========================================================
   7) Blocking main thread with large synchronous work
   ========================================================= */

// BAD:
// Large synchronous loops block the main thread.
// While blocked, the browser cannot paint, respond to clicks, or process input smoothly.
function processItemsBad(items) {
  const out = [];
  for (let i = 0; i < items.length; i++) {
    out.push(items[i] * 2);
  }
  return out;
}

// GOOD (fixed):
// Break work into chunks and yield between chunks via setTimeout(0).
// This keeps UI responsive and allows painting/input between processing slices.
// Teaching note: this pattern is a simple stepping stone before Web Workers.
function processItemsGood(items, onChunk, onDone, chunkSize = 1000) {
  let index = 0;
  const out = [];

  function runChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (let i = index; i < end; i++) {
      out.push(items[i] * 2);
    }

    index = end;
    onChunk(out.length);

    if (index < items.length) {
      setTimeout(runChunk, 0);
    } else {
      onDone(out);
    }
  }

  runChunk();
}
