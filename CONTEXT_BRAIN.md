# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V1.0 (Core Foundation Complete)*
*Last Updated: 2025-12-26*

## 1. THE MISSION
We are building **"The Design Lab"** – a Visual IDE where a Human "Director" collaborates with an AI "Producer" (The Architect) to design mobile apps via "Show and Tell."

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend (Design Lab):** Next.js + XYFlow + Zustand.
*   **Backend (Co-Founder):** FastAPI + LangChain (`/agent/design` route).
*   **State:** `Zustand` holds the "Vibe Manifest" (Journey, Sitemap, Wireframes).
*   **Layout:** `Dagre` automatically organizes AI-generated nodes.

## 3. ACTIVE FEATURES
*   [x] **Journey Layer:** Schematic Flowcharts (Diamonds/Pills) with Miro-style connections.
*   [x] **Sitemap Layer:** Rich "Page Cards" with content priority lists and purpose dots.
*   [x] **Wireframe Layer:**
    *   **Elastic Design:** Resizable components and Phone Screens (Infinite Scroll).
    *   **Physics:** Components "Auto-Dock" and "Center" when dropped onto a screen.
    *   **The Fold:** Visual indicator for 812px height.
*   [x] **The Architect:** Voice-to-Canvas engine (Backend ready, Prompt tuning next).

## 4. NEXT IMMEDIATE GOALS
1.  **The Architect V2:** Upgrade the AI Prompt to use the specific Wireframe Components (Header, Input, etc.) instead of generic boxes.
2.  **The Export:** Packaging the "Manifest" into a prompt for the Coding Agent.
3.  **Comments:** Adding a discussion layer on top of nodes.