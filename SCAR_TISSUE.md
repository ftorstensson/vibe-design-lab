# SCAR TISSUE LEDGER (Lessons Learned)

**Entry 028: The 404 Model Registry Ghost**
*   **Symptom:** Backend threw 404 when calling `gemini-3.0-pro`.
*   **Lesson:** Never assume upcoming model IDs. **Always verify against the Vertex AI registry.** Reverted to `gemini-2.5-pro` (stable) and `gemini-2.0-flash-001`.

**Entry 029: The Silent Uvicorn Buffer**
*   **Symptom:** `print()` logs were invisible in the terminal.
*   **Fix:** Use `logging.getLogger("uvicorn.error")`. It forces logs to terminal immediately.

**Entry 030: The Schema Leak (Self-Talk)**
*   **Symptom:** LLM put its internal reasoning ("I have analyzed the request...") into the user chat bubble.
*   **Fix:** Strictly separate `user_message` (social) from `thought_process` (internal) in Pydantic schemas. Use "Negative Constraints" in prompts: "NO META-TALK."

**Entry 031: The 422 Handshake Error**
*   **Symptom:** Frontend fetch fails with "Unprocessable Entity."
*   **Fix:** Ensure FastAPI parameters (Form vs Body) match exactly between Frontend `FormData` and Backend endpoint signatures.