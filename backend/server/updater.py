import os
import pathlib
from pathlib import Path
import shutil
import subprocess
import sys
import time
from tkinter import messagebox
import tkinter
from typing import List, Union
import base64
from tuf.api.exceptions import ExpiredMetadataError
from tufup.client import Client
import platform

__version__ = "0.0.1"

os_name = platform.system().lower()
system = "win" if "windows" in os_name else "mac"

APP_NAME = "FootballStats"+ "-" + system
APP_VERSION = __version__
if platform.system() == "Darwin":
    BASE_DIR = Path.home() / "Library/Application Support" / "FootballStats"
    INSTALL_DIR = Path(sys.argv[0]).parent.parent.parent.parent
elif platform.system() == "Windows":
    BASE_DIR = Path(os.getenv("LOCALAPPDATA")) / "FootballStats"
    INSTALL_DIR = Path(os.getenv("LOCALAPPDATA")) / "Programs" / "FootballStats"
else:
    print("Not Supported System")

METADATA_DIR = BASE_DIR / "tufup_root"
TARGET_DIR = BASE_DIR / "updates"
EXTRACT_DIR = TARGET_DIR / "extract"

METADATA_BASE_URL = "https://mr32bits.github.io/football-stat-app/"
TARGET_BASE_URL = f"https://github.com/mr32bits/football-stat-app/releases/download/"

ROOT_MAC = """ewogICAgInNpZ25hdHVyZXMiOiBbCiAgICAgICAgewogICAgICAgICAgICAia2V5aWQiOiAiNzA2OGJkYzkyZTYwYzE2YmVhODc5ZTE4YzlkMDM5ZmE1MGRmODhkNDQ0MDc1Njk3OTBhZjM5YTFjODFmOThkYyIsCiAgICAgICAgICAgICJzaWciOiAiNmIwN2RiNGYwYjFmNjk5ZTA2ZDNlNGExNzIwNWZmYWE1NGI3YTc0NDkzYWUyZDQxYzA3ZmZhMmUwYjc2NjFlMzgyOWQ0ZTBhZDcyNjQwNWIxODNkNjQzNjQzZTA3NjMwYzFiYzMwOGFjZTQwZTA4YTY0YjQ5ZTQ3ZDY0ZjE0MDgiCiAgICAgICAgfQogICAgXSwKICAgICJzaWduZWQiOiB7CiAgICAgICAgIl90eXBlIjogInJvb3QiLAogICAgICAgICJjb25zaXN0ZW50X3NuYXBzaG90IjogZmFsc2UsCiAgICAgICAgImV4cGlyZXMiOiAiMjAyNi0xMS0wNFQxMTozNDoyN1oiLAogICAgICAgICJrZXlzIjogewogICAgICAgICAgICAiMTBiMGM2YmFlZmE4YTkxMmE1M2IwODEyZDcxMGVkMTU3NTE5ZjZjYjNkYzkwYmI2ZGFkYjRkMDM5NTU0ZDVmNCI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogImVjZWVjNjcxMjc5ZGYxOWVmNmIyMGMwN2RiOGRhMDUxYWNiMTgxNTk4N2RjZjA5Mjk3YmMzNzkzZmEwMmRlMjIiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9LAogICAgICAgICAgICAiMWZjMzc2OGZlNDY0ZmNmNjYwNWY3ODJkMTVhMWNkZWJmZTAxNDAwMzMwY2U2NTk0NDZiYzBmNzU0ZmMwYmNjNSI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogIjg3YzkwNzBmMTYyYzFhMjZkNDJjZGIwMjM4MmIxY2RiZDA3M2NjZjQ4YzFhNzYxMmE1OWM3Mjg5OWJiNzZkMGEiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9LAogICAgICAgICAgICAiNDg1ZTJjNzY2YmIzZjI0ZGU1NjNjMGM4MTU2ZDg5N2Q5MDU5NjQ3ZjNiNjhhMWU2YTNhMjViZmJkOWVkOWI4ZCI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogImVmYWUzYzM3NjBlMzRhNTc0MTc1OGZiMjMxMjhlOTBjZTdhZTcxZWM2NTRiMDdiOWMxYmY5Njc4NzNkN2YyMWIiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9LAogICAgICAgICAgICAiNzA2OGJkYzkyZTYwYzE2YmVhODc5ZTE4YzlkMDM5ZmE1MGRmODhkNDQ0MDc1Njk3OTBhZjM5YTFjODFmOThkYyI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogImI3NDY1NjU3NWZiMWY5YmM4YTM5MmMzMmYzZTI2NWQ4MGU4ZDdmZTY0ZGVjZjZjNzMxMDg0N2I1YjgwZDNiYzYiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAicm9sZXMiOiB7CiAgICAgICAgICAgICJyb290IjogewogICAgICAgICAgICAgICAgImtleWlkcyI6IFsKICAgICAgICAgICAgICAgICAgICAiNzA2OGJkYzkyZTYwYzE2YmVhODc5ZTE4YzlkMDM5ZmE1MGRmODhkNDQ0MDc1Njk3OTBhZjM5YTFjODFmOThkYyIKICAgICAgICAgICAgICAgIF0sCiAgICAgICAgICAgICAgICAidGhyZXNob2xkIjogMQogICAgICAgICAgICB9LAogICAgICAgICAgICAic25hcHNob3QiOiB7CiAgICAgICAgICAgICAgICAia2V5aWRzIjogWwogICAgICAgICAgICAgICAgICAgICIxMGIwYzZiYWVmYThhOTEyYTUzYjA4MTJkNzEwZWQxNTc1MTlmNmNiM2RjOTBiYjZkYWRiNGQwMzk1NTRkNWY0IgogICAgICAgICAgICAgICAgXSwKICAgICAgICAgICAgICAgICJ0aHJlc2hvbGQiOiAxCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgICJ0YXJnZXRzIjogewogICAgICAgICAgICAgICAgImtleWlkcyI6IFsKICAgICAgICAgICAgICAgICAgICAiNDg1ZTJjNzY2YmIzZjI0ZGU1NjNjMGM4MTU2ZDg5N2Q5MDU5NjQ3ZjNiNjhhMWU2YTNhMjViZmJkOWVkOWI4ZCIKICAgICAgICAgICAgICAgIF0sCiAgICAgICAgICAgICAgICAidGhyZXNob2xkIjogMQogICAgICAgICAgICB9LAogICAgICAgICAgICAidGltZXN0YW1wIjogewogICAgICAgICAgICAgICAgImtleWlkcyI6IFsKICAgICAgICAgICAgICAgICAgICAiMWZjMzc2OGZlNDY0ZmNmNjYwNWY3ODJkMTVhMWNkZWJmZTAxNDAwMzMwY2U2NTk0NDZiYzBmNzU0ZmMwYmNjNSIKICAgICAgICAgICAgICAgIF0sCiAgICAgICAgICAgICAgICAidGhyZXNob2xkIjogMQogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAic3BlY192ZXJzaW9uIjogIjEuMC4zMSIsCiAgICAgICAgInZlcnNpb24iOiAxCiAgICB9Cn0=""".strip()
ROOT_WIN = """ewogICAgInNpZ25hdHVyZXMiOiBbCiAgICAgICAgewogICAgICAgICAgICAia2V5aWQiOiAiMGU1ZDZhOGUyZDBlZDhhZWE2NmQ4OTU4ZDM5NmY5MjUwOTZlM2FhMGM1NTQ1YjU2YjFmNDVhNmQ5ZjY0NzY3YSIsCiAgICAgICAgICAgICJzaWciOiAiMzcyNzM5MzgwYmY3ZmRhNzc4OTQ3NGVkZjUxYjA4YTQxODA0OTNjM2M4NjMwOTlkOTVhOGZhZTE1NWRmOWRjMGNkZWJkOTU1NTE3OWZlY2EwZDI0MDY4ZmQ4YzlhOTJhNWU0ZThmOWY5NjI2M2NiZWIxYjM4ODhiYzI4NGE0MGIiCiAgICAgICAgfQogICAgXSwKICAgICJzaWduZWQiOiB7CiAgICAgICAgIl90eXBlIjogInJvb3QiLAogICAgICAgICJjb25zaXN0ZW50X3NuYXBzaG90IjogZmFsc2UsCiAgICAgICAgImV4cGlyZXMiOiAiMjAyNi0xMS0wNVQxNjowMjozMloiLAogICAgICAgICJrZXlzIjogewogICAgICAgICAgICAiMGU1ZDZhOGUyZDBlZDhhZWE2NmQ4OTU4ZDM5NmY5MjUwOTZlM2FhMGM1NTQ1YjU2YjFmNDVhNmQ5ZjY0NzY3YSI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogIjNlZTc4NGE4YjA2M2Y2YzUwZTY2N2QzMDIyZDE5MjhjNWZkOGU3YzEzMzQwNTRkN2NlOWNlOTBhMDM4ODBlMzgiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9LAogICAgICAgICAgICAiMjRjYjI3YTk2Y2IyZGVkNjlmNWNiMjQ1NzgyZDk2ZTMzODE2NDgyODRjOWVmZjIxY2RmNDE0MDlkNDQ5ZGVjNSI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogIjIyMjQ4OWE3ZjQ2NWI0YzQzODZmNWJjN2NiZDQzODhiZGQzOGViNzJmNmZiZjYzZjZjMmZmMjU4ZDgxMzcyNTIiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9LAogICAgICAgICAgICAiNmVlMTY5YTY3MzkwYmE5YTZkZDE2N2I0M2MyMmQ4ZTI5NGYyZjMwM2Q2NGU4ZWZkMTA4ZWI0M2NhMmJmM2QzOCI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogIjRmYzczZjAzMzBkYWE2YWEwYWE2NmExOGU5OTAyM2U5MGRiZWEwZWQ0YmFkNGFlM2ZiZTM4MGNkNzM0NTBiNDMiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9LAogICAgICAgICAgICAiZDBjNTQ0OTAwMDk3MjUxOWUzNzgwNGRmYTBmNTA0OGU4MWYyMDA4ZDA1OWQwYWVkZjNhNmM2OTU1MGE4NjlmYyI6IHsKICAgICAgICAgICAgICAgICJrZXl0eXBlIjogImVkMjU1MTkiLAogICAgICAgICAgICAgICAgImtleXZhbCI6IHsKICAgICAgICAgICAgICAgICAgICAicHVibGljIjogIjliNDRhMzFlMWQ5M2JjYmMzMmY2MWExYTI0YzFkMjY5YWMyODJmZDUwNDNiMTVlZTRiZWNkNTZhOTUzZTMwNzUiCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInNjaGVtZSI6ICJlZDI1NTE5IgogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAicm9sZXMiOiB7CiAgICAgICAgICAgICJyb290IjogewogICAgICAgICAgICAgICAgImtleWlkcyI6IFsKICAgICAgICAgICAgICAgICAgICAiMGU1ZDZhOGUyZDBlZDhhZWE2NmQ4OTU4ZDM5NmY5MjUwOTZlM2FhMGM1NTQ1YjU2YjFmNDVhNmQ5ZjY0NzY3YSIKICAgICAgICAgICAgICAgIF0sCiAgICAgICAgICAgICAgICAidGhyZXNob2xkIjogMQogICAgICAgICAgICB9LAogICAgICAgICAgICAic25hcHNob3QiOiB7CiAgICAgICAgICAgICAgICAia2V5aWRzIjogWwogICAgICAgICAgICAgICAgICAgICJkMGM1NDQ5MDAwOTcyNTE5ZTM3ODA0ZGZhMGY1MDQ4ZTgxZjIwMDhkMDU5ZDBhZWRmM2E2YzY5NTUwYTg2OWZjIgogICAgICAgICAgICAgICAgXSwKICAgICAgICAgICAgICAgICJ0aHJlc2hvbGQiOiAxCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgICJ0YXJnZXRzIjogewogICAgICAgICAgICAgICAgImtleWlkcyI6IFsKICAgICAgICAgICAgICAgICAgICAiNmVlMTY5YTY3MzkwYmE5YTZkZDE2N2I0M2MyMmQ4ZTI5NGYyZjMwM2Q2NGU4ZWZkMTA4ZWI0M2NhMmJmM2QzOCIKICAgICAgICAgICAgICAgIF0sCiAgICAgICAgICAgICAgICAidGhyZXNob2xkIjogMQogICAgICAgICAgICB9LAogICAgICAgICAgICAidGltZXN0YW1wIjogewogICAgICAgICAgICAgICAgImtleWlkcyI6IFsKICAgICAgICAgICAgICAgICAgICAiMjRjYjI3YTk2Y2IyZGVkNjlmNWNiMjQ1NzgyZDk2ZTMzODE2NDgyODRjOWVmZjIxY2RmNDE0MDlkNDQ5ZGVjNSIKICAgICAgICAgICAgICAgIF0sCiAgICAgICAgICAgICAgICAidGhyZXNob2xkIjogMQogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAic3BlY192ZXJzaW9uIjogIjEuMC4zMSIsCiAgICAgICAgInZlcnNpb24iOiAxCiAgICB9Cn0=""".strip()

def check_for_updates(active: bool = False) -> bool:
    """Try tufup first, fall back to GitHub API."""
    try:
        METADATA_DIR.mkdir(parents=True, exist_ok=True)
        TARGET_DIR.mkdir(parents=True, exist_ok=True)
        EXTRACT_DIR.mkdir(parents=True, exist_ok=True)
        INSTALL_DIR.mkdir(parents=True, exist_ok=True)

        if not Path(METADATA_DIR, "root.json").exists():
            with open(str(Path(METADATA_DIR, "root.json")), 'wb') as f:
                f.write(base64.b64decode(ROOT_MAC) if platform.system() == "Darwin" else base64.b64decode(ROOT_WIN))

        print("App Version: ", APP_VERSION)
        print(f"Checking for updates ({os_name} build, version {APP_VERSION})")

        client = Client(
            app_name=APP_NAME,
            app_install_dir=str(INSTALL_DIR),
            current_version=APP_VERSION,
            metadata_dir=str(METADATA_DIR),
            metadata_base_url=METADATA_BASE_URL + system + '/',
            target_dir=str(TARGET_DIR),
            target_base_url=TARGET_BASE_URL,
            extract_dir=str(EXTRACT_DIR) if platform.system() == "Windows" else None,
        )

        update_info = client.check_for_updates()
        print(update_info)
        if update_info:
            print("Update Available",
                f"Version {update_info.version} available.\nDo you want to update?")
            reply = messagebox.askquestion(
                "Update Available",
                f"Version {update_info.version} available.\nDo you want to update?",
            )
            if reply == "yes":
                client._target_base_url = f"{TARGET_BASE_URL}v{update_info.version}/"
                
                client.download_and_apply_update(skip_confirmation=True, install=custom_mac_install if platform.system() == "Darwin" else custom_windows_install)
                return True
        elif active:
            print("Up to date", f"Current Version: {APP_VERSION}")
            messagebox.showinfo("Up to date", f"Current Version: {APP_VERSION}")
        return False
    except ExpiredMetadataError as expiredMetadataError:
        print("TUF metadata expired")
        messagebox.showwarning("Warning", "Expired Metada\nRetry later again or contact maintainer of Repository:\nhttps://github.com/mr32bits/football-stat-app")
    except Exception as tuf_error:
        print(f"TUF check failed ({tuf_error})")
        tb = sys.exception().__traceback__
        print(f"{tuf_error.with_traceback(tb)}")
        messagebox.showerror(str(tuf_error),str(tuf_error.with_traceback(tb)))
    return False

def custom_mac_install(src_dir: Union[pathlib.Path, str], dst_dir: Union[pathlib.Path, str], exclude_from_purge: List[Union[pathlib.Path, str]] = None, purge_dst_dir: bool =False, symlinks: bool = False, **kwargs):
    src_dir = pathlib.Path(src_dir)
    dst_dir = pathlib.Path(dst_dir)
    exclude_from_purge = [pathlib.Path(p) for p in (exclude_from_purge or [])]
    print(f"Installing update from {src_dir} → {dst_dir}")

    from tufup.utils.platform_specific import remove_path
    if purge_dst_dir:
        exclude_from_purge = (
            [  # enforce path objects
                pathlib.Path(item) for item in exclude_from_purge
            ]
            if exclude_from_purge
            else []
        )
        for path in pathlib.Path(dst_dir).iterdir():
            if path not in exclude_from_purge:
                remove_path(path=path)

    #Copy new files
    shutil.copytree(src_dir, dst_dir, dirs_exist_ok=True, symlinks=symlinks)

    #clean up the temp files
    for path in pathlib.Path(src_dir).iterdir():
        remove_path(path=path)

    time.sleep(1.5)

    app_bundle = dst_dir / "FootballStats.app"
    if app_bundle.exists():
        print(f"Restarting {app_bundle} ...")
        subprocess.Popen(["open", "-n", f"{app_bundle}"])
    else:
        print(f"App bundle not found at {app_bundle}")
    
    #remove updates folder
    remove_path(path=TARGET_DIR)

    #closing app
    sys.exit(0)
                
def custom_windows_install(
    src_dir: str,
    dst_dir: str,
    purge_dst_dir: bool = False,
    exclude_from_purge=None,
    **kwargs,
):
    src_dir = Path(src_dir)
    dst_dir = Path(dst_dir)
    exclude_from_purge = [Path(p) for p in (exclude_from_purge or [])]
    print(f"Installing update from {src_dir} → {dst_dir}")

    # Build a small one-off script that does the move after exit
    exe_name = "FootballStats.exe"
    exe_path = dst_dir / exe_name
    updater_script = Path(os.getenv("TEMP")) / "tufup_update_helper.bat"

    with open(updater_script, "w", encoding="utf-8") as f:
        f.write(f"""@echo off
        echo ------------------------------
        echo FootballStats Updater {__version__}
        echo ------------------------------
        setlocal enabledelayedexpansion
        set EXE="{exe_path}"
        set SRC="{src_dir}"
        set DST="{dst_dir}"

        echo Attempting to close running app...
        taskkill /IM {exe_name} /F >nul 2>&1
        timeout /t 1 >nul

        echo Waiting for process to release...        
        :waitloop
        2>nul (>>%EXE% echo.) && (
        echo App closed, continuing...
        ) || (
        echo File still locked, waiting 2 seconds...
        timeout /t 2 /nobreak >nul
        goto waitloop
        )

        echo Applying update from %SRC% to %DST% ...
        robocopy "%SRC%" "%DST%" /E /IS /IT /MOVE /R:5 /W:2 >nul

        echo Waiting for %EXE% to be ready...
        :wait_ready
        (
        >"%EXE%" echo. >nul 2>&1
        ) && (
        echo Ready!
        ) || (
        echo File still busy, retrying in 2 seconds...
        timeout /t 2 /nobreak >nul
        goto wait_ready
        )

        echo Restarting app...
        timeout /t 10 >nul
        explorer "%DST%\FootballStats.exe"

        echo Cleaning up temp files...
        rmdir /S /Q "%SRC%" >nul

        echo Done.
        del "%~f0"
        exit /b 0
        """)

    # Launch helper in background, then exit main app
    print(f"[TUFUP] Launching updater helper: {updater_script}")
    subprocess.Popen(['cmd', '/c', str(updater_script)], cwd=str(dst_dir), creationflags=subprocess.CREATE_NEW_CONSOLE)
    print("[TUFUP] Exiting app to allow update...")
    sys.exit(0)
