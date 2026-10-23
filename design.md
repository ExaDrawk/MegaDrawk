# MEGADRAWK design

## Direction

A small developer's published product index. The primary job is to find an app and open its store listing. Modern minimal, quiet and practical. No marketing hero, oversized repeated wordmark, fabricated numbers, cards, badges, gradients, paper textures or ornamental motion.

## Structure

A compact header, a short introduction, a single column of app icons and store descriptions, then a small light footer. Home and About share ProjectList. The empty blog remains available through navigation; it does not become a promotional panel on the home page. Profile and goal copy are preserved on About.

## Tokens and typography

The source of truth is tokens.css: near-white with a trace of cool blue, dark slate text, restrained blue links and visible light dividers. No yellow, beige or grey-brown paper tone. Text colors target at least 7:1 contrast on the base surface. IBM Plex Sans pairs with Noto Sans JP; system monospace is restricted to generated code. All fonts are served locally. At 320px product icons reduce from 64px to 48px, while copy remains readable and actions remain touch sized.

## Interaction

No scroll reveals, card lifts, marquees or load animation. Links use an underline on hover and a visible focus outline. Menu closes with Escape, outside click, focus exit or viewport change. Reduced motion remains supported. Store links have explicit labels and safe new-tab attributes.

## Verification

Playwright covers 320, 375, 414, 768 and 1280px. Axe checks applicable A/AA/AAA rules, including enhanced contrast; this is automated evidence, not a claim of full WCAG AAA conformance. Final review includes actual screenshots, keyboard flows, broken-image and overflow checks.
