# Football Stat App

![GitHub Tag](https://img.shields.io/github/v/tag/mr32bits/football-stat-app?label=Version&color=blue&link=https%3A%2F%2Fgithub.com%2Fmr32bits%2Ffootball-stat-app%2Freleases%2Flatest%2F)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mr32bits/football-stat-app/build-exe.yml?label=EXE)

# Development Process

```bash
cd backend/server
python3 manage.py runserver
```

and

```bash
cd frontend
npm run dev
```

## Build Process

Collecting the Third Party Package Licenses

```bash
pip-licenses --format=json --with-license-file --no-license-path > THIRD_PARTY_LICENSES.json

npm run build

./backend/server/sign_release_*.sh
```

For a new Version change the version in `updater.py` to the format of `'x.x.x'`.

---

Move from gui: `.js` & `.css` to the `/static`-folder.<br> And move from gui: `index.html` to the `/templates`-folder
