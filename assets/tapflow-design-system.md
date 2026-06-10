# TapFlow Design System

## Visual Identity
TapFlow is a hyper-casual one-tap mobile game about flow — water, movement, rhythm.
- **Smooth gradients** — fluid transitions between colors
- **Glowing elements** — neon accents for high visual appeal
- **Circular organic shapes** — the player is a glowing orb
- **Deep dark background** — makes bright elements pop, easy on eyes in dark rooms

---

## Color Palette

### Core Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0B0F1C` | Main game background |
| `--color-bg-secondary` | `#131A2E` | UI panels, menus |
| `--color-bg-surface` | `#1A2340` | Cards, buttons |
| `--color-player` | `#00D4FF` | Player orb — bright cyan |
| `--color-player-glow` | `rgba(0, 212, 255, 0.4)` | Player glow effect |
| `--color-obstacle` | `#FF4757` | Obstacles — warm red |
| `--color-obstacle-alt` | `#FF6B81` | Alt obstacles |
| `--color-accent` | `#7C5CFC` | Purple accent for power-ups |
| `--color-accent-alt` | `#A78BFA` | Lighter purple accent |
| `--color-success` | `#2ED573` | Score milestones, checkmarks |
| `--color-warning` | `#FFA502` | Boost pickups, warnings |
| `--color-text-primary` | `#FFFFFF` | Primary text |
| `--color-text-secondary` | `#8892B0` | Secondary/label text |
| `--color-text-muted` | `#4A5568` | Muted text |
| `--color-ui-bg` | `rgba(19, 26, 46, 0.9)` | UI element backgrounds |
| `--color-ui-border` | `rgba(255, 255, 255, 0.08)` | Subtle borders |

### Gradient Definitions
```css
--gradient-bg: linear-gradient(180deg, #0B0F1C 0%, #131A2E 50%, #0B0F1C 100%);
--gradient-player: radial-gradient(circle, #00D4FF 0%, #0099CC 100%);
--gradient-obstacle: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
--gradient-powerup: linear-gradient(135deg, #7C5CFC 0%, #A78BFA 100%);
--gradient-ui-panel: linear-gradient(180deg, rgba(26, 35, 64, 0.95) 0%, rgba(19, 26, 46, 0.95) 100%);
```

---

## Typography
- **Primary**: System sans-serif (SF Pro / Roboto) — clean, no custom fonts needed
- **Game Title**: Rounded, bold, letter-spaced
- **Score**: Monospace digits for high-score readability
- **UI Labels**: Medium weight, clean sans-serif

---

## Spacing (8px grid)
| Token | px |
|-------|-----|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

---

## UI Component Styles

### Buttons
- Rounded corners (12px radius)
- Semi-transparent backgrounds
- Subtle glow on primary actions
- Transition: 0.2s ease all

### Score Display
- Large monospace digits
- Cyan glow matching player color
- Centered at top of screen

### Game Over Screen
- Dark overlay (rgba(11, 15, 28, 0.85))
- Centered panel with frosted glass effect (backdrop-filter: blur)
- Score, high score, and action buttons

### Obstacles
- Sharp geometric shapes (triangles, diamonds) contrasting the round player
- Warm red/orange colors
- Subtle edge glow to signal danger
- Consistent movement direction (flowing downward)

---

## Game World Design

### Background
- Deep space/night blue gradient
- Subtle floating particles (tiny dots or circles drifting upward)
- Parallax layers for depth: close (faster), mid, far (slow)
- Neon grid lines or subtle water ripples at the lowest visibility

### Player Orb
- Circular, smooth
- Cyan gradient core with outer glow
- Small trailing particles when moving
- Brief flash on score milestone

### Obstacles
- **Triangle**: Sharp, pointed downward — most common
- **Diamond**: Medium difficulty, wider hitbox
- **Hexagonal**: Larger, slower — requires precision
- **Wall gaps**: Two obstacles forming a narrow passage

---

## Animation Tokens
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

---

## Skin System (Future IAP)

### Default Skin — "Cyan Flow"
- Player: `#00D4FF` gradient
- Trail: lighter cyan particles

### Rare Skin — "Neon Rose"
- Player: Hot pink `#FF2D78` 
- Trail: rose particles

### Epic Skin — "Gold Rush"
- Player: Gold `#FFD700`
- Trail: golden sparkles

### Legendary Skin — "Void Walker"
- Player: Deep purple `#6C3BD6` with animated shimmer
- Trail: galaxy particles