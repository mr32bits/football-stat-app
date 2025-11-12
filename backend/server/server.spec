# -*- mode: python ; coding: utf-8 -*-

import os
import sys
from pathlib import Path

spec_root = os.path.abspath('')
server_path = os.path.join(spec_root, 'server')
api_path = os.path.join(spec_root, 'api')

root = Path(spec_root).parent.parent
third_party_licenses = root / "THIRD_PARTY_LICENSES.json"
license = root / "LICENSE"

print("Building from:", spec_root)
print("Platform:", sys.platform)
print("Root:", root)
print("Third Licenses File:", third_party_licenses)
print("Licenses File:", third_party_licenses)

console=False

datas = []
from PyInstaller.utils.hooks import collect_data_files
datas += collect_data_files('rest_framework', include_py_files=True)
datas += [(spec_root + '/staticfiles', 'staticfiles'), (spec_root + '/static', 'static'), (spec_root + '/templates', 'templates'),
    (third_party_licenses, '.'), (license, '.')
]

a = Analysis(
    ['launcher.py'],
    pathex=[spec_root, server_path, api_path],
    binaries=[],
    datas=datas,
    hiddenimports=['api', 'manage',
        'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes', 'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles', 
        'whitenoise', 'whitenoise.middleware'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=2 if sys.platform == "darwin" else 1,
)
pyz = PYZ(a.pure)

exe = None

if sys.platform == "darwin":
    exe = EXE(
        pyz,
        a.scripts,
        [],
        exclude_binaries=True,
        name='FootballStats',
        debug=False,
        bootloader_ignore_signals=False,
        strip=False,
        upx=True,
        console=console,
        disable_windowed_traceback=False,
        argv_emulation=False,
        target_arch=None,
        codesign_identity=None,
        entitlements_file=None,
    )
else:
    exe = EXE(
        pyz,
        a.scripts,
        a.binaries,
        a.datas,
        [],
        exclude_binaries=False,
        name='FootballStats',
        debug=False,
        bootloader_ignore_signals=False,
        strip=False,
        upx=True,
        console=console,
        disable_windowed_traceback=False,
        argv_emulation=False,
        target_arch=None,
        codesign_identity=None,
        entitlements_file=None,
    )

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='FootballStats',
)

if sys.platform == "darwin":
    app = BUNDLE(exe,
        a.binaries,
        a.datas,
        upx=True,
        upx_exclude=[],
        name='FootballStats.app',
        icon=None,
        bundle_identifier=None
    )
