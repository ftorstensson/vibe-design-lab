# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V1.1 (Strategy Layer & Persistent Nav)*
*Last Updated: 2026-01-03*

## 1. THE MISSION
We are building **"The Design Lab"** – a Visual IDE where a Human "Director" collaborates with an AI "Producer" (The Architect) to design mobile apps via "Show and Tell."

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend (Design Lab):** Next.js + XYFlow + Zustand.
*   **Backend (Co-Founder):** FastAPI + LangChain (`/agent/design` route).
*   **State:** `Zustand` holds the "Vibe Manifest" (Strategy Doc + 3 Visual Layers).
*   **Layout:** `Dagre` automatically organizes AI-generated nodes.

## 3. ACTIVE FEATURES
*   [x] **Strategy Layer:** Markdown Document Editor ("The Truth").
*   [x] **Journey Layer:** Schematic Flowcharts with "Spine" layout.
*   [x] **Sitemap Layer:** Rich "Page Cards" with Brutalist UI.
*   [x] **Wireframe Layer:** Auto-Docking Phone Screens with "The Fold" indicator.
*   [x] **Persistent Navigation:** Tabs stay visible across Text and Canvas views.

## 4. NEXT IMMEDIATE GOALS
1.  **The "Context Snowball":** Ensure the Architect reads the `STRATEGY.md` when generating the `JOURNEY`, and reads the `JOURNEY` when generating the `SITEMAP`.
2.  **The Export:** Packaging the "Manifest" into a prompt for the Coding Agent.