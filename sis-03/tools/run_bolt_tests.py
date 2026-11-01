"""Run original/final Bolt logic suites with Node 22.18+ (Node 24 recommended).

Only temporary import suffixes change; exported sources remain unchanged.
This does not render React or prove mobile/screen-reader behavior.
"""
from pathlib import Path
import subprocess
import tempfile
import sys

root = Path(__file__).resolve().parents[1]
for version in ['original', 'final']:
    source = root / 'web' / version / 'src' / 'lib'
    with tempfile.TemporaryDirectory() as folder:
        temp = Path(folder)
        (temp/'package.json').write_text('{"type":"module"}')
        for file in source.glob('*.ts'):
            text = file.read_text(encoding='utf-8')
            text = text.replace('from "./availability"', 'from "./availability.ts"')
            text = text.replace('from "./nowValidation"', 'from "./nowValidation.ts"')
            (temp/file.name).write_text(text, encoding='utf-8')
        print('\n=== Bolt ' + version + ' logic tests ===', flush=True)
        result = subprocess.run(['node', str(temp/'availability.test.ts')])
        if result.returncode:
            sys.exit(result.returncode)
print('\nAll logic suites passed. Browser and T12 are separate checks.')
