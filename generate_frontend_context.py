import os
import subprocess

# --- CONFIGURATION ---
EXTENSIONS = ('.ts', '.tsx', '.md', '.css', '.json')
IGNORE_DIRS = {'node_modules', '.next', '.git', 'public'}
IGNORE_FILES = {'package-lock.json', 'generate_frontend_context.py'}

def copy_to_clipboard(text):
    try:
        process = subprocess.Popen('pbcopy', stdin=subprocess.PIPE)
        process.communicate(text.encode('utf-8'))
    except Exception as e:
        print(f"❌ Clipboard error: {e}")

def generate():
    output = ["--- START OF FRONTEND GROUND TRUTH ---"]
    root_dir = os.getcwd()
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file.endswith(EXTENSIONS) and file not in IGNORE_FILES:
                path = os.path.join(root, file)
                rel = os.path.relpath(path, root_dir)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        output.append(f"\nFILE: {rel}\n---\n{f.read()}\n---\n")
                except: pass
    output.append("--- END OF FRONTEND GROUND TRUTH ---")
    
    final_text = "\n".join(output)
    
    # Write to file for safety
    with open("FRONTEND_CONTEXT.txt", "w") as f: f.write(final_text)
    
    # 🚀 THE MAGIC: Copy to Mac Clipboard (Command+C)
    copy_to_clipboard(final_text)
    print("✅ FRONTEND_CONTEXT.txt generated and saved to your CLIPBOARD. You can now paste it directly.")

if __name__ == "__main__":
    generate()