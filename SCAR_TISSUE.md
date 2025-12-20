# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 025: The React Flow Version Trap (v11 vs v12)**
*   **Symptom:** Typescript errors on `OnEdgeUpdateFunc` and `onEdgeUpdate`.
*   **Diagnosis:** `XYFlow` (v12) renamed these to `onReconnect`. Old documentation causes build breaks.
*   **Fix:** Always use `onReconnect`, `onReconnectStart`, `onReconnectEnd`.

**Entry 024: The Docker Zombie Stall**
*   **Symptom:** Deployment hangs at "Building..." or throws Socket Error.
*   **Diagnosis:** Docker Desktop engine froze or ran out of memory.
*   **Fix:** 1. `killall Docker`. 2. Restart App. 3. `docker system prune -a`.

**Entry 023: The "Ghost Box" Artifact**
*   **Symptom:** White squares appearing behind custom shapes (Diamonds/Circles).
*   **Diagnosis:** Default Node styles or non-transparent wrappers.
*   **Fix:** Force `style: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }` on both Initial Nodes and AI-Generated Nodes.

**Entry 001: The Accessibility Blocker**
*   **Fix:** All icon buttons must have `aria-label`.