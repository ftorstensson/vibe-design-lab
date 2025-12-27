# THE VIBE AGENCY MANIFEST
*The Intelligence Architecture for The Design Lab*

## 1. THE PHILOSOPHY: "The Sequential Assembly Line"
We do not build everything at once. We build in layers, where each layer creates the **Source of Truth** for the next.

**Flow:**
1.  **STRATEGY DEPT** -> Outputs **User Journey** (Logic & Emotion).
2.  **INFORMATION DEPT** -> Outputs **Sitemap** (Structure & SEO).
3.  **DESIGN DEPT** -> Outputs **Wireframes** (Layout & Physics).

---

## 2. THE DEPARTMENT STRUCTURE (The Roundtable)
Each Department is a self-contained unit with a **Manager** and a **Team of Specialists**.

**The Manager's Job:**
1.  **Listen:** Receive the User's Intent.
2.  **The Roundtable:** Consult *every* Specialist in the department for their specific constraints/ideas.
3.  **Synthesis:** Resolve conflicts (e.g., SEO vs. UX).
4.  **Execution:** Output the strict JSON required by the Frontend.

---

## 3. THE ROSTERS (Who works here?)

### DEPT 1: STRATEGY (User Journey Layer)
*Goal: Define the Flow. Why are we here?*
*   **The Behavioral Psychologist:** Focuses on Player Types (Achiever/Explorer), Motivation, and Hooks.
*   **The Skeptic (Edge Case Engineer):** Focuses on "Sad Paths," Errors, and Friction.
*   **The Business Analyst:** Focuses on Conversion, Monetization, and Value Proposition.

### DEPT 2: INFORMATION (Sitemap Layer)
*Goal: Define the Structure. Where do things live?*
*   **The Storyteller:** Ensures the flow tells a narrative (Intro -> Climax -> Resolution).
*   **The SEO/GEO Wizard:** Optimizes structure for Search Engines and LLMs (Generative Engine Optimization).
*   **The OOUX Modeler:** Identifies the "Nouns" (Objects) and their relationships.
*   **The Pattern Matcher:** Identifies reusable templates (e.g., "This needs a Feed Template").

### DEPT 3: DESIGN (Wireframe Layer)
*Goal: Define the Surface. How does it look/feel?*
*   **The Ergonomist:** Fitts's Law, Thumb Zones, Touch Targets.
*   **The Brutalist:** Enforces the Visual Design System (Black/White, High Contrast).
*   **The Accessibility Officer:** Contrast ratios, Screen Reader labels, Font sizes.

---

## 4. THE CODE ARCHITECTURE (The Hiring Hall)
We organize code to allow "Hiring" (adding new agents) without breaking the machine.

**Directory Structure:**
```text
app/agency/
├── director.py                <-- The Lobby (Routes to Depts)
└── departments/
    ├── strategy/
    │   ├── manager.py         <-- The Orchestrator
    │   └── personas.py        <-- The Team Registry (Add new hires here)
    ├── information/
    │   ├── manager.py
    │   └── personas.py
    └── design/
        ├── manager.py
        └── personas.py

## 5. THE HIRING PROTOCOL
To add a new skill to the team:
Open the personas.py file for the relevant Department.
Add a new entry to the SPECIALISTS dictionary.
Name: e.g., "COPYWRITER"
Prompt: Define their specific mental model and constraints.
Save. The Manager automatically includes them in the next Roundtable.
