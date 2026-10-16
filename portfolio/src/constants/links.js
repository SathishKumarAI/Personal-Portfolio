/**
 * The one place the GitHub account name is written.
 *
 * Deliberately NOT re-exported by `index.js`. It is an implementation detail
 * of the files that build URLs from it — a rename is one edit here — and
 * exporting it would widen this directory's public API for no caller.
 */
export const GH = "https://github.com/SathishKumarAI";
