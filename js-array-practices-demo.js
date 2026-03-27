/* JavaScript Arrays: BAD vs GOOD (fixed)
 */

/* =========================================================
   1) Mutating original arrays by accident
   ========================================================= */

// BAD: sort() mutates the original array (side effect).
function sortScoresBad(scores) {
  return scores.sort((a, b) => a - b);
}

// GOOD (fixed): clone first, then sort immutably.
function sortScoresGood(scores) {
  return [...scores].sort((a, b) => a - b);
}

/* =========================================================
   2) Using map() for side effects
   ========================================================= */

// BAD: map() is for transforming into a new array, not side effects.
function logUsersBad(users) {
  users.map((user) => console.log(user.name));
}

// GOOD (fixed): use forEach() for side effects.
function logUsersGood(users) {
  users.forEach((user) => console.log(user.name));
}

/* =========================================================
   3) Manual loops instead of expressive methods
   ========================================================= */

// BAD: verbose loop for filtering active users.
function getActiveUsersBad(users) {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].isActive) {
      result.push(users[i]);
    }
  }
  return result;
}

// GOOD (fixed): clearer intent with filter().
function getActiveUsersGood(users) {
  return users.filter((user) => user.isActive);
}

/* =========================================================
   4) O(n^2) lookup patterns
   ========================================================= */

// BAD: nested loops create quadratic time for matching ids.
function mergeByIdBad(users, profiles) {
  const merged = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < profiles.length; j++) {
      if (users[i].id === profiles[j].userId) {
        merged.push({ ...users[i], profile: profiles[j] });
      }
    }
  }
  return merged;
}

// GOOD (fixed): build index map once, then do O(1) lookups.
function mergeByIdGood(users, profiles) {
  const profileByUserId = new Map(profiles.map((p) => [p.userId, p]));
  return users
    .filter((user) => profileByUserId.has(user.id))
    .map((user) => ({ ...user, profile: profileByUserId.get(user.id) }));
}

/* =========================================================
   5) Incorrect reduce() initialization
   ========================================================= */

// BAD: missing initial value can fail on empty arrays.
function sumPricesBad(items) {
  return items.reduce((sum, item) => sum + item.price);
}

// GOOD (fixed): explicit initial value is safe and predictable.
function sumPricesGood(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

/* =========================================================
   6) Chaining multiple passes unnecessarily
   ========================================================= */

// BAD: filter + map + reduce means 3 array passes.
function totalVipBad(users) {
  return users
    .filter((u) => u.vip)
    .map((u) => u.points)
    .reduce((sum, points) => sum + points, 0);
}

// GOOD (fixed): single reduce pass.
function totalVipGood(users) {
  return users.reduce((sum, user) => {
    if (user.vip) return sum + user.points;
    return sum;
  }, 0);
}

/* =========================================================
   7) Fragile equality checks in arrays
   ========================================================= */

// BAD: == can coerce values and hide bugs.
function containsIdBad(ids, targetId) {
  return ids.some((id) => id == targetId);
}

// GOOD (fixed): strict equality avoids type coercion surprises.
function containsIdGood(ids, targetId) {
  return ids.some((id) => id === targetId);
}

/* =========================================================
   8) Wrong method for existence checks
   ========================================================= */

// BAD: find() returns object/undefined, then converted to boolean.
function hasOutOfStockBad(products) {
  return Boolean(products.find((p) => p.stock === 0));
}

// GOOD (fixed): some() communicates boolean intent directly.
function hasOutOfStockGood(products) {
  return products.some((p) => p.stock === 0);
}
