# VISION MANIFEST: THE 3-LAYER ENGINE

To prevent "Context Decay" and "Layout Hallucination," the Design Lab uses a 3-Lens approach on a single shared state.

## LAYER 1: THE USER JOURNEY (Logic)
*   **Purpose:** Define *Flow* and *Why*.
*   **Visuals:** Standard Flowchart Nodes (Start, Decision, Action, End).
*   **Data:** Nodes = Steps. Edges = User Choices.
*   **AI Role:** "Map out a sign-up flow." (Generates abstract nodes).

## LAYER 2: THE SITEMAP (Structure)
*   **Purpose:** Define *Inventory* and *Hierarchy*.
*   **Visuals:** Tree Diagram / Org Chart.
*   **Data:** Nodes = Screens. Edges = Navigation paths.
*   **Sync Rule:** If a Screen is deleted here, it must warn the user before deleting the Wireframe in Layer 3.

## LAYER 3: THE WIREFRAMES (Surface)
*   **Purpose:** Define *Layout* and *Content*.
*   **Visuals:** `MobileFrameNode` containers populated with `ComponentNode` children.
*   **Constraint:** Components snap to Frames. They cannot float in the void (orphans).

## TECHNICAL STRATEGY
*   **Store:** `Zustand` (Global State).
*   **Layout:** `Dagre` (Deterministic X/Y calculation).
*   **Output:** A unified `manifest.json` that acts as the "Contract" for the eventual Coding Agent.