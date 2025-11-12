import os
from sys import platform
import threading
import tkinter
import webbrowser
from django.core.management import execute_from_command_line

from tkinter import *
from tkinter import ttk

from waitress import serve

from updater import check_for_updates
from util import resource_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
ICON = "icon-windowed.icns" if platform == "darwin" else ""

def run_server(button):
    def start():
        webbrowser.open('http://127.0.0.1:8000')
        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        serve(application, host='127.0.0.1', port=8000)
        #execute_from_command_line(['manage.py', 'runserver', '--noreload'])
    button.config(state=DISABLED)
    threading.Thread(target=start, daemon=True).start()

def start_ui():
    root = Tk()
    root.title('Football Stats Launcher')
    root.geometry('300x180')
    root.minsize(300, 180)
    frm = ttk.Frame(root, padding=10)
    frm.pack(fill=BOTH, expand=True)

    from PIL import ImageTk, Image
    img = ImageTk.PhotoImage(Image.open(resource_path(ICON)).resize((45, 45)))
    ttk.Label(frm, image=img).pack()

    from tkinter import font
    f = font.Font(size=18)
    ttk.Label(frm, text='Football Stats Server', font=f).pack()

    button_frm = ttk.Frame(frm)

    start_btn = ttk.Button(button_frm, text='Start', default=ACTIVE)
    start_btn.configure(command=lambda: run_server(start_btn))
    start_btn.grid(row=1, column=1, sticky=EW)

    ttk.Button(button_frm, text='Check for Update', command=lambda: check_for_updates(active=True)).grid(row=2, column=1, sticky=EW)

    ttk.Button(button_frm, text='Quit', command=root.destroy).grid(row=3, column=1, sticky=EW)

    button_frm.pack()

    root.update()
    root.mainloop()

def ensure_database_ready():
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("Database migrations applied successfully.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == '__main__':
    check_for_updates()
    ensure_database_ready()
    start_ui()