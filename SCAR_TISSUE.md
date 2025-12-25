# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 027: The Inline Style Trap**
*   **Symptom:** Linter errors on `style={{ width: '100%' }}` inside JSX.
*   **Fix:** Always use Tailwind classes (`w-full`) where possible. If dynamic styles are needed, explicitly type them as `React.CSSProperties` or ensure values have units (e.g., `'375px'`, not `375`).

**Entry 026: The Visual Regression (White Dots)**
*   **Fix:** Explicitly define `handleCommon` style: `{ background: '#000', border: 'none', zIndex: 50 }`.

**Entry 025: The React Flow Version Trap (v11 vs v12)**
*   **Fix:** Always use `onReconnect`, `onReconnectStart`, `onReconnectEnd`.