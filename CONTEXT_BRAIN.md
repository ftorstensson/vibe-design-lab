# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V2.1 (Living Ledger & Project Registry)*
*Last Updated: 2026-01-13*

## 1. THE MISSION
Building a premium Visual IDE where a Human "Director" and an AI "Agency" collaborate to move from a vague "Vibe" to a concrete "Product" via a structured, sequential workflow.

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend:** Next.js + XYFlow. Unified "Executive Paper" canvas for Strategy.
*   **Backend:** FastAPI + Gemini 2.5 Dispatcher. "Hiring Hall" (`factory.py`) manages model tiers.
*   **State:** "Living Ledger" system. 9 hardcoded slots in the store; AI provides atomic content patches.
*   **Memory:** Context Snowball includes full Chat History and Strategy Ledger state.

## 3. ACTIVE FEATURES
*   [x] **Project Registry:** Homepage ("Hey Boss") with Create, List, and Delete capabilities.
*   [x] **Executive Strategy Suite:** 9 high-fidelity position papers authored sequentially.
*   [x] **Model Stabilization:** Successfully migrated to Gemini 2.5 GA (Stable) track.
*   [x] **Persistence:** Full Firestore integration for projects and chat history.

## 4. NEXT IMMEDIATE GOALS
1.  **Refinement Loop:** Implement the "Specialist Interview" (Directly questioning a specific paper).
2.  **Dept 10 (User Journeys):** Triggering the first visual layer based on the Strategy DNA.
3.  **Version Ledger UI:** Enabling the ability to swap between paper versions on the canvas.