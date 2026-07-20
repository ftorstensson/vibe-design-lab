import os
import subprocess

# --- CONFIGURATION ---
EXTENSIONS = ('.ts', '.tsx', '.md', '.json')
IGNORE_DIRS = {'node_modules', '.next', '.git', 'public', '_brain_old'}
IGNORE_FILES = {'package-lock.json', 'generate_frontend_context.py', 'FRONTEND_CONTEXT.txt', 'generate_v34_context.py'}

def copy_to_clipboard(text):
    try:
        process = subprocess.Popen('pbcopy', stdin=subprocess.PIPE)
        process.communicate(text.encode('utf-8'))
    except Exception as e:
        print(f"❌ Clipboard error: {e}")

def generate():
    output = []
    output.append("--- VIBE DESIGN LAB: SOVEREIGN ARCHITECTURAL MAP (v34.1) ---")
    output.append("Infrastructure: Next.js Sovereign App + Sydney Kernel CPU")
    output.append("Standard: UCC v1.1 / Archivist v1.0\n")
    
    file_list = []
    root_dir = os.getcwd()
    
    # First pass: Generate GPS Summary
    output.append("--- GPS SUMMARY (Line Counts) ---")
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file.endswith(EXTENSIONS) and file not in IGNORE_FILES:
                path = os.path.join(root, file)
                rel = os.path.relpath(path, root_dir)
                try:
                    lines = len(open(path, 'r', errors='ignore').readlines())
                    output.append(f"{lines:>5} lines | {rel}")
                    file_list.append((rel, path))
                except: pass
    
    output.append("\n--- START OF SOURCE CODE ---")
    
    # Second pass: Extract Contents
    for rel, path in file_list:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                output.append(f"\nFILE: {rel}")
                output.append("-" * len(f"FILE: {rel}"))
                output.append(content)
                output.append("-" * 40)
        except: pass
        
    output.append("\n--- END OF FRONTEND GROUND TRUTH ---")
    
    final_text = "\n".join(output)
    with open("FRONTEND_CONTEXT.txt", "w") as f: f.write(final_text)
    
    copy_to_clipboard(final_text)
    print("✅ v34.1 Context generated and saved to your CLIPBOARD.")
    print(f"📄 Total logical files captured: {len(file_list)}")

if __name__ == "__main__":
    generate()
