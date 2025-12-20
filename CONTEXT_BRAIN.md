# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V0.4 (Journey Layer Polished)*
*Last Updated: 2025-12-21*

## 1. THE MISSION
We are building **"The Design Lab"** – a Visual IDE where a Human "Director" collaborates with an AI "Producer" (The Architect) to design mobile apps via "Show and Tell."

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend (Design Lab):** Next.js + XYFlow + Zustand.
*   **Backend (Co-Founder):** FastAPI + LangChain.
    *   **The Architect:** A specialized `gemini-2.5-flash` agent at `/agent/design` that outputs structured JSON nodes.
*   **State:** `Zustand` holds the "Vibe Manifest" (Journey, Sitemap, Wireframes).
*   **Layout:** `Dagre` automatically organizes AI-generated nodes.

## 3. ACTIVE FEATURES
*   [x] **Twin-Engine Backend:** Dedicated `/agent/design` route isolated from Chat logic.
*   [x] **3-Layer Lens:** Switch between Journey (Logic), Sitemap (Structure), and Wireframes (UI).
*   [x] **The Architect:** Voice-to-Canvas with Auto-Layout.
*   [x] **Journey View:**
    *   **Visuals:** High-contrast "Schematic" look (Black/White).
    *   **Physics:** "Miro-style" Loose Connections (Any-to-Any).
    *   **Tools:** Vertical Toolbar (Start, Action, Decision, End).
    *   **Interactivity:** Editable text labels, Drag-to-delete connections.

## 4. NEXT IMMEDIATE GOALS
1.  **Wireframe Layer:** Teach the Architect to populate components *inside* the Phone Frame (Parent/Child logic).
2.  **Sitemap Layer:** Generate Tree structures from Voice.
3.  **The Export:** Package the "Manifest" for the Coding Agent.