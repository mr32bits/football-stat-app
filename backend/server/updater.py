import sys
import os
import requests

import tkinter
from tkinter import *
from tkinter import ttk

VERSION = 4.0

def check_for_updates(self):
    try:
        link = "https://raw.githubusercontent.com/mr32bits/football-stat-app/main/app/version.txt"
        response = requests.get(link)
        online_version = float(response.text.strip())

        if VERSION < online_version:
            reply = tkinter.messagebox.askquestion(
                "Update Available",
                f"A new version ({online_version}) is available.\nDo you want to update?",
            )
            if reply == 'yes':
                self.perform_update(online_version)
            else:
                self.status_label.setText("Update skipped.")
        else:
            tkinter.messagebox.showinfo("Up to date", "No updates are available.")
            self.status_label.setText("You have the latest version.")
    except Exception as e:
        self.status_label.setText(f"Error checking updates: {e}")

def perform_update(self, new_version):
    try:
        filename = os.path.basename(sys.argv[0])
        for file in os.listdir():
            if file != filename:
                try:
                    os.remove(file)
                except Exception:
                    pass

        # Choose correct file extension
        if sys.platform == "win32":
            new_filename = f"YourApp{new_version}.exe"
            download_url = "https://raw.githubusercontent.com/mr32bits/football-stat-app/main/app/NewUpdate.exe"
        else:
            new_filename = f"YourApp{new_version}.app"
            download_url = "https://raw.githubusercontent.com/mr32bits/football-stat-app/main/app/NewUpdate.app"

        code = requests.get(download_url, allow_redirects=True)
        with open(new_filename, "wb") as f:
            f.write(code.content)

        # Remove old app
        os.remove(sys.argv[0])
        os.execv(new_filename, sys.argv)

    except Exception as e:
        QMessageBox.critical(self, "Update Failed", f"Error: {e}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = UpdateChecker()
    window.show()
    sys.exit(app.exec_())
