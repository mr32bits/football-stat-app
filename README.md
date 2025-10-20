# Football-Stats App

This is a local backend running `django` application using `electron` for football statistics.

---

Running

```zsh
cd server
python3 manage.py runserver
```

and

```zsh
cd frontend
npm run dev
```

Results in a dev-environment.

```zsh
#windows
pyinstaller --onefile ^
    --name DjangoLauncher ^
    --add-data "backend/server;backend/server" ^
    --hidden-import=corsheaders ^
    --collect-all rest_framework ^
    launcher.py#TODO

#mac/linux
pyinstaller --onefile \
    --name DjangoLauncher \
    --add-data 'backend/server:backend/server' \
    --add-data 'backend/server/server:backend/server/server' \
    --add-data 'backend/server/api:backend/server/api' \
    --hidden-import=django \
    --hidden-import=corsheaders \
    --collect-all rest_framework \
    launcher.py
```

```zsh
export DJANGO_SETTINGS_MODULE=settings
pyinstaller --name=server manage.py
```
