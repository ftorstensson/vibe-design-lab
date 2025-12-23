# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 026: The Visual Regression (White Dots)**
*   **Symptom:** Connection handles reverted to White with Borders, and Diamond handles floated inside the shape.
*   **Diagnosis:** Copy-pasting code from previous iterations without checking the "Polished" state.
*   **Fix:** Explicitly define `handleCommon` style: `{ background: '#000', border: 'none', zIndex: 50 }`.

**Entry 025: The React Flow Version Trap (v11 vs v12)**
*   **Fix:** Always use `onReconnect`, `onReconnectStart`, `onReconnectEnd`.

**Entry 024: The Docker Zombie Stall**
*   **Fix:** 1. `killall Docker`. 2. Restart App. 3. `docker system prune -a`.