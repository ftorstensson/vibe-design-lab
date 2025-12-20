# THE UX TRUTH LEDGER (Vibe Taxonomy)

## KINGDOM: UX-SHELL (The Interface)
| ID | Feature Name | The Law (Guarantees) | Status |
| :--- | :--- | :--- | :--- |
| **UX-SHELL-001** | **Modern Vibe** | The Toolbar, Sidebar, and Headers MUST use "Vibe Style" (White, `shadow-xl`, `rounded-2xl`, `border-slate-200`). | 🔒 PINNED |
| **UX-SHELL-002** | **Wireframe Exclusion** | The "Wireframe Toggle" affects the CANVAS CONTENT only. It must NEVER affect the Toolbars or Buttons. | 🔒 PINNED |
| **UX-ACC-001** | **Icon Labels** | All icon-only buttons MUST have an `aria-label`. | ✅ Active |

## KINGDOM: UX-CANVAS (The Content)
| ID | Feature Name | The Law (Guarantees) | Status |
| :--- | :--- | :--- | :--- |
| **UX-VIS-001** | **Schematic Nodes** | Journey Nodes must be High-Contrast B&W (Black Border, White Fill). No Colors. | ✅ Active |
| **UX-VIS-002** | **No Ghost Box** | Node Wrappers must be `transparent` and borderless. The Shape handles the border. | 🛠 Fixing |
| **UX-INT-001** | **Loose Connections** | Allow connecting any handle to any handle (Top-to-Bottom, Left-to-Right). | ✅ Active |
| **UX-INT-002** | **Drag-to-Delete** | Dragging an existing line into empty space must delete the line. | 🛠 Fixing |