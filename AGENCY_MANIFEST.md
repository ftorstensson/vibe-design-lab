# THE VIBE AGENCY MANIFEST

## 1. THE TENSION PROTOCOL
Every pillar operates with built-in disagreement to avoid consensus bias.
- **The Researcher:** Domain research and facts.
- **The Devil's Advocate:** Surface hidden assumptions and failure modes.
- **The PM:** Synthesizes the tension into the final Position Paper.

## 2. THE SOCIAL GATE
The PM (Gemini 2.5 Flash) acts as a high-pass filter. 
- **Rule:** 3 turns of brainstorming required before a Position Paper can be "Printed."
- **Rule:** Exactly ONE sharp question per turn.

## 3. THE HIRED SPECIALISTS (Verified 2026 IDs)
- **PROJECT_MANAGER:** `gemini-2.5-flash` (Speed, Warmth, Social).
- **ARCHITECT / RESEARCHER:** `gemini-2.5-pro` (High Reasoning, JSON logic).

---

# THE VIBE AGENCY MANIFEST

## 1. THE "LIVING LEDGER" PHILOSOPHY
The AI does not own the canvas structure. The **"Dumb Code"** owns a Registry of 9 slots. The AI acts as an **Author/Editor**, providing atomic `StrategyPatch` objects to update specific departments.

## 2. THE 2026 HIRING HALL (GA Stable)
- **PROJECT_MANAGER:** `gemini-2.5-flash` (Speed, Warmth, Social).
- **ARCHITECT / RESEARCHER:** `gemini-2.5-pro` (High Reasoning, JSON/Markdown logic).
- **TRANSPORT:** All Vertex AI clients must use `transport="rest"` for stability.

## 3. THE 9 POSITION PAPERS
1. Product Strategy, 2. Growth & Lifecycle, 3. Audience & Research, 4. Category & Convention, 5. Value Prop, 6. Experience Principles, 7. IA & Discoverability, 8. Content Systems, 9. Measurement & Learning.

## 4. COMMUNICATION LAWS
- **Handshake:** Every request includes `chat_history` and `strategy_context`.
- **Response:** The PM must separate `user_message` (chat) from `patch` (canvas).
- **Negative Constraint:** NO META-TALK in the social bubble.

------


# THE VIBE AGENCY MANIFEST (v2.1)

## 1. THE STRATEGY ORG CHART
The Agency authors 9 **Executive Position Papers** in a sequential, validated loop.

| Dept # | Name | Core Responsibility |
| :--- | :--- | :--- |
| **1** | **Product Strategy** | Intent, Problem, Market, Success Criteria, Non-Goals. |
| **2** | **Growth & Lifecycle** | AARRR readiness, return loops, entry points. |
| **3** | **Audience & Research** | Buyer Types (Achievers/Socializers), behavioral mapping. |
| **4** | **Category & Convention** | The 95% Rule. Norms, expectations, anti-patterns. |
| **5** | **Value Prop & Messaging** | Pillars, proof strategy, CTA logic by buyer type. |
| **6** | **Experience & Principles** | Guardrails, complexity threshold, error philosophy. |
| **7** | **IA & Discoverability** | Silos, linking logic, SEO/LLM legibility. |
| **8** | **Content Systems** | Cadence, types, evergreen vs dynamic logic. |
| **9** | **Measurement & Learning** | Qual/Quant loops, indicators per lifecycle stage. |

## 2. THE SEQUENTIAL GATEKEEPING
The **Project Manager (PM)** is the Orchestrator. 
- **Rule:** Departments 1-4 are **Mandatory** and must be authored/approved in sequence.
- **Rule:** Departments 5-9 are **Activated** based on project complexity.

## 3. THE DATA HANDSHAKE
Every Strategy Paper must be returned as a **Structured Object**:
- `paper_id`: (1-8)
- `version`: (string)
- `department`: (string)
- `context_paragraph`: (string)
- `structured_findings`: (JSON list of key-value pairs)
- `deep_dive_report`: (Markdown)

--------

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
