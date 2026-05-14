# Kotoka no Shizuku LP

GitHub repository for the initial landing page of `古都華の雫`.

## Current Scope

- Desktop: 3-column layout with fixed left and right columns, center-only scrolling.
- Mobile: single-column LP experience.
- Japanese top page at `/`.
- English page at `/en/`.
- AI-generated hero visual and placeholder product visual, both replaceable.
- Shopify or external EC links can be added later.

## Local Preview

```bash
python3 -m http.server 8081
```

Open `http://localhost:8081/`.

## Key Files

- `index.html`: Japanese LP.
- `en/index.html`: English LP.
- `assets/styles.css`: Layout, responsive behavior, animations.
- `assets/app.js`: Section reveal and chapter navigation state.
- `assets/images/hero-kotoka-japan.png`: AI-generated hero visual.
- `assets/images/product-jar-placeholder.png`: Temporary product visual.

## Replacement Notes

- Replace `assets/images/product-jar-placeholder.png` when final product photography arrives.
- Replace purchase links in `index.html` and `en/index.html` when Shopify or another EC destination is finalized.
- Keep exact product and food-label details in the EC/product details area rather than the hero copy.
