# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 001: The Accessibility Blocker**
*   **Symptom:** Next.js Linting failed build due to missing `aria-label` on Icon Buttons.
*   **Fix:** Never create an icon-only button without an explicit `aria-label` prop. Added to `UX_LEDGER` as **UX-ACC-001**.

**Entry 002: The Terminal Command Trap**
*   **Symptom:** Copy-pasting complex Bash scripts with `!` (exclamation marks) caused `event not found` errors in zsh/bash.
*   **Fix:** Use `cat << 'EOF'` for file generation, or paste code directly into VS Code. Do not use raw echo/printf for React code containing logic operators.

**Entry 003: The "Client-Side Mirage" (Inherited from Co-Founder)**
*   **Symptom:** Direct Database calls from Frontend fail in Cloud Run due to Firewalls/Auth.
*   **Fix:** **Server-Side Proxy.** The Frontend must ask the Backend API to fetch data. It should never touch the DB directly.