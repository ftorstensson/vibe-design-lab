# FEATURE LEDGER

## CORE CAPABILITIES (PROTECTED)
- [x] **Voice-to-Canvas:** The "Architect" Agent listens to voice commands and renders XYFlow Nodes/Edges instantly.
- [x] **Auto-Layout Engine:** Deterministic layout (Dagre) ensures AI-generated diagrams are readable.
- [x] **Twin-Engine Backend:** Design Lab uses a dedicated `/agent/design` endpoint on the Python backend, isolated from the Chatbot logic.
- [x] **The "Proxy" Data Layer:** Robust Server-Side fetching.

## INTERFACE (MOBILE FIRST)
- **Layer Switcher:** Toggle between Journey, Sitemap, and Wireframes.
- **Center Stage UI:** Optimized for focus.
- **Voice Recorder:** Visual feedback (Pulse Red).

## INTERNAL TOOLS
- **The Design Lab:** (`/design-lab`)
    - **Wireframe Toggle:** Switch between "Skeleton" and "Vibe" modes.
    - **Component Zoo:** Draggable UI elements.