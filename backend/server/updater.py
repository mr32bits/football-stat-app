from tkinter import messagebox
from pathlib import Path

from tufup.client import Client
from pathlib import Path
import platform

__version__ = "0.0.2"

os_name = platform.system().lower()
folder = "win" if "windows" in os_name else "mac"

APP_NAME = "FootballStats"+ "-" + folder
APP_VERSION = __version__
if platform.system() == "Darwin":
    INSTALL_DIR = Path.home() / "Library/Application Support" / "FootballStats"
else:
    INSTALL_DIR = Path(__file__).parent
METADATA_DIR = INSTALL_DIR / "tufup_root"
TARGET_DIR = INSTALL_DIR / "updates"

METADATA_DIR.mkdir(parents=True, exist_ok=True)
TARGET_DIR.mkdir(parents=True, exist_ok=True)

METADATA_BASE_URL = "https://mr32bits.github.io/football-stat-app/"
TARGET_BASE_URL = f"https://github.com/mr32bits/football-stat-app/releases/download/"

def check_for_updates(active: bool = False) -> bool:
    """Try tufup first, fall back to GitHub API."""

    print("App Version: ", APP_VERSION)
    print(f"Checking for updates ({os_name} build, version {APP_VERSION})")

    try:
        client = Client(
            app_name=APP_NAME,
            app_install_dir=str(INSTALL_DIR),
            current_version=APP_VERSION,
            metadata_dir=str(METADATA_DIR),
            metadata_base_url=METADATA_BASE_URL + folder + '/',
            target_dir=str(TARGET_DIR),
            target_base_url=TARGET_BASE_URL,
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
                client.download_and_apply_update(skip_confirmation=True)
                messagebox.showinfo("Update Complete", "Please restart the app.")
                return True
        elif active:
            print("Up to date", f"Current Version: {APP_VERSION}")
            messagebox.showinfo("Up to date", f"Current Version: {APP_VERSION}")
        return False

    except Exception as tuf_error:
        print(f"TUF check failed ({tuf_error})")
    return False