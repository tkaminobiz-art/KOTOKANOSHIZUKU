# Kotoka no Shizuku LP

Production landing page for `古都華の雫`.

## Current Scope

- Production LP at `/`, based on the selected Plan B design.
- Recipe page at `/recipe/`.
- `/mobile-b/` redirects to `/` for backward-compatible preview links.
- Former A/C/English pages have been removed from public navigation.
- Shopify or another external EC link can be added later.

## Local Preview

```bash
python3 -m http.server 8090
```

Open `http://localhost:8090/`.

## Key Files

- `index.html`: Production Plan B LP.
- `recipe/index.html`: Recipe page.
- `assets/mobile-b.css`: Production LP styling.
- `assets/recipe.css`: Recipe page styling.
- `REMOVED_PAGE_COPY_NOTES.md`: Reusable product facts and copy notes extracted from removed A/C pages.

## Replacement Notes

- Replace `assets/images/product-jar-placeholder.png` when final product photography arrives.
- Replace `mailto:info@example.com` purchase/contact links when Shopify or another EC destination is finalized.
- Strengthen the bag-included gift appeal once real bag, box, and bottle photography is available.
