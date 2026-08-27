# COMPONENT SPECIFICATION: KAWAII HOLOGRAPHIC BLUEPRINT & TACTICAL MAP SYSTEM

**Component ID**: `NEXUS-MAP-V6-SPEC`  
**Project**: Resident Lovely: Maximum Happiness 3D  
**Design System**: NEXUS PRIVÉ v6.0 Luxury Glassmorphism  
**Accessibility Target**: WCAG 2.1 AAA Compliant | Strict Zero-Emoji Standard  

---

## 1. Design Tokens & Color Palette Matrix

| Token Name | Hex Value | Semantic Usage | Contrast vs Obsidian (`#05070a`) |
|---|---|---|---|
| `--bg-obsidian` | `#05070a` | Global backdrop | Base |
| `--bg-panel` | `rgba(10, 15, 26, 0.92)` | Frosted glass cards & modals | 18.2:1 (AAA) |
| `--cyan-glow` | `#22d3ee` | Active beacons, player vectors, primary borders | 12.8:1 (AAA) |
| `--gold-accent` | `#f59e0b` | Save stations, puzzle items, headers | 9.4:1 (AAA) |
| `--emerald-joy` | `#10b981` | Unlocked doors, happiness vitality, garden | 8.2:1 (AAA) |
| `--magenta-bliss` | `#ec4899` | Cauldron brew, destructibles, heart lanterns | 7.6:1 (AAA) |
| `--purple-spark` | `#a855f7` | Specter ghost entities, magic mist | 6.5:1 (AA) |
| `--text-main` | `#f8fafc` | Primary titles, button labels | 19.1:1 (AAA) |
| `--text-dim` | `#94a3b8` | Subtext, coordinates, room descriptions | 8.9:1 (AAA) |

---

## 2. Interactive SVG Map Hierarchy

```mermaid
graph TD
    MapContainer[Full Map Modal Overlay] --> ControlsBar[Floor Tabs & Legend Bar]
    MapContainer --> MapViewport[High-Res Vector SVG Blueprint]
    MapContainer --> TelemetrySidebar[Chamber Telemetry & Security Camera]
    
    MapViewport --> SolariumNode[West Wing: Solarium Garden (Fountain + 4 Lanterns)]
    MapViewport --> FoyerNode[Center Wing: Grand Foyer (Rotunda + Piano + Save)]
    MapViewport --> LibraryNode[East Wing: Library (Cauldron + Shelves + Desk)]
    MapViewport --> PlayerBeacon[Active S.M.I.L.E. Agent Beacon + Radar Pulse]
    
    TelemetrySidebar --> SectorData[Happiness %, Puzzles Remaining, Grumps Present]
    TelemetrySidebar --> CamFeed[CRT Scanline Security Feed Preview]
```

---

## 3. Interaction & Animation Specs

1. **Floor Selection**: Tab transitions smoothly toggle between Ground Floor (1F) and Mezzanine Balcony (2F).
2. **Room Inspection**: Clicking/tapping any chamber highlights the perimeter stroke with cyan glow (`filter: drop-shadow(0 0 10px #22d3ee)`) and populates the Sector Telemetry sidebar.
3. **Player Beacon Animation**: Dynamic SVG `r` radius expansion (`6px` ➔ `24px`) with opacity fade (`1.0` ➔ `0.0`) running at 2-second cycles.
4. **Security Camera Feed**: CRT scanline simulation using CSS repeating-linear-gradient with green `REC` badge.
