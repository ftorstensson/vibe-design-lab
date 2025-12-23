# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V0.5 (Sitemap Layer Polished)*
*Last Updated: 2025-12-24*

## 1. THE MISSION
We are building **"The Design Lab"** – a Visual IDE where a Human "Director" collaborates with an AI "Producer" (The Architect) to design mobile apps via "Show and Tell."

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend (Design Lab):** Next.js + XYFlow + Zustand.
*   **Backend (Co-Founder):** FastAPI + LangChain (`/agent/design` route).
*   **State:** `Zustand` holds the "Vibe Manifest" (Journey, Sitemap, Wireframes).
*   **Layout:** `Dagre` automatically organizes AI-generated nodes.

## 3. ACTIVE FEATURES
*   [x] **Journey Layer:** Schematic Flowcharts (Diamonds/Pills) with Miro-style connections.
*   [x] **Sitemap Layer:**
    *   **Rich Page Cards:** "Brutalist" style (White/Black), Collapsible content lists, Goal footers.
    *   **Purpose Dots:** Expandable nodes to annotate "Why this category exists."
    *   **Ortho-Connections:** Right-Angle (Step) lines for tree structures.
*   [x] **The Architect:** Voice-to-Canvas with Layer Awareness (knows if it's drawing a Flow or a Tree).

## 4. NEXT IMMEDIATE GOALS
1.  **Wireframe Layer:** The final frontier. Teaching the AI to populate components *inside* the Phone Frame (Parent/Child logic).
2.  **The Export:** Packaging the "Manifest" into a prompt for the Coding Agent.
3.  **Comments:** Adding a discussion layer on top of nodes.