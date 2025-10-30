# -*- mode: python ; coding: utf-8 -*-

import os
import sys

spec_root = os.path.abspath('')
server_path = os.path.join(spec_root, 'server')
api_path = os.path.join(spec_root, 'api')

print("Building from:", spec_root)
print("Platform:", sys.platform)

datas = []
from PyInstaller.utils.hooks import collect_data_files
datas += collect_data_files('rest_framework', include_py_files=True)
datas += [(api_path, 'api'), (server_path, 'server'), (spec_root + '/staticfiles', 'staticfiles'), (spec_root + '/static', 'static'), (spec_root + '/templates', 'templates')]

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
    optimize=0,
)
pyz = PYZ(a.pure)

exe = None

if sys.platform == "darwin":
    exe = EXE(
        pyz,
        a.scripts,
        [],
        exclude_binaries=True,
        name='server',
        debug=False,
        bootloader_ignore_signals=False,
        strip=False,
        upx=True,
        console=True,
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
        name='server',
        debug=False,
        bootloader_ignore_signals=False,
        strip=False,
        upx=True,
        console=True,
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
    name='server',
)

if sys.platform == "darwin":
    app = BUNDLE(exe,
        a.binaries,
        a.datas,
        upx=True,
        upx_exclude=[],
        name='server.app',
        icon=None,
        bundle_identifier=None
    )
