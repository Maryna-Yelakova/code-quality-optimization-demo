/* JavaScript Objects: BAD vs GOOD (fixed)
 */

/* =========================================================
   1) Mutating shared objects directly
   ========================================================= */

// BAD: mutates the original user object.
function updateUserNameBad(user, newName) {
  user.name = newName;
  return user;
}

// GOOD (fixed): return a new object (immutable update).
function updateUserNameGood(user, newName) {
  return { ...user, name: newName };
}

/* =========================================================
   2) Unsafe deep property access
   ========================================================= */

// BAD: crashes if profile or address is missing.
function getCityBad(user) {
  return user.profile.address.city;
}

// GOOD (fixed): optional chaining + fallback.
function getCityGood(user) {
  return user.profile?.address?.city ?? "Unknown city";
}

/* =========================================================
   3) for...in without own-property check
   ========================================================= */

// BAD: may iterate inherited properties too.
function copyPropsBad(source) {
  const result = {};
  for (const key in source) {
    result[key] = source[key];
  }
  return result;
}

// GOOD (fixed): iterate only own enumerable entries.
function copyPropsGood(source) {
  return Object.fromEntries(Object.entries(source));
}

/* =========================================================
   4) Using objects as maps with prototype risks
   ========================================================= */

// BAD: plain object map can collide with inherited keys.
function countWordsBad(words) {
  const counts = {};
  words.forEach((word) => {
    counts[word] = (counts[word] || 0) + 1;
  });
  return counts;
}

// GOOD (fixed): Map is safer for dynamic key collections.
function countWordsGood(words) {
  const counts = new Map();
  words.forEach((word) => {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  });
  return counts;
}

/* =========================================================
   5) Repeating nested updates manually
   ========================================================= */

// BAD: manual nested mutation is verbose and error-prone.
function updateThemeBad(settings, newTheme) {
  settings.ui.theme = newTheme;
  return settings;
}

// GOOD (fixed): immutable nested update with spread.
function updateThemeGood(settings, newTheme) {
  return {
    ...settings,
    ui: {
      ...settings.ui,
      theme: newTheme
    }
  };
}

/* =========================================================
   6) Blind merge that overwrites with undefined
   ========================================================= */

// BAD: undefined values can accidentally erase valid fields.
function mergePatchBad(target, patch) {
  return { ...target, ...patch };
}

// GOOD (fixed): ignore undefined values during merge.
function mergePatchGood(target, patch) {
  const safePatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  );
  return { ...target, ...safePatch };
}

/* =========================================================
   7) Inefficient key existence checks
   ========================================================= */

// BAD: creates array of keys first, then checks includes().
function hasFieldBad(obj, field) {
  return Object.keys(obj).includes(field);
}

// GOOD (fixed): direct own-property check.
function hasFieldGood(obj, field) {
  return Object.hasOwn(obj, field);
}

/* =========================================================
   8) JSON clone for object copying
   ========================================================= */

// BAD: JSON clone loses Dates, functions, undefined, Map, Set, etc.
function cloneConfigBad(config) {
  return JSON.parse(JSON.stringify(config));
}

// GOOD (fixed): structuredClone preserves more built-in types safely.
function cloneConfigGood(config) {
  return structuredClone(config);
}
