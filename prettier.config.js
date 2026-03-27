/** @type {import("prettier").Config} */
const config = {
  // Keep lines readable in typical laptop/editor widths.
  printWidth: 100,
  // Use 2 spaces (common frontend convention).
  tabWidth: 2,
  // Prefer spaces instead of tabs.
  useTabs: false,
  // Always end statements with semicolons.
  semi: true,
  // Use single quotes in JS/TS where possible.
  singleQuote: true,
  // Keep trailing commas where valid in ES5+ (helps cleaner diffs).
  trailingComma: 'es5',
  // Include spaces inside object literal braces: { a: 1 }.
  bracketSpacing: true,
  // Put closing > of multi-line JSX elements on its own line.
  bracketSameLine: false,
  // Always include parentheses around arrow function parameters.
  arrowParens: 'always',
  // Respect existing line ending style in the file.
  endOfLine: 'lf'
};

export default config;
