# Dira — Color System

## The rule
One color = one semantic category. Never cross categories.
`#EF4444` is always danger/critical — never a data label.
`#2DD4BF` is always voter/registration data — never a general accent.

---

## Group 1 — Brand (UDA / campaign identity)

| Token | Hex | Usage |
|---|---|---|
| `--brand-deep` | `#4000A7` | Gradient anchor, dark hero backgrounds |
| `--brand-primary` | `#7C3AED` | Interactive elements, section headings |
| `--brand-light` | `#A78BFA` | Labels, section tags, accent text, intel signals |
| `--brand-faint` | `#DDD6FE` | Gradient title text (hero) |

---

## Group 2 — Status (campaign standing — the core signal)

| Token | Hex | Usage |
|---|---|---|
| `--status-win` | `#10B981` | WIN counties, positive deltas, confidence High |
| `--status-watch` | `#F59E0B` | WATCH counties, contested, confidence Medium |
| `--status-monitor` | `#64748B` | MONITOR counties, opposition territory, confidence Low |
| `--status-flag` | `#EF4444` | FLAGGED alerts, impeachment risk, critical urgent |

Background / border tints: append `14` (8%) or `2A` (16%) to the hex.
Example: `#10B9811A` for a WIN background wash.

---

## Group 3 — Data (voter / registration figures only)

| Token | Hex | Usage |
|---|---|---|
| `--data-pool` | `#2DD4BF` | Eligible voter counts, registration data — nothing else |

---

## Group 4 — Opposition

| Token | Hex | Usage |
|---|---|---|
| `--opp-primary` | `#F97316` | Opposition vote share, ODM/coalition figures, Raila vote counts |

Distinct from brand violet and WIN green. Reads as "the other side."
Never used for warnings (amber) or danger (red).

---

## Group 5 — Neutrals (CSS vars, do not hardcode)

| Token | CSS Variable |
|---|---|
| Primary text | `var(--text-primary)` |
| Secondary text | `var(--text-secondary)` |
| Muted text | `var(--text-muted)` |
| Borders | `var(--border)` |
| Surfaces | `var(--bg-surface)`, `var(--bg-surface-2)` |

---

## Group 6 — Confidence (intentionally reuses Status colors)

| Level | Hex | Rationale |
|---|---|---|
| High | `#10B981` | Solid, reliable — same meaning as WIN |
| Medium | `#F59E0B` | Uncertain — same meaning as WATCH |
| Low | `#64748B` | Directional only — same as MONITOR |

---

## Retired / prohibited colors

| Hex | Was used for | Replace with |
|---|---|---|
| `#3B82F6` (blue) | Gen Z / general accent | `#A78BFA` (brand-light) |
| `#F87171` (soft red) | Gachagua in Contest table | `#EF4444` (status-flag) |
| `#94A3B8` (light slate) | Monitor count in hero | `#64748B` (status-monitor) |
| `#EF4444` for Raila vote count | Vote breakdown expand panel | `#F97316` (opp-primary) |

---

## JS constant (use in template literals)

```javascript
const DIRA_COLORS = {
  WIN:      '#10B981',
  WATCH:    '#F59E0B',
  MONITOR:  '#64748B',
  FLAG:     '#EF4444',
  BRAND:    '#7C3AED',
  BRAND_LT: '#A78BFA',
  POOL:     '#2DD4BF',
  OPP:      '#F97316',
};
```

## CSS tokens (add to `:root`)

```css
--brand-deep:     #4000A7;
--brand-primary:  #7C3AED;
--brand-light:    #A78BFA;
--brand-faint:    #DDD6FE;
--status-win:     #10B981;
--status-watch:   #F59E0B;
--status-monitor: #64748B;
--status-flag:    #EF4444;
--data-pool:      #2DD4BF;
--opp-primary:    #F97316;
```
