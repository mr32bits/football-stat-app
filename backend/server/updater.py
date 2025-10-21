import shutil
import sys
import os
from tkinter import messagebox
import requests

import tkinter

from version import Version

VERSION = Version('0.0.1')

def check_for_updates(active:bool=False):
    try:
        link = 'https://raw.githubusercontent.com/mr32bits/football-stat-app/main/app/version.txt'
        response = requests.get(link)
        online_version = Version(response.text.strip())

        if VERSION < online_version:
            reply = messagebox.askquestion(
                'Update Available',
                f'A new version ({online_version}) is available.\nDo you want to update?',
            )
            if reply == 'yes':
                print(f'Performing Update for Version ({online_version})')
                perform_update(online_version)
            else:
                print('Update skipped.')
        else:
            if active:
                messagebox.showinfo('Up to date', 'No updates are available.')
            #self.status_label.setText('You have the latest version.')
    except Exception as e:
        #self.status_label.setText(f'Error checking updates: {e}')
        print(f'Error checking updates: {e}')

def perform_update(new_version:Version):
    try:
        filename = os.path.basename(sys.argv[0])
        for file in os.listdir():
            if file != filename:
                try:
                    os.remove(file)
                except Exception:
                    pass

        # Choose correct file extension
        if sys.platform == 'win32':
            new_filename = f'FootballStat.exe'
            download_url = f'https://raw.githubusercontent.com/mr32bits/football-stat-app/main/app/FootballStat.exe'
        elif sys.platform == 'darwin':
            new_filename = f'FootballStat.app'
            download_url = f'https://raw.githubusercontent.com/mr32bits/football-stat-app/main/app/FootballStat.app'

        code = requests.get(download_url, allow_redirects=True)
        print('sys.argv[0]: ', sys.argv[0])

        if code.text != '404: Not Found':
            with open(new_filename, 'wb') as f:
                f.write(code.content)

            #Replace .db file
            copy_database()

            print('sys.argv[0]: ', sys.argv[0])

            # Remove old app
            os.remove(sys.argv[0])
            os.execv(new_filename, sys.argv)
        else:
            print('Update not Found:', code.text)

    except Exception as e:
        print('Update Failed', f'Error: {e}')
        #QMessageBox.critical(self, 'Update Failed', f'Error: {e}')

def copy_database():
    if sys.platform == 'darwin':
        # macOS .app Resources
        resources_path = 'dist/YourApp.app/Contents/Resources'
    elif sys.platform == 'win32':
        # Windows Resources folder
        resources_path = 'dist/resources'

    #TODO ADD MIGRATION: python manage.py makemigrations | python manage.py migrate

    db_source = 'db.sqlite3'
    if not os.path.exists(os.path.join(resources_path, db_source)):
        print('Database not found, skipping copy.')
        return

    os.makedirs(resources_path, exist_ok=True)
    shutil.copy(db_source, os.path.join(resources_path, 'db.sqlite3'))
    print(f'Copied database to {resources_path}')

if __name__ == '__main__':
    print('UPADTER')
    check_for_updates()
