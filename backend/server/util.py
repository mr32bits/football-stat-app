import sys
import os
from pathlib import Path

def resource_path(relative_path: str) -> str:
    try:
        base_path = Path(sys._MEIPASS,  '..' , 'Resources').resolve() if sys.platform == "darwin" else sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath('.')

    return os.path.join(base_path, relative_path)
