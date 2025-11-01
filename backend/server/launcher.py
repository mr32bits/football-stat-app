import os
import sys
import threading
import webbrowser
from django.core.management import execute_from_command_line

from tkinter import *
from tkinter import ttk

from updater import check_for_updates

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

def run_server(button):
    def start():
        webbrowser.open('http://127.0.0.1:8000')
        execute_from_command_line(['manage.py', 'runserver', '--noreload'])
    button.config(state=DISABLED)
    threading.Thread(target=start, daemon=True).start()

def start_ui():
    root = Tk()
    root.title('Football Stat Launcher')
    root.geometry('250x100')
    root.resizable(False, False)
    frm = ttk.Frame(root, padding=10)
    frm.pack()

    ttk.Label(frm, text='Start Football Stat Server').pack()
    start_btn = ttk.Button(frm, text='Start')
    start_btn.configure(command=lambda: run_server(start_btn))
    start_btn.pack()
    ttk.Button(frm, text='Quit', command=root.destroy).pack()
    root.mainloop()

def ensure_database_ready():
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("Database migrations applied successfully.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == '__main__':
    print('sys.argv[0]: ', sys.argv[0])

    check_for_updates()
    ensure_database_ready()
    start_ui()