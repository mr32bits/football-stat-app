import shutil
import subprocess
import sys
import os
import tempfile
from tkinter import messagebox
import requests
from pathlib import Path

from version import Version

VERSION = Version('v0.0.2-alpha')

def check_for_updates(active: bool = False):
    """Check if a newer version is available online."""
    try:
        release_api = "https://api.github.com/repos/mr32bits/football-stat-app/releases/latest"
        response = requests.get(release_api)
        response.raise_for_status()

        json = response.json()
        online_version = Version(json['tag_name'])
        print(f"Current version: {VERSION}, Online version: {online_version}")

        if VERSION < online_version:
            reply = messagebox.askquestion(
                "Update Available",
                f"A new version ({online_version}) is available.\nDo you want to update?",
            )
            if reply == "yes":
                perform_update(online_version, response)
            else:
                print("Update skipped.")
        else:
            if active:
                messagebox.showinfo("Up to date", f"No updates are available.\nCurrent Version: {VERSION}")
            print("Already up to date.")

    except Exception as e:
        print(f"Error checking updates: {e}")

def perform_update(new_version: Version, r: requests.Response):
    try:
        r.raise_for_status()
        release_data = r.json()

        print(f"Found release: {release_data['name']} ({release_data['tag_name']})")

        # Determine which asset to download based on platform
        assets = release_data.get("assets", [])
        if not assets:
            raise Exception("No assets found in the latest release.")

        asset_to_download = None
        for asset in assets:
            name = asset["name"].lower()
            if sys.platform == "win32" and name.endswith(".zip") and "win" in name:
                asset_to_download = asset
                break
            elif sys.platform == "darwin" and name.endswith(".zip") and "mac" in name:
                asset_to_download = asset
                break

        if not asset_to_download:
            raise Exception("No suitable update package found for this platform.")

        download_url = asset_to_download["browser_download_url"]
        print(f"Downloading update from: {download_url}")

        # Choose writable base directory
        if sys.platform == "darwin":
            base_update_dir = Path.home() / "Library" / "Application Support" / "FootballStat" / "updates"
        elif sys.platform == "win32":
            base_update_dir = Path(os.getenv("APPDATA")) / "FootballStat" / "updates"
        else:
            base_update_dir = Path.home() / ".local" / "share" / "FootballStat" / "updates"
        base_update_dir.mkdir(parents=True, exist_ok=True)

        # Temp paths
        zip_path = base_update_dir / "update.zip"
        temp_dir = tempfile.mkdtemp(prefix="footballstat_update_", dir=base_update_dir)

        # Download the zip
        print(f"Saving update zip to: {zip_path}")
        with requests.get(download_url, stream=True) as r_zip:
            r_zip.raise_for_status()
            with open(zip_path, "wb") as f:
                shutil.copyfileobj(r_zip.raw, f)
        print("Download complete.")

        # Extract the update
        print(f"Extracting to: {temp_dir}")
        if sys.platform == "darwin":
            subprocess.run(["ditto", "-x", "-k", zip_path, temp_dir], check=True)
        else:
            shutil.unpack_archive(zip_path, temp_dir)
        os.remove(zip_path)

        # --- macOS: Safe Atomic Swap for .app bundles ---
        if sys.platform == "darwin":
            print("Performing macOS atomic swap update...")

            # Find extracted .app
            new_app = None
            for item in os.listdir(temp_dir):
                if item.endswith(".app"):
                    new_app = Path(temp_dir) / item
                    break
            if not new_app:
                raise FileNotFoundError("No .app bundle found in the extracted update.")

            # Find current app bundle root
            current_app = Path(sys.argv[0]).resolve()
            while current_app.name != "Contents":
                current_app = current_app.parent
                if current_app.parent == current_app:
                    raise RuntimeError("Could not locate running .app bundle.")
            app_bundle = current_app.parent
            backup_app = app_bundle.with_name(f"{app_bundle.name}.old")

            print(f"Replacing app:\n  old: {app_bundle}\n  new: {new_app}")

            # Check permissions (if in /Applications, user may need admin)
            if not os.access(app_bundle.parent, os.W_OK):
                fallback_dir = Path.home() / "Downloads" / f"FootballStat_{new_version}"
                fallback_dir.mkdir(parents=True, exist_ok=True)
                shutil.copytree(new_app, fallback_dir, dirs_exist_ok=True)
                messagebox.showinfo(
                    "Manual Update Required",
                    f"The new version has been downloaded to:\n\n{fallback_dir}\n\n"
                    "Please drag it to your Applications folder to complete the update."
                )
                return

            # Atomic swap
            shutil.move(app_bundle, backup_app)
            shutil.move(new_app, app_bundle)

            # Relaunch the new version
            subprocess.Popen(["open", "-n", str(app_bundle)])
            messagebox.showinfo("Update Complete", f"Updated to version {new_version}.")
            sys.exit(0)

        # --- Windows: Replace extracted files in place ---
        elif sys.platform == "win32":
            exe_path = Path(sys.argv[0]).resolve()
            app_dir = exe_path.parent
            new_exe = None

            # Find the new exe inside extracted files
            for item in Path(temp_dir).glob("*.exe"):
                new_exe = item
                break
            if not new_exe:
                raise FileNotFoundError("No .exe found in the update package.")

            # Create a small batch file to replace the running exe
            bat_path = Path(tempfile.gettempdir()) / "footballstat_updater.bat"

            with open(bat_path, "w", encoding="utf-8") as bat:
                bat.write(f"""@echo off
        echo Updating FootballStat...
        timeout /t 1 /nobreak >nul
        move /y "{new_exe}" "{exe_path}" >nul
        start "" "{exe_path}"
        del "%~f0"
        """)

            # Run the batch file and exit
            print(f"Launching self-update batch: {bat_path}")
            subprocess.Popen(["cmd", "/c", "start", "", "/min", str(bat_path)], shell=True)

            messagebox.showinfo("Update", "FootballStat will restart to complete the update.")
            sys.exit(0)

        else:
            print("Unsupported platform for auto-update.")
            messagebox.showwarning("Update", "Automatic updates are not supported on this platform.")

    except Exception as e:
        print(f"Update failed: {e}")
        messagebox.showerror("Update Failed", f"Error: {e}")
