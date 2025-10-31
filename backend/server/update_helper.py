import os
import sys
import time
import shutil
from pathlib import Path
import subprocess
import ctypes

def main():
    if len(sys.argv) < 3:
        print("Usage: updater.exe <target_exe_path> <temp_update_dir>")
        sys.exit(1)

    # --- Ensure admin privileges (UAC) ---
    if not ctypes.windll.shell32.IsUserAnAdmin():
        print("[Updater] Relaunching with admin privileges...")
        params = " ".join(f'"{arg}"' for arg in sys.argv)
        ctypes.windll.shell32.ShellExecuteW(
            None, "runas", sys.executable, params, None, 1
        )
        sys.exit(0)

    exe_path = Path(sys.argv[1]).resolve()
    temp_dir = Path(sys.argv[2]).resolve()
    app_dir = exe_path.parent

    print(f"[Updater] Target EXE: {exe_path}")
    print(f"[Updater] App directory: {app_dir}")
    print(f"[Updater] Temp update dir: {temp_dir}")

    # --- Wait for the main app to close ---
    print("[Updater] Waiting for the main app to close...")
    time.sleep(2)
    for i in range(30):  # up to ~30 s
        try:
            os.rename(exe_path, exe_path)  # test lock
            break
        except PermissionError:
            time.sleep(1)
    else:
        print("[Updater] Timeout waiting for app to close.")
        sys.exit(1)

    # --- Apply update ---
    print("[Updater] Copying new files...")
    for item in os.listdir(temp_dir):
        src = temp_dir / item
        dst = app_dir / item

        if dst.name.lower() in {"db.sqlite3", "settings.json"}:
            print(f"[Updater] Skipping {dst.name}")
            continue

        if dst.exists():
            if dst.is_dir():
                shutil.rmtree(dst, ignore_errors=True)
            else:
                try:
                    dst.unlink()
                except Exception as e:
                    print(f"[Updater] Warning: couldn't remove {dst}: {e}")

        if src.is_dir():
            shutil.copytree(src, dst, dirs_exist_ok=True)
        else:
            shutil.copy2(src, dst)

    print("[Updater] Update applied successfully.")

    # --- Cleanup ---
    try:
        shutil.rmtree(temp_dir, ignore_errors=True)
        print("[Updater] Cleaned up temporary files.")
    except Exception as e:
        print(f"[Updater] Warning: failed to delete temp dir: {e}")

    # --- Relaunch ---
    print("[Updater] Relaunching new version...")
    subprocess.Popen([str(exe_path)], shell=True, close_fds=True)
    print("[Updater] Done.")
    sys.exit(0)

if __name__ == "__main__":
    main()
