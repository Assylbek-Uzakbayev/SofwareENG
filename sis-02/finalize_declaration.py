"""Update only submission.yml using the real current Git commit and checker results."""
import json
from pathlib import Path
import re
import subprocess
import sys

root = Path(__file__).resolve().parent
run = subprocess.run([sys.executable, 'tests/check_sis.py', '--json'], cwd=root, capture_output=True, text=True)
result = json.loads(run.stdout)
if run.returncode != 0:
    print('Checker changed or failed. Review its output before declaring:')
    print(run.stdout)
    raise SystemExit(1)
commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=root, text=True).strip()
path = root / 'submission.yml'
text = path.read_text(encoding='utf-8')
for field, value in [('pass', result['counts']['PASS']), ('fail', result['counts']['FAIL']), ('error', result['counts']['ERROR'])]:
    text = re.sub(r'^  ' + field + r':.*$', '  ' + field + ': ' + str(value), text, flags=re.M)
text = re.sub(r'^  commit:.*$', '  commit: "' + commit + '"', text, flags=re.M)
text = '\n'.join(line for line in text.splitlines() if not line.startswith('# Draft declaration:') and not line.startswith('# checker.commit is deliberately absent:')) + '\n'
path.write_text(text, encoding='utf-8')
print('Declared actual checker commit:', commit)
print('Run: python tests/validate_submission.py')
