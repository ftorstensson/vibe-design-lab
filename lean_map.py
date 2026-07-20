import os
import subprocess

# --- CONFIGURATION ---
# We only want to see the hierarchy and the absolute "Nervous System" files
DNA_FILES = [
    'src/types/vibe-core.ts',           # The Data Contract
    'src/lib/kernel-client.ts',         # The Connection logic
    'src/app/api/agent/design/generate/route.ts', # The Aorta
    'Brain/SYSTEM_TRUTH_LEDGER.md',     # The Laws
    'Brain/AI_SYSTEM_MAP.md'            # The Map
]

IGNORE_DIRS = {'.git', 'node_modules', '.next', 'public', '_brain_old'}

def get_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        tree.append(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            if not f.startswith('.'):
                tree.append(f"{subindent}{f}")
    return "\n".join(tree)

def copy_to_clipboard(text):
    subprocess.Popen('pbcopy', stdin=subprocess.PIPE).communicate(text.encode('utf-8'))

def generate():
    output = []
    output.append("--- VIBE DESIGN LAB: SATELLITE MAP (v34.2) ---")
    output.append("Infrastructure: Next.js App (Sovereign) + Sydney Kernel (Headless CPU)")
    output.append("Handshake: UCC v1.1 (Briefcase/Envelope)\n")

    output.append("### I. PROJECT STRUCTURE (The Tree)")
    output.append(get_tree(os.getcwd()))
    output.append("\n" + "="*50 + "\n")

    output.append("### II. CORE DNA (The Contracts)")
    for rel_path in DNA_FILES:
        if os.path.exists(rel_path):
            output.append(f"\nFILE: {rel_path}")
            output.append("-" * 20)
            with open(rel_path, 'r') as f:
                # We take only the first 100 lines of code files to avoid bloat
                lines = f.readlines()
                output.append("".join(lines[:100]))
                if len(lines) > 100:
                    output.append(f"\n... [{len(lines)-100} lines truncated] ...")
            output.append("-" * 20)

    final_text = "\n".join(output)
    
    with open("LEAN_CONTEXT.txt", "w") as f: f.write(final_text)
    copy_to_clipboard(final_text)
    
    print("✅ LEAN_CONTEXT.txt generated and saved to CLIPBOARD.")
    print("This is a high-level GPS for the next AI.")

if __name__ == "__main__":
    generate()
