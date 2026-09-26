# `assets/fonts/`

The identity is **Inter Tight** (display/UI) + **JetBrains Mono** (data/labels),
currently loaded from Google Fonts in `index.html`.

To self-host (recommended for production — removes a third-party request and a
render-blocking dependency):

1. Download the woff2 subsets (both are SIL Open Font License 1.1):
   * Inter Tight — https://fonts.google.com/specimen/Inter+Tight
   * JetBrains Mono — https://fonts.google.com/specimen/JetBrains+Mono
2. Put the `.woff2` files here.
3. Replace the `<link>` tags in `index.html` with `@font-face` rules in
   `styles/base.css` (`font-display: swap`).
4. The preloader waits on `document.fonts.ready`, so metrics-stable loading is
   already handled — no layout shift, no fake progress.

| Family         | Weights used        | Licence |
|----------------|---------------------|---------|
| Inter Tight    | 300, 400, 500, 600, 700 (+ italic 300/400) | SIL OFL 1.1 |
| JetBrains Mono | 400, 500            | SIL OFL 1.1 |
