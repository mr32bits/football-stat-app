from tkinter import messagebox
from pathlib import Path

from tufup.client import Client
from pathlib import Path

__version__ = "0.0.2"

APP_NAME = "FootballStats"
APP_VERSION = __version__
INSTALL_DIR = Path(__file__).parent
METADATA_DIR = INSTALL_DIR / "tufup_root"
TARGET_DIR = INSTALL_DIR / "updates"

METADATA_BASE_URL = "https://mr32bits.github.io/football-stat-app/"
TARGET_BASE_URL = "https://github.com/mr32bits/football-stat-app/releases/download/v{version}/"

def check_for_updates(active: bool = False) -> bool:
    """Try tufup first, fall back to GitHub API."""
    print("App Version: ", APP_VERSION)
    try:
        client = Client(
            app_name=APP_NAME,
            app_install_dir=str(INSTALL_DIR),
            current_version=APP_VERSION,
            metadata_dir=str(METADATA_DIR),
            metadata_base_url=METADATA_BASE_URL,
            target_dir=str(TARGET_DIR),
            target_base_url=TARGET_BASE_URL,
        )
        res = client.check_for_updates()
        print(res)
        if res:
            print("Update Available",
                f"A new signed update is available.\nDo you want to download it?")
            reply = messagebox.askquestion(
                "Update Available",
                f"A new signed update is available.\nDo you want to download it?",
            )
            if reply == "yes":
                client.download_and_apply_update(skip_confirmation=True)
                messagebox.showinfo("Update Complete", "Please restart the app.")
                return True
        elif active:
            print("Up to date", f"Current Version: {APP_VERSION}")
            messagebox.showinfo("Up to date", f"Current Version: {APP_VERSION}")
        return False

    except Exception as tuf_error:
        print(f"TUF check failed ({tuf_error}), using GitHub fallback...")
    return False