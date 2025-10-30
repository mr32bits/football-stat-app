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

### Backend

For a new Version change the version in `updater.py` to the format of `Version('vx.x.x-...')`.

```zsh
cd backend/server
pyinstaller --clean --nonfirm server.spec
```

#### MacOS

```zsh
cd backend/server/dist
ditto -c -k --sequesterRsrc --keepParent "server.app" "macos.zip"
```

---

### Frontend

```zsh
cd frontend
npm run build
```

Move from gui: `.js` & `.css` to the `/static`-folder.<br> And move from gui: `index.html` to the `/templates`-folder

## TODO

- [ ] Player: Change the Players Goal Stats `{0: 2, 1: 3}`
