# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V2.3 (Unified Persistence & Project Management)*
*Last Updated: 2026-01-14*

## 1. THE MISSION
Building a premium Visual IDE where a Human "Director" and an AI "Agency" collaborate to move from a vague "Vibe" to a concrete "Product" via a structured, sequential workflow.

## 2. THE ARCHITECTURE (Twin Engines)
*   **Frontend:** Next.js + XYFlow. Unified "Executive Paper" canvas for Strategy.
*   **Backend:** FastAPI + Gemini 2.5 Dispatcher. 
*   **State:** "Unified Manifest" system. The entire project (Ledger, History, Canvas) is stored as a single object in Firestore.

## 3. ACTIVE FEATURES
*   [x] **The Lobby:** Functional "Hey Boss" screen with project listing, creation, and deletion.
*   [x] **Project Management:** 3-dot meatball menu for Pinning and Deletion. Inline renaming in Lab Header.
*   [x] **Autosave:** Every AI turn triggers a background sync of the full Manifest to the cloud.
*   [x] **Hydration:** Lab environment automatically "inhabits" the saved state based on URL ID.
*   [x] **Humanized PM:** Brainstorm-first social logic. 

## 4. NEXT IMMEDIATE GOALS
1.  **Refinement Loop:** Implement the "Specialist Interview" (Directly questioning a specific paper).
2.  **Dept 10 (User Journeys):** Triggering visual flows based on approved Strategy DNA.