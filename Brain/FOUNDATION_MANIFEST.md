# THE AGENT FOUNDATION (v1.0)
## 1. THE ARCHITECTURE
- **Fast Lane (PM):** Pure conversational partner (High EQ/Social).
- **Slow Lane (Scribe):** Background data extraction to Mission Manifesto (Data Clerk).
- **Iron Curtain:** Specialists are chat-blind; they reason ONLY from the Manifesto.

## 2. DATA PIPELINE
- **Source:** User Chat
- **Buffer:** Background Scribe (JSON Extraction)
- **Truth:** Firestore missionManifesto object
- **Consumers:** Strike Team Architects

## 3. STABILITY GUARANTEES
- **Null-Safe:** Backend handles empty/null manifestos without crashing.
- **Character-Perfect Patches:** No code changes without fresh Ground Truth.