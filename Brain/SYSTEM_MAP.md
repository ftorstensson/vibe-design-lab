# SYSTEM MAP: THE VIBE DESIGN LAB (v12.1 - The Strategy Edition)
*The Ground Truth Manual for the Design Truth Engine.*

## I. DIRECTORY & PATH PHYSICS
The system bridges two repositories using the `FRONTEND_PATH` environment variable.
- **Backend Root (`the-co-founder`):** `/Users/fred/the-co-founder`
- **Frontend Root (`vibe-design-lab`):** `/Users/fred/vibe-design-lab`
- **Bridge Variable:** `FRONTEND_PATH="/Users/fred/vibe-design-lab"`

## II. THE AUTHORITY HIERARCHY (The Five Laws)
1. **DUMB CODE (The Physics):** Orchestration, Schemas, and Security.
2. **THE CONSTITUTION:** Institutional logic (Brain/AGENCY_MISSION.md).
3. **MISSION MANIFESTO:** Canonical versioned state object (Firestore).
4. **PROJECT LEDGER:** Persistent "Locked Truths" (Firestore).
5. **SYSTEM PROMPT:** Persona tone and creative perspective (The Soul).

## III. THE SIDECAR ARCHITECTURE
- **Fast Lane (PM):** Pure conversational partner. Social, high-energy, partner-driven. Physically schema-blind to prevent robotic tone.
- **Slow Lane (Scribe):** Background agent. Extracts chat into the stratified Mission Manifesto.
- **Iron Curtain:** Specialists are chat-blind; they reason ONLY from the Manifesto to prevent "Yes/Go" noise.

## IV. NATIVE GROUNDING (The Eyes)
- **The Bypass:** Use `Tool.from_dict({"google_search": {}})` for native 2026 search.
- **Bounty Bank:** Programmatic harvesting of URLs from `grounding_metadata`.
- **ELI Protocol:** Every claim must follow Evidence (URLs) -> Logic -> Implication.

## V. BIOLOGICAL SIGNATURES (Baseline: 2026-03-01)
*Line counts are sacred. Reductions without a pruning plan are regressions.*
### Backend (`the-co-founder`)
- **`app/agency/architect.py`**: ~175 lines (Sidecar & Native Grounding active).
- **`app/agency/departments/product/schemas.py`**: ~105 lines (Scribe & Manifesto schemas).
### Frontend (`vibe-design-lab`)
- **`src/store/vibe-store.ts`**: ~285 lines (Order fixed, Legacy normalization active).
- **`src/components/StrategyNodes.tsx`**: ~200 lines (War Room Tabs, Pushback active).

## VI. ID GRAMMAR (2026 Standard)
- **Departments:** `BIG_IDEA_TEAM`, `OPPORTUNITY_TEAM`, `PEOPLE_TEAM`, `EXPERIENCE_TEAM`, `MVP_TEAM`.
- **Agent Prefix:** `strat_[dept_slug]_` (e.g., `strat_opportunity_market_analyst`).