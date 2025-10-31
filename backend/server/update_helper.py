# update_helper.py
import os, sys, time, shutil, subprocess
from pathlib import Path

def main():
    if len(sys.argv) < 3:
        print("Usage: update_helper.exe <app_dir> <update_dir>")
        sys.exit(1)

    app_dir = Path(sys.argv[1])
    update_dir = Path(sys.argv[2])

    print(f"[Updater] Replacing files in {app_dir} from {update_dir}")

    # Wait until the main process exits (avoid locked .exe)
    time.sleep(1)
    for _ in range(20):
        try:
            os.rename(app_dir / "server.exe", app_dir / "server.exe")
            break
        except OSError:
            time.sleep(0.5)

    # Copy new files
    for item in os.listdir(update_dir):
        src = update_dir / item
        dst = app_dir / item
        if dst.exists():
            if dst.is_dir():
                shutil.rmtree(dst, ignore_errors=True)
            else:
                dst.unlink(missing_ok=True)
        if src.is_dir():
            shutil.copytree(src, dst, dirs_exist_ok=True)
        else:
            shutil.copy2(src, dst)

    # Cleanup
    shutil.rmtree(update_dir, ignore_errors=True)

    # Relaunch the app
    subprocess.Popen([str(app_dir / "server.exe")], close_fds=True)
    print("[Updater] Update complete.")
    sys.exit(0)

if __name__ == "__main__":
    main()
