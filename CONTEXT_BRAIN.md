# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V0.2 (Prototype Active)*
*Last Updated: 2025-12-18*

## 1. THE MISSION
We are building **"The Design Lab"** – a Visual IDE and Meta-Tool.
It solves the "Tell vs. Show" problem in AI coding. Instead of prompting text, the user "Shows" the AI what to build using an Infinite Canvas, and the AI "Tells" the code how to render it.

## 2. THE ARCHITECTURE (Planned V1)
*   **Engine:** Next.js + Tailwind + XYFlow (React Flow).
*   **State Management (The Brain):** `Zustand`. Holds the "Vibe Manifest" (Single Source of Truth).
*   **Layout Engine (The Eyes):** `Dagre`. Automatically organizes AI-generated nodes so they don't overlap.
*   **Interface:** Mobile-First "Center Stage" layout with "Wireframe/Hi-Fi" toggle.

## 3. ACTIVE FEATURES (The Foundation)
*   [x] **Infinite Canvas:** XYFlow setup with Dot Grid and Pan/Zoom.
*   [x] **Component Library:** Sidebar with draggable "Legos" (Header, Button, etc.) defined by strict TypeScript contracts.
*   [x] **Wireframe Toggle:** Global switch to strip CSS styling for structural review.
*   [x] **Interactive Prototype:** A hard-coded "Lobby -> Drawer -> Chat" flow to test the UX feel.

## 4. NEXT IMMEDIATE GOALS (The 3-Layer Pivot)
1.  **State Migration:** Move from local React state to `Zustand` global store.
2.  **The 3 Lenses:** Implement the View Switcher:
    *   **View A:** User Journey (Logic Flowchart).
    *   **View B:** Sitemap (Structure Tree).
    *   **View C:** Wireframes (The Screens).
3.  **Auto-Layout:** Integrate `Dagre` to stop the AI from piling nodes on top of each other.