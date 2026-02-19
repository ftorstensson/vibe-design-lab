# SYSTEM MAP: THE VIBE DESIGN LAB (v4.4)
*The Ground Truth Manual for AI Assistants building this system.*

## I. DIRECTORY & PATH PHYSICS
The system bridges two distinct repositories using the `FRONTEND_PATH` environment variable.
- **Backend Root (`the-co-founder`):** `/Users/fred/the-co-founder`
- **Frontend Root (`vibe-design-lab`):** `/Users/fred/vibe-design-lab`
- **Bridge Variable:** `FRONTEND_PATH="/Users/fred/vibe-design-lab"` (Set in Backend Terminal).

## II. BIOLOGICAL SIGNATURES (Baseline: 2026-02-14)
*These line counts are "Sacred." Any turn that reduces these without a documented Pruning Plan is a regression.*

### Backend (`the-co-founder`)
- **`app/agency/architect.py`**: 133 lines
- **`app/agency/departments/product/schemas.py`**: 71 lines
- **`app/chain.py`**: 218 lines

### Frontend (`vibe-design-lab`)
- **`src/app/project/[id]/page.tsx`**: 241 lines
- **`src/store/vibe-store.ts`**: 257 lines
- **`src/components/StrategyNodes.tsx`**: 201 lines

## III. ID GRAMMAR (The Naming Law)
*Hallucinating a name causes a 404 System Failure. Use these exact strings.*

### 1. Layers (Uppercase)
`STRATEGY` | `LANDSCAPE` | `JOURNEY` | `SITEMAP` | `WIREFRAME` | `GLOBAL`

### 2. Department Registry (Uppercase + _TEAM)
`BIG_IDEA_TEAM` | `MARKET_TEAM` | `AUDIENCE_TEAM` | `STRUCTURE_TEAM` | `FEASIBILITY_TEAM` | `LANDSCAPE_TEAM` | `JOURNEY_TEAM`

### 3. Agent Slug Standard (Lowercase)
Format: `strat_[dept_slug]_[role_id]`
*Examples:* `strat_big_idea_team_visionary`, `strat_market_team_scout`, `master_pm`, `global_editor`.

## IV. THE RENDERING PIPELINE (Text-to-Visual)
Our architecture follows a "Separation of Intelligence" model:
1. **AI Role (The Architect):** The AI provides the **Blueprint** (Markdown, JSON, or Logic Ledgers). It never cares about X/Y coordinates or CSS.
2. **Body Role (The Physics):** The code (Frontend Logic) interprets the AI's blueprint into **XYFlow Nodes**. 
3. **The Ledger:** Every layer's output is saved as a "Design Ledger" entry, ensuring the next AI "sees" the previous decisions as inescapable constraints.

## V. INVARIANT LAWS (The "Untouchables")
- **TL-VIS-01 (Sacred Resizers):** `page.tsx` must preserve `NodeResizer` and `NodeResizeControl` for all MobileScreen types.
- **TL-STA-01 (Functional Setters):** `vibe-store.ts` updates MUST use the functional `set((state) => ({...}))` pattern to prevent race conditions.
- **TL-PRO-01 (Primacy Gate):** The Director's vision (Turn 1) is the permanent "Strategic Anchor" and must be injected into all specialist prompts to prevent "Meta-Talk" drift.

## VI. THE KNOWLEDGE PIPELINE (Exo-Brains)
Agents are "Leveled Up" by injecting specialized Markdown modules from `Brain/EXO_BRAINS/`.
1. **Assignment:** Agents in the Lab have an `exo_brain_links` field (Metadata).
2. **Injection:** The code fetches the linked `.md` files and prepends them to the prompt.
3. **Hierarchy:** Exo-Brain Logic outranks System Prompt Persona, but defers to the Constitution.