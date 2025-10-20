import tkinter as tk #for you it is pyqt5
from tkinter import *
from tkinter import messagebox #MessageBox and Button
import requests #pip install requests
import os #part of standard library
import sys #part of standard library

VERSION = 4

b1 = Button(frame, text = "Back", command = homepage)
b1.pack(ipadx= 10, ipady = 10, fill = X, expand = False, side = TOP)

checkupdate = Label(frame, text = "Looking for updates", font = ("Arial", 14))
checkupdate.pack()

try:
    link = "https://raw.githubusercontent.com/4/SomeRepo/main/SomeFolder/version.txt"
    check = requests.get(link)
    
    if float(VERSION) < float(check.text):
        mb1 = messagebox.askyesno('Update Available', 'There is an update available. Click yes to update.')
        if mb1 is True:
            filename = os.path.basename(sys.argv[0])

            for file in os.listdir():
                if file == filename:
                    pass

                else:
                    os.remove(file)

            exename = f'NameOfYourApp{float(check.text)}.exe'
            code = requests.get("https://raw.githubusercontent.com/SomeUser/SomeRepo/main/SomeFolder/NewUpdate.exe", allow_redirects = True)
            open(exename, 'wb').write(code.content)

            root.destroy()
            os.remove(sys.argv[0])
            sys.exit()
            
        elif mb1 == 'No':
            pass
        
    else:
        messagebox.showinfo('Updates Not Available', 'No updates are available')

except Exception as e:
    pass