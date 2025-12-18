# THE UX TRUTH LEDGER (Vibe Taxonomy)

## KINGDOM: UX (User Experience)
| ID | Feature Name | The Law (Guarantees) | Status |
| :--- | :--- | :--- | :--- |
| **UX-VIS-001** | **Wireframe Toggle** | Must instantly strip ALL color/shadows. Fonts must become Mono. Borders must become black/solid. | ✅ Active |
| **UX-CAN-001** | **Infinite Canvas** | Must support Pan (Space+Drag) and Zoom (Scroll). Must have Dot background. | ✅ Active |
| **UX-NAV-001** | **Mobile Drawer** | On mobile, sidebar must be an overlay. On desktop, it can be persistent (TBD). | ✅ Active |
| **UX-ACC-001** | **Icon Labels** | All icon-only buttons MUST have an `aria-label`. No exceptions. | ✅ Active |

## KINGDOM: SYS (System Architecture)
| ID | Feature Name | The Law (Guarantees) | Status |
| :--- | :--- | :--- | :--- |
| **SYS-DAT-001** | **The Manifest** | All canvas state flows into one JSON object. We do not split state across components. | 🚧 Planned |
| **SYS-LAY-001** | **Auto-Layout** | AI-generated nodes must be run through a layout algorithm (Dagre) before rendering. | 🚧 Planned |