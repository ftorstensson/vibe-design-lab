# --- SECTION A: IMPORTS ---
import os

# --- SECTION B: CONFIGURATION ---
EXTENSIONS = ('.ts', '.tsx', '.md', '.css', '.json')
IGNORE_DIRS = {'node_modules', '.next', '.git', 'public'}
IGNORE_FILES = {'package-lock.json', 'generate_frontend_context.py'}

def generate():
    output = ["# FRONTEND GROUND TRUTH: THE BODY\n"]
    root_dir = os.getcwd()
    
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file.endswith(EXTENSIONS) and file not in IGNORE_FILES:
                path = os.path.join(root, file)
                rel = os.path.relpath(path, root_dir)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        output.append(f"\n--- START: {rel} ---\n{f.read()}\n--- END: {rel} ---\n")
                except: pass

    with open("FRONTEND_CONTEXT.txt", "w") as f:
        f.write("\n".join(output))
    print("✅ FRONTEND_CONTEXT.txt generated.")

if __name__ == "__main__":
    generate()