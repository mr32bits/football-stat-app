# Football Stat App

# Development Process

```zsh
cd backend/server
python3 manage.py runserver
```

and

```zsh
cd frontend
npm run dev
```

## Build Process

For a new Version change the version in `updater.py` to the format of `Version('vx.x.x-...')`.

```zsh
cd backend/server
pyinstaller server.spec
```

```zsh
cd backend/server/dist
ditto -c -k --sequesterRsrc --keepParent "server.app" "macos.zip"
```
