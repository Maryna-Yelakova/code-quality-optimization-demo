/* JavaScript Code Quality + Optimization Demo
 */

/* =========================================================
   1) Naming + var usage
   ========================================================= */

// BAD: unclear function/variable names and var-scoped loop index.
function doIt(a) {
  for (var i = 0; i < a.length; i++) {
    console.log(a[i].n);
  }
}

// GOOD: descriptive naming + const/let for safer scoping.
function logUserNames(users) {
  for (let index = 0; index < users.length; index++) {
    console.log(users[index].name);
  }
}

/* =========================================================
   2) Repeated DOM queries in loops
   ========================================================= */

// BAD: querying DOM and mutating innerHTML repeatedly inside loop.
function renderListBad(items) {
  for (let i = 0; i < items.length; i++) {
    document.getElementById('result').innerHTML += '<li>' + items[i].name + '</li>';
  }
}

// GOOD: one lookup + DocumentFragment for efficient rendering.
function renderListGood(items) {
  const list = document.getElementById('result');
  if (!list) return;

  list.textContent = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name;
    fragment.appendChild(li);
  });

  list.appendChild(fragment);
}

/* =========================================================
   3) Unsafe string injection with innerHTML
   ========================================================= */

// BAD: untrusted data goes straight to innerHTML (XSS risk).
function showWelcomeBad(userInput) {
  document.getElementById('welcome').innerHTML = '<p>Welcome ' + userInput + '</p>';
}

// GOOD: use textContent for untrusted values.
function showWelcomeGood(userInput) {
  const welcome = document.getElementById('welcome');
  if (!welcome) return;

  const paragraph = document.createElement('p');
  paragraph.textContent = `Welcome ${userInput}`;

  welcome.textContent = '';
  welcome.appendChild(paragraph);
}

/* =========================================================
   4) Unnecessary polling
   ========================================================= */

// BAD: infinite polling with no lifecycle cleanup.
function startStatusPollingBad() {
  setInterval(() => {
    console.log('Checking status...');
  }, 1000);
}

// GOOD: event-driven updates + optional controlled interval cleanup.
function startStatusPollingGood() {
  const intervalId = setInterval(() => {
    console.log('Checking status...');
  }, 5000);

  // Example cleanup after 30 seconds.
  setTimeout(() => clearInterval(intervalId), 30000);
}

/* =========================================================
   5) Missing async error handling
   ========================================================= */

// BAD: no response validation and no error handling.
async function loadUsersBad() {
  const response = await fetch('/api/users');
  const users = await response.json();
  renderListGood(users);
}

// GOOD: checks response.ok and handles failures gracefully.
async function loadUsersGood() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const users = await response.json();
    renderListGood(users);
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

/* =========================================================
   6) Mutating function arguments
   ========================================================= */

// BAD: mutates input array (harder to reason about side effects).
function sortPricesBad(prices) {
  return prices.sort((a, b) => a - b);
}

// GOOD: copies first, then sorts immutably.
function sortPricesGood(prices) {
  return [...prices].sort((a, b) => a - b);
}

/* =========================================================
   7) Duplicate business logic
   ========================================================= */

// BAD: repeated discount calculation logic in multiple functions.
function getCartTotalBad(items) {
  let total = 0;
  items.forEach((item) => {
    if (item.vip) {
      total += item.price * 0.8;
    } else {
      total += item.price * 0.9;
    }
  });
  return total;
}

function getWishlistTotalBad(items) {
  let total = 0;
  items.forEach((item) => {
    if (item.vip) {
      total += item.price * 0.8;
    } else {
      total += item.price * 0.9;
    }
  });
  return total;
}

// GOOD: centralize logic in one reusable helper.
function calculateDiscountedPrice(item) {
  return item.vip ? item.price * 0.8 : item.price * 0.9;
}

function getTotalGood(items) {
  return items.reduce((sum, item) => sum + calculateDiscountedPrice(item), 0);
}
