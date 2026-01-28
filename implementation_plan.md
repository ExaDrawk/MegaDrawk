# MegaDrawk Expansion Master Plan: 30 Professional Tools
Target: Create a high-value, content-rich utility hub to ensure AdSense approval.
Strategy: "Utility as Content". Each tool provides genuine value, interactive elements, and substantial text content for SEO.

## Architecture
- **Route**: `/tools/[tool-slug]`
- **Layout**: Unified sidebar, breadcrumbs, related tools.
- **Components**: `ToolShell` (SEO wrapper), `ToolInput`, `ToolOutput`, `ToolReview` (Rich text description).

## The 30 Tools List

### Developer Utilities
1.  **JSON Validator & Formatter**: Error highlighting, collapsible tree view.
2.  **Base64 Encoder/Decoder**: File and text support, realtime.
3.  **JWT Debugger**: Decode tokens, visualize header/payload, expiration check.
4.  **SQL Formatter**: Prettify SQL queries, multiple dialects.
5.  **Regex Tester**: Realtime matching, cheat sheet sidebar.
6.  **URL Encoder/Decoder**: Handle complex query strings.
7.  **HTML Entity Encoder**: Escape/Unescape special characters.
8.  **Diff Checker**: Side-by-side text comparison with highlighting.
9.  **UUID/GUID Generator**: Bulk generation (v1, v4), copy formats.
10. **CRON Expression Generator**: Visual scheduler to cron string.

### Design & Color
11. **CSS Gradient Generator**: Visual stop editing, CSS code export.
12. **Contrast Checker (WCAG)**: Background/Foreground validation, AA/AAA scoring.
13. **Color Palette Generator**: Random harmony generation (Triadic, Analogous).
14. **Box Shadow Generator**: Layered shadows, visual preview, CSS snippet.
15. **PX to REM Converter**: Bidirectional, custom root font size.
16. **Aspect Ratio Calculator**: For images/video, common presets.

### Text & SEO
17. **Meta Tag Generator**: Preview Google/Social cards, generate HTML.
18. **Word & Character Counter**: Density analysis, reading time.
19. **Case Converter**: Camel, Snake, Kebab, Pascal, Constant naming.
20. **Lorem Ipsum Generator**: Paragraphs, sentences, lists, "Cyberpunk" mode.
21. **Slug Generator**: Clean URL creation from titles, multiligual support.

### Security & Crypto
22. **Password Generator**: High-entropy, custom character sets, strength meter.
23. **Hash Generator**: MD5, SHA-1, SHA-256, SHA-512 calculation.
24. **QR Code Generator**: Text/URL/WiFi, custom colors, download SVG/PNG.

### Productivity & Math
25. **Unit Converter (Universal)**: Length, Mass, Volume, Digital Storage.
26. **Pomodoro Timer**: Custom intervals, notifications, task tracking.
27. **World Time Meeting Planner**: Zone comparison, slot finding.
28. **Percentage Calculator**: "X is what % of Y", "X% off Y", etc.
29. **Loan/Mortgage Calculator**: Amortization schedule, charts.
30. **Markdown Previewer**: Live rendering, cheat sheet, HTML export.

## Execution Order
1.  **Skeleton**: Create `src/app/tools/layout.tsx` and `src/components/tools/ToolShell.tsx`.
2.  **Batch 1 (Dev)**: JSON, Base64, SQL, URL, Hash.
3.  **Batch 2 (Design)**: Colors, Gradients, Shadows.
4.  **Batch 3 (Text)**: Word Count, Lorem, Case, Slug.
...and so on.
