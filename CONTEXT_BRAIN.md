# PROJECT BRAIN: VIBE DESIGN LAB
*Current Status: V2.3 (Liquid Agency & Informed Confidence)*
*Last Updated: 2026-01-20*

## 1. THE MISSION
A premium Visual IDE for "Computational Strategy." The system uses a multi-agent tension loop to author 5 high-density Position Papers that establish the project's DNA via a Socratic discovery process.

## 2. THE LIQUID ARCHITECTURE
*   **The Brain:** Prompts and Personas are stored in Firestore (`agency_roster`).
*   **The Control Room:** Administrative UI at `/agency-lab` allows real-time specialist engineering.
*   **The Face:** PM uses `gemini-2.5-flash` for speed; Specialists use `gemini-2.5-pro` for research.

## 3. ACTIVE FEATURES
*   [x] **Informed Confidence Gate:** PM probes with 3-5 questions before naming/authoring.
*   [x] **Atomic Transition:** Project Naming and Paper 1 generation happen in a single turn.
*   [x] **A4 Position Papers:** Premium tabbed UI (Position vs. Appendix) with mandatory research density.
*   [x] **Specialist Direct Access:** Lock sidebar chat to specific domain experts.

## 4. NEXT IMMEDIATE GOALS
1.  **Context Inspector:** Implement a "View Worldview" toggle to see exact context passed to agents.
2.  **The Scribe:** Implement background summarization to keep token counts clean and insights sharp.