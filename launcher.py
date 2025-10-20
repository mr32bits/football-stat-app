import webbrowser
import time
import os, sys
import platform
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    #sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'server'))
    #sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, BASE_DIR)

    print(sys.path)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.server.server.settings')

    # Run Django’s internal command directly
    args = ['manage.py', 'runserver', '127.0.0.1:8000']
    if getattr(sys, 'frozen', False):  # Running as a PyInstaller exe
        args.append('--noreload')
    
    #Opening the browser
    #webbrowser.open("http://127.0.0.1:8000")

    print("Starting Django server...")
    execute_from_command_line(args)
