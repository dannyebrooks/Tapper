# TapFlow Assets

Generated visual assets for the TapFlow hyper-casual mobile game.
All assets live in `/home/team/shared/assets/`.

## File Inventory

### Design System
| File | Description |
|------|-------------|
| `tapflow-design-system.md` | Full design system: colors, gradients, spacing, typography, animations, skins |
| `tapflow-variables.css` | Ready-to-use CSS custom properties — drop into `:root` |

### Visual Assets
| File | Size | Description |
|------|------|-------------|
| `tapflow-logo.png` | 1024×1024 | Game logo — glowing cyan "TapFlow" text with water-drop motif |
| `player-orb-cyan.png` | 1024×1024 | Default player skin — glowing cyan energy orb |
| `player-rare-skins.png` | 1024×1024 | 3 premium skins: Neon Rose, Gold Rush, Void Walker (IAP) |
| `background-game.png` | 1536×1024 | Game background — deep space gradient with particles |
| `obstacle-designs.png` | 1024×1024 | 4 obstacle types: triangle, diamond, hexagon, wall-gap |
| `ui-gameplay-mockup.png` | 1024×1536 | Gameplay screenshot mockup (phone portrait) |
| `promo-app-store.png` | 1536×1024 | App store promotional art (landscape) |

## Quick Start for Developer

1. **Copy CSS variables** into your game:
   ```html
   <link rel="stylesheet" href="assets/tapflow-variables.css">
   ```
   Or paste `tapflow-variables.css` contents into your stylesheet.

2. **Player orb** — reference `player-orb-cyan.png` as the default orb sprite.
   CSS glow equivalent: `box-shadow: 0 0 20px rgba(0, 212, 255, 0.4)`

3. **Background** — use `background-game.png` as the game world backdrop.
   CSS equivalent: `background: linear-gradient(180deg, #0B0F1C 0%, #131A2E 100%)`

4. **Obstacles** — reference `obstacle-designs.png` for shape inspiration.
   CSS triangles: `border-bottom: 28px solid #FF4757; border-left/right: 16px solid transparent;`

5. **Logo** — `tapflow-logo.png` for splash screen and app icon.

## Color Summary

```
Player (safe)    → #00D4FF (cyan)
Obstacles        → #FF4757 (red)  
Background       → #0B0F1C (deep navy)
UI Panels        → rgba(19, 26, 46, 0.9)
Text Primary     → #FFFFFF
Text Secondary   → #8892B0
Power-ups        → #7C5CFC (purple)
Success          → #2ED573 (green)
Warning          → #FFA502 (orange)
```

## Skin System (for IAP)

| Skin | Color | Rarity |
|------|-------|--------|
| Cyan Flow | #00D4FF | Default (free) |
| Neon Rose | #FF2D78 | Rare (ads/IAP) |
| Gold Rush | #FFD700 | Epic (IAP) |
| Void Walker | #6C3BD6 | Legendary (IAP) |