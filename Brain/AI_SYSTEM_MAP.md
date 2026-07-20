# 🗺️ VIBE DESIGN LAB: MASTER AI ARCHITECTURAL MAP (v20.0)

## I. THE CANONICAL ROSTER (Cognitive Isolation)
To prevent intelligence decay, each agent has exactly ONE job. Handovers are atomic.

1. **The Clerk (ID: `clerk`):** clinical IQ. Verbatim JSON extraction of facts.
2. **The PM (ID: `master_pm`):** high-EQ. Facilitation, momentum, and social handshake.
3. **The Author (ID: `master_author`):** high-prose. Synthesizes chat vibe into the 'Official Brief'.
4. **The Hounds (Tool):** Native Vertex SDK. Harvesting direct URIs (Treasure Chest).
5. **The Specialists (ID: `strat_...`):** 3 distinct personas. Deep ELI research reports.
6. **The Editor (ID: `global_editor`):** Quality control. Final JSON assembly and tone-policing.

## II. THE FOUR BODIES (Contextual Hierarchy)
Every message sent to the PM is structured in this specific order of priority:

1. **THE IDENTITY (System Message):** Social DNA from Agency Lab.
2. **THE KNOWLEDGE (Institutional Memory):** Summary Bricks of all STABLE papers. (Strips raw logic/links).
3. **THE LAW (The Kaiser):** The turn-specific mandate (e.g., "Paper 1 is done, move to Paper 2").
4. **THE VIBE (Chat History):** The last 6-10 turns of transcript only.

## III. THE CIRCUITRY (File Dependencies)
*If you touch Column A, you MUST update Column B.*

| Component | Lead File | Dependencies |
| :--- | :--- | :--- |
| **Orchestration** | `architect.py` | `factory.py`, `naming_registry.py` |
| **Firewall (Memory)**| `firewall.py` | `strategyLedger` keys in Firestore |
| **The Law (Kaiser)** | `kaiser_monologue.py` | `milestone_id` status check |
| **The Deadbolt** | `response_filter.py` | `hiring_authorized` flag |
| **Naming Law** | `naming_registry.py` | `REGISTRY` calls in `architect.py` |

## IV. THE LAWS OF PHYSICS (Banned Patterns)
1. **No Recapping:** The PM is forbidden from summarizing the Director's last message.
2. **No Robot Speak:** PM never mentions "JSON," "Gates," or "Librarians."
3. **Native Grounding:** Specialists MUST use Native Vertex SDK (LangChain tool-bind is banned).
4. **De-loading Law:** PM and Clerk never see "Deep Research" (raw_a/b/c). Only Summary Bricks.
5. **Infra-Lock:** Telemetry logs ([GATE], [SPECIALIST], [ASSEMBLY]) are mandatory.

## V. THE ASSEMBLY LINE (Execution Flow)
User -> Clerk (IQ Facts) -> Kaiser (Law) -> PM (EQ Social) -> [IF GREEN] -> Author (Brief) -> Specialists (Research) -> Editor (JSON Synthesis) -> Canvas.
## VI. THE HANDSHAKE PROTOCOL (Immutable Contract)
**REQUEST:** {app_id, project_id, milestone_id, user_message, agent_id}
**RESPONSE:** {social_response, status, data_patch}
**STATUSES:** 
- PROBING: Discovery mode.
- AUTHORIZED: Gate is Green, waiting for 'go'.
- STABLE: Research complete, data_patch provided.

6. **Trigger Law:** All ignition keywords (social cues to fire a team) must be fetched from the ARM. The Kernel code must remain linguistically neutral.