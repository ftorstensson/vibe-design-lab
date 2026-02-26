# THE AGENT FOUNDATION (v1.2)

## 1. THE ARCHITECTURE
- **Fast Lane (PM):** Pure conversational partner (High EQ/Social).
- **Slow Lane (Scribe):** Background data extraction to Mission Manifesto (Data Clerk).
- **Iron Curtain:** Specialists are chat-blind; they reason ONLY from the Manifesto.
- **Native Grounding:** 2026-grade Google Search integration via metadata harvesting.

## 2. DATA PIPELINE
- **Source:** User Chat (Refined by PM).
- **Buffer:** Background Scribe (JSON Extraction).
- **Truth:** Firestore `missionManifesto` object + `projectLedger`.
- **Consumers:** Strike Team Architects (Chat-Blind).

## 3. RESEARCH STANDARDS
- **ELI Protocol:** Evidence (URLs), Logic (Why), Implication (Directives).
- **Receipt Pings:** Terminal logs every search query and source count.
- **Bounty Bank:** programmatically captured URLs stored as structured state.