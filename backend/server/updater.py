import shutil
import subprocess
import sys
import os
import tempfile
from tkinter import messagebox
import requests
from pathlib import Path

from version import Version

VERSION = Version('v0.0.1')

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

'''
def perform_update(new_version: Version, r:requests.Response):
    """Download and install the update."""
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

        # Pick a writable directory for temp files
        if sys.platform == "darwin":
            base_update_dir = Path.home() / "Library" / "Application Support" / "FootballStat" / "updates"
        elif sys.platform == "win32":
            base_update_dir = Path(os.getenv("APPDATA")) / "FootballStat" / "updates"
        else:
            base_update_dir = Path.home() / ".local" / "share" / "FootballStat" / "updates"

        os.makedirs(base_update_dir, exist_ok=True)


        # File paths
        zip_path = base_update_dir / "update.zip"
        temp_dir = tempfile.mkdtemp(prefix="footballstat_update_", dir=base_update_dir)

        # Download the ZIP to writable folder
        print(f"Saving update zip to: {zip_path}")
        with requests.get(download_url, stream=True) as r_zip:
            r_zip.raise_for_status()
            with open(zip_path, "wb") as f:
                shutil.copyfileobj(r_zip.raw, f)

        print("Download complete. Extracting...")

        # Extract update
        print(f"Extracting update to: {temp_dir}")

        try:
            shutil.unpack_archive(zip_path, temp_dir)
            os.remove(zip_path)
        except Exception as e:
            print(f"Extraction failed: {e}")
            return
        
        print(temp_dir)

        # Replace old app
        current_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        if sys.platform == "darwin":
            current_dir = Path(current_dir).parent.parent.parent
        elif sys.platform == "win32":
            current_dir = Path(current_dir).parent
        else:
            print(f'Destination to copy to: {current_dir}')
        print(f"Current app: {current_dir}")

        # Move new app to current folder
        for item in os.listdir(temp_dir):
            src = os.path.join(temp_dir, item)
            dst = os.path.join(current_dir, item)

            if os.path.basename(dst) == "db.sqlite3":
                continue

            print(f'src: {src}')
            print(f'dst: {dst}')
            if os.path.isdir(dst):
                shutil.rmtree(dst, ignore_errors=True)
            if os.path.isdir(src):
                shutil.copytree(src, dst, dirs_exist_ok=True)
            else:
                shutil.copy2(src, dst)

        shutil.rmtree(temp_dir, ignore_errors=True)

        print(f"Update to version {new_version} installed successfully.")
        messagebox.showinfo("Update Complete", f"Updated to version {new_version}")

        # Restart the app
        os.execv(sys.executable, [sys.executable] + sys.argv)

    except Exception as e:
        print(f"Update failed: {e}")
        messagebox.showerror("Update Failed", f"Error: {e}")
'''

def perform_update(new_version: Version, r: requests.Response):
    """Download and install the update (safe for macOS and Windows)."""
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
            current_dir = Path(sys.argv[0]).parent
            print(f"Replacing files in {current_dir}")

            for item in os.listdir(temp_dir):
                src = Path(temp_dir) / item
                dst = current_dir / item

                if dst.name.lower() == "db.sqlite3":
                    continue  # keep existing database

                if dst.is_dir():
                    shutil.rmtree(dst, ignore_errors=True)
                if src.is_dir():
                    shutil.copytree(src, dst, dirs_exist_ok=True)
                else:
                    shutil.copy2(src, dst)

            shutil.rmtree(temp_dir, ignore_errors=True)

            print(f"Update to version {new_version} installed successfully.")
            messagebox.showinfo("Update Complete", f"Updated to version {new_version}")

            # Restart the app
            os.execv(sys.executable, [sys.executable] + sys.argv)

        else:
            print("Unsupported platform for auto-update.")
            messagebox.showwarning("Update", "Automatic updates are not supported on this platform.")

    except Exception as e:
        print(f"Update failed: {e}")
        messagebox.showerror("Update Failed", f"Error: {e}")

def copy_database(target_dir: str):
    """
    Copy db.sqlite3 from the app's Resources folder to the new version's folder.
    Works for both macOS (.app) and Windows (/resources).
    """
    try:
        if sys.platform == "darwin":
            # Detect .app name dynamically
            app_bundle = next((f for f in os.listdir(os.getcwd()) if f.endswith(".app")), None)
            if not app_bundle:
                print("No .app bundle found.")
                return
            current_resources = os.path.join(os.getcwd(), app_bundle, "Contents", "Resources")
            new_resources = os.path.join(target_dir, app_bundle, "Contents", "Resources")
        elif sys.platform == "win32":
            current_resources = os.path.join(os.getcwd(), "resources")
            new_resources = os.path.join(target_dir, "resources")
        else:
            print("Unsupported platform for database copy.")
            return

        db_source = os.path.join(current_resources, "db.sqlite3")
        db_target = os.path.join(new_resources, "db.sqlite3")

        if not os.path.exists(db_source):
            print(f"Database not found in {db_source}, skipping copy.")
            return

        os.makedirs(new_resources, exist_ok=True)
        shutil.copy2(db_source, db_target)
        print(f"Copied database from {db_source} to {db_target}")

    except Exception as e:
        print(f"Failed to copy database: {e}")

