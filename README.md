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

```zsh
cd backend/server
pyinstaller server.spec
```

For a new Version change the version in `updater.py` and change the version.txt in `/app`.  
In the Format of `Version('x.x.x')` or `x.x.x`.
