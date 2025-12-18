# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V0.3 (The Architect is Live)*
*Last Updated: 2025-12-18*

## 1. THE MISSION
We are building **"The Design Lab"** – a Visual IDE where a Human "Director" collaborates with an AI "Producer" (The Architect) to design mobile apps via "Show and Tell."

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend (Design Lab):** Next.js + XYFlow + Zustand.
*   **Backend (Co-Founder):** FastAPI + LangChain.
    *   **The Architect:** A specialized `gemini-2.5-flash` agent at `/agent/design` that outputs structured JSON nodes (Flows/Sitemaps) instead of text.
*   **State:** `Zustand` holds the "Vibe Manifest" (Journey, Sitemap, Wireframes).
*   **Layout:** `Dagre` automatically organizes AI-generated nodes.

## 3. ACTIVE FEATURES
*   [x] **Infinite Canvas:** XYFlow setup with Dot Grid and Pan/Zoom.
*   [x] **3-Layer Lens:** Switch between Journey (Logic), Sitemap (Structure), and Wireframes (UI).
*   [x] **The Architect:** Voice-to-Canvas. User speaks a flow, AI generates the diagram instantly.
*   [x] **Auto-Layout:** Nodes are automatically arranged to prevent overlapping.
*   [x] **Component Library:** Draggable "Legos" defined by strict TypeScript contracts.

## 4. NEXT IMMEDIATE GOALS
1.  **Sitemap Generation:** Teach the Architect to generate a Tree Structure (View B) based on the Journey (View A).
2.  **Wireframe Auto-Fill:** Teach the Architect to populate a "Phone Screen" with components based on a prompt.
3.  **The Export:** A button to package the "Manifest" into a prompt for the Coding Agent.