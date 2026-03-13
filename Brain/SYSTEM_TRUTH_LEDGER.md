# VIBE DESIGN LAB: SYSTEM TRUTH LEDGER (v1.1)

## 1. THE STATE ENVELOPE
- ZONE A (Immutable): _envelope.mission_manifesto
- ZONE B (Mutable): state.*

## 2. THE NAMING REGISTRY
| Canonical Key | Banned Aliases |
|---|---|
| _envelope.mission_manifesto | manifesto, vision, brief, mission |
| state.active_layer | current_layer, step, phase |
| state.strategy | layer_1, strat |

## 3. THE INSTRUCTION FIREWALL
- RULE: PM Agent (Social) imports from prompts/social/ ONLY.
- RULE: Scribe Agent (Technical) imports from prompts/technical/ ONLY.
- PATTERN: PM sees vision as PROSE via get_manifesto_display().
- HANDSHAKE: Scribe runs FIRST (Turn 1) to lock vision. PM runs SECOND (Turn 2) as social partner.

## 4. THE 5-LAYER SNOWBALL
1. Strategy -> 2. Landscape -> 3. Journey -> 4. Structure -> 5. Wireframes

## 5. THE PROPAGATION LAW (Fractal Snowball)
- **Anchor Inheritance**: Every agent in a sub-sequence (e.g., Paper 2) MUST receive the final summary anchors of all previous steps.
- **The Daughter Rule**: No sub-step may contradict a locked anchor; it may only refine or expand.
- **Recursive Context**: Completed layer outputs are compressed into the foundation for the next layer.

## 6. THE PHYSICAL VERIFICATION GATE (The Eye)
- **No Hearsay**: Assistant is forbidden from guessing keys or paths. Use "Read" first.
- **Registry Check**: If a key is not in Section 2, STOP and ask the Director.
- **Blind Spot Protocol**: Failed patches (422) require a Diagnostic Read, not a guess fix.